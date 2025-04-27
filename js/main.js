/**
 * js/main.js
 * **VERSIONE FINALE + AVANZAMENTO ORDINATO PER CATEGORIE SPECIFICHE**
 */

import { renderExercise } from './vexflow_renderer.js';
import { initializeMIDI } from './midi_handler.js';

// --- Costanti e Riferimenti DOM ---
const categorySelect = document.getElementById('category-select');
const exerciseSelect = document.getElementById('exercise-select');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const scoreDivId = 'score';
const midiStatusSpan = document.getElementById('midi-status');
const successRateSpan = document.getElementById('success-rate');
const expectedNoteSpan = document.getElementById('expected-note');
const playedNoteSpan = document.getElementById('played-note');

// === NUOVO: Array per categorie con avanzamento ordinato ===
const ORDERED_CATEGORIES = ['accordi_rivolti']; // Aggiungi qui altre chiavi di categoria se necessario

// --- Stato Applicazione ---
let allExercises = {};
let currentExerciseData = null;
let currentExerciseDefinition = null;
let totalNotesPerRepetition = 0;
let correctNotesThisRepetition = 0;
let currentRepetition = 1;
let targetRepetitions = 1;
let isPlaying = false;
let midiReady = false;
let exerciseCompletionTimeout = null;

// --- Funzioni Inizializzazione ---
function loadExerciseData() { /* ... (Invariata dall'ultima versione con fix pause) ... */
    if (window.exerciseData) { allExercises = window.exerciseData; Object.entries(allExercises).forEach(([category, exercises]) => { if (!Array.isArray(exercises)) { console.error(`Errore dati categoria "${category}"`); return; } exercises.forEach((ex, index) => { if (!ex || typeof ex !== 'object') { console.error(`Esercizio ${category}[${index}] non è oggetto.`); return; } let dataOk = true; let noteCount = 0; ['notes', 'notesTreble', 'notesBass'].forEach(key => { if (ex[key]) { if(!Array.isArray(ex[key])) { console.error(`Errore dati ${ex.id || index}: "${key}" non è array.`); dataOk = false; return; } if (!ex[key].every(n => (n && n.keys && Array.isArray(n.keys) && n.keys[0]?.toLowerCase().startsWith('r/')) || (n && typeof n.midiValue === 'number') || (n && Array.isArray(n.midiValues) && n.midiValues.length > 0))) { dataOk = false; console.warn(`ATTENZIONE: Esercizio "${ex.id || index}" formato dati MIDI errato in "${key}"`); } else { ex[key].forEach(noteObj => { if (!(noteObj.keys && noteObj.keys[0]?.toLowerCase().startsWith('r/'))) { if (typeof noteObj.midiValue === 'number') noteCount++; else if (Array.isArray(noteObj.midiValues)) noteCount += noteObj.midiValues.length; } }); } } }); if (!dataOk) console.error(`Esercizio ${category}[${index}] ('${ex.id || 'NO ID'}') ha dati MIDI mancanti o malformati.`); }); }); console.log("Dati caricati e verificati.");
    } else { console.error("Errore caricamento dati: window.exerciseData non trovato."); } populateCategorySelect();
}
function populateCategorySelect() { const categories = Object.keys(allExercises); categorySelect.innerHTML = '<option value="">-- Categoria --</option>'; categories.forEach(catKey => { const option = document.createElement('option'); option.value = catKey; option.textContent = catKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); categorySelect.appendChild(option); }); }
function populateExerciseSelect(categoryKey) { exerciseSelect.innerHTML = '<option value="">-- Esercizio --</option>'; exerciseSelect.disabled = true; if (categoryKey && allExercises[categoryKey] && Array.isArray(allExercises[categoryKey])) { const exercises = allExercises[categoryKey]; exercises.forEach(ex => { if(ex && ex.id){ const option = document.createElement('option'); option.value = ex.id; option.textContent = ex.name || ex.id; exerciseSelect.appendChild(option); } else { console.warn("Esercizio senza ID in:", categoryKey)} }); exerciseSelect.disabled = false; } else { exerciseSelect.innerHTML = '<option value="">-- Seleziona Categoria --</option>'; console.warn(`Cat "${categoryKey}" non valida`); } resetUIState(); document.getElementById(scoreDivId).innerHTML = '<p>Seleziona un esercizio.</p>'; startButton.disabled = true; }

// --- Gestione Stato Esercizio ---
function selectExercise(exerciseId, categoryKey) {
    // (Identica alla versione precedente funzionante)
    if (!exerciseId || !categoryKey || !allExercises[categoryKey] || !Array.isArray(allExercises[categoryKey])) { /* ... reset ... */ return; }
    currentExerciseDefinition = allExercises[categoryKey].find(ex => ex.id === exerciseId);
    if (currentExerciseDefinition) { console.log("Selezionato:", currentExerciseDefinition.name || currentExerciseDefinition.id); let hasValidMidiData = true; totalNotesPerRepetition = 0; ['notes', 'notesTreble', 'notesBass'].forEach(key => { if (currentExerciseDefinition[key]) { if (!currentExerciseDefinition[key].every(n => (n.keys && n.keys[0]?.toLowerCase().startsWith('r/')) || typeof n.midiValue === 'number' || (Array.isArray(n.midiValues) && n.midiValues.length > 0))) { hasValidMidiData = false; console.error(`Errore dati MIDI in "${key}"`); } else { currentExerciseDefinition[key].forEach(noteObj => { if (!(noteObj.keys && noteObj.keys[0]?.toLowerCase().startsWith('r/'))) { if(typeof noteObj.midiValue === 'number') totalNotesPerRepetition++; else if (Array.isArray(noteObj.midiValues)) totalNotesPerRepetition += noteObj.midiValues.length; } }); } } }); if (!hasValidMidiData) { document.getElementById(scoreDivId).innerHTML = `<p style="color: red;">Errore dati.</p>`; currentExerciseData = null; currentExerciseDefinition = null; startButton.disabled = true; totalNotesPerRepetition = 0; resetUIState(); return; } targetRepetitions = currentExerciseDefinition.repetitions || 1; console.log(`Note/rip: ${totalNotesPerRepetition}, Ripetizioni: ${targetRepetitions}`); if (totalNotesPerRepetition === 0 /* && Controlli pause... */) { console.warn("Esercizio senza note suonabili."); startButton.disabled = true; } else { startButton.disabled = !midiReady; } currentExerciseData = JSON.parse(JSON.stringify(currentExerciseDefinition)); resetNoteStates(); if (totalNotesPerRepetition > 0 || (currentExerciseData.notesTreble?.length > 0 || currentExerciseData.notesBass?.length > 0 || currentExerciseData.notes?.length > 0) ) { renderExercise(scoreDivId, currentExerciseData); } else { document.getElementById(scoreDivId).innerHTML = ''; } resetUIState(); stopButton.disabled = true;
    } else { console.error(`Esercizio ID "${exerciseId}" non trovato.`); /* ... reset ... */ }
}

function resetNoteStates() {
    // (Identica alla versione precedente funzionante)
    if (!currentExerciseData) return; correctNotesThisRepetition = 0; ['notes', 'notesTreble', 'notesBass'].forEach(key => { if (currentExerciseData[key]) { currentExerciseData[key].forEach(noteObj => { if (!(noteObj.keys && noteObj.keys[0]?.toLowerCase().startsWith('r/'))) { noteObj.status = 'pending'; noteObj.correctMidiValues = []; } else { noteObj.status = 'rest'; } }); } });
}
function startExercise() {
    // (Identica alla versione precedente funzionante)
    if (!currentExerciseData || !midiReady || totalNotesPerRepetition === 0) return; if (exerciseCompletionTimeout) clearTimeout(exerciseCompletionTimeout); exerciseCompletionTimeout = null; currentRepetition = 1; resetNoteStates(); console.log("Avvio:", currentExerciseData.name || currentExerciseData.id, `- Ripetizione ${currentRepetition}/${targetRepetitions}`); isPlaying = true; startButton.disabled = true; stopButton.disabled = false; categorySelect.disabled = true; exerciseSelect.disabled = true; updateSuccessRate(); highlightPendingNotes(); renderExercise(scoreDivId, currentExerciseData); updateInfo(`Ripetizione ${currentRepetition}/${targetRepetitions}. Suona.`); playedNoteSpan.textContent = '--';
}
function stopExercise() {
    // (Identica alla versione precedente funzionante)
    if (exerciseCompletionTimeout) clearTimeout(exerciseCompletionTimeout); exerciseCompletionTimeout = null; console.log("Arresto esercizio."); isPlaying = false; if (currentExerciseData) { resetNoteStates(); renderExercise(scoreDivId, currentExerciseData); } startButton.disabled = !midiReady || !currentExerciseData || totalNotesPerRepetition === 0; stopButton.disabled = true; categorySelect.disabled = false; exerciseSelect.disabled = false; updateInfo("--");
}
function resetUIState() {
    // (Identica alla versione precedente funzionante)
    isPlaying = false; successRateSpan.textContent = '-- %'; updateInfo("--"); playedNoteSpan.textContent = '--'; stopButton.disabled = true; if (exerciseCompletionTimeout) { clearTimeout(exerciseCompletionTimeout); exerciseCompletionTimeout = null; }
}
function updateSuccessRate() {
    // (Identica alla versione precedente funzionante)
     if (totalNotesPerRepetition === 0) { successRateSpan.textContent = 'N/A'; } else { const currentCorrect = Math.min(correctNotesThisRepetition, totalNotesPerRepetition); const percentage = ((currentCorrect / totalNotesPerRepetition) * 100).toFixed(1); successRateSpan.textContent = `${percentage} %`; }
}
function highlightPendingNotes() {
    // (Identica alla versione precedente funzionante)
     if (!currentExerciseData) return; ['notes', 'notesTreble', 'notesBass'].forEach(key => { if (currentExerciseData[key]) { currentExerciseData[key].forEach(noteObj => { if (!(noteObj.keys && noteObj.keys[0]?.toLowerCase().startsWith('r/')) && noteObj.status !== 'correct') { noteObj.status = 'expected'; } if (Array.isArray(noteObj.midiValues)) { noteObj.correctMidiValues = []; } }); } });
}
function updateInfo(message) { expectedNoteSpan.textContent = message; }

// --- Gestione Input MIDI (Logica libera, invariata) ---
function handleNoteOn(noteName, midiNote, velocity) {
    // (Identica alla versione precedente funzionante V4)
    playedNoteSpan.textContent = `${noteName} (MIDI: ${midiNote}, Vel: ${velocity})`;
    if (!isPlaying || !currentExerciseData) return;
    console.log(`Input: ${noteName} (MIDI: ${midiNote}) - Rep: ${currentRepetition}`);
    let noteMatchedAndMarked = false; let foundInBass = false; let foundInTreble = false;
    const findAndMarkFirstNote = (notesArray, arrayName) => { if (!notesArray) return false; for (let noteObj of notesArray) { if (noteObj.status === 'expected') { if (typeof noteObj.midiValue === 'number' && noteObj.midiValue === midiNote) { noteObj.status = 'correct'; correctNotesThisRepetition++; noteMatchedAndMarked = true; console.log(`   Correct Single in ${arrayName}! Count: ${correctNotesThisRepetition}/${totalNotesPerRepetition}`); return true; } else if (Array.isArray(noteObj.midiValues) && noteObj.midiValues.includes(midiNote) && !noteObj.correctMidiValues.includes(midiNote)) { noteObj.correctMidiValues.push(midiNote); correctNotesThisRepetition++; noteMatchedAndMarked = true; console.log(`   Correct Chord Note in ${arrayName}! Count: ${correctNotesThisRepetition}/${totalNotesPerRepetition}. Chord Notes: ${noteObj.correctMidiValues.length}/${noteObj.midiValues.length}`); if (noteObj.correctMidiValues.length >= noteObj.midiValues.length) { noteObj.status = 'correct'; console.log("   -> Chord complete this repetition!"); } return true; } } } return false; };
    const trebleArrayKey = currentExerciseData.notesTreble ? 'notesTreble' : (currentExerciseData.clef !== 'bass' ? 'notes' : null); const bassArrayKey = currentExerciseData.notesBass ? 'notesBass' : (currentExerciseData.clef === 'bass' ? 'notes' : null);
    if (bassArrayKey && currentExerciseData[bassArrayKey]) { console.log("-> Searching Bass Array..."); foundInBass = findAndMarkFirstNote(currentExerciseData[bassArrayKey], bassArrayKey); }
    if (!foundInBass) { if (trebleArrayKey && currentExerciseData[trebleArrayKey]) { console.log("-> Searching Treble Array..."); foundInTreble = findAndMarkFirstNote(currentExerciseData[trebleArrayKey], trebleArrayKey); } }
    if (noteMatchedAndMarked) { updateSuccessRate(); renderExercise(scoreDivId, currentExerciseData); if (correctNotesThisRepetition >= totalNotesPerRepetition) { console.log(`--- Ripetizione ${currentRepetition} completata! ---`); currentRepetition++; if (currentRepetition > targetRepetitions) { handleExerciseCompletion(); } else { console.log(`Avvio ripetizione ${currentRepetition}/${targetRepetitions}`); setTimeout(() => { resetNoteStates(); highlightPendingNotes(); renderExercise(scoreDivId, currentExerciseData); updateInfo(`Ripetizione ${currentRepetition}/${targetRepetitions}. Suona.`); updateSuccessRate(); }, 300); } }
    } else { console.log("   Invalid note played or target already correct."); playedNoteSpan.style.color = 'red'; setTimeout(() => { playedNoteSpan.style.color = ''; }, 500); }
}

// --- Gestione Completamento Esercizio (MODIFICATA) ---
function handleExerciseCompletion() {
    console.log("Esercizio (tutte le ripetizioni) completato!");
    isPlaying = false; stopButton.disabled = true; updateInfo("Completato!");

    const currentCategoryKey = categorySelect.value;
    const currentExerciseId = currentExerciseDefinition?.id; // ID dell'esercizio appena finito

    if (!currentCategoryKey || !allExercises[currentCategoryKey] || !currentExerciseId) {
        console.error("Stato non valido per determinare prossimo esercizio.");
        // Riabilita UI generale
        categorySelect.disabled = false; exerciseSelect.disabled = false;
        startButton.disabled = !midiReady || !currentExerciseData || totalNotesPerRepetition === 0;
        return;
    }

    const categoryExercises = allExercises[currentCategoryKey]; // Array degli esercizi della categoria corrente
    let nextExercise = null;

    // === Logica Avanzamento Ordinato vs Random ===
    if (ORDERED_CATEGORIES.includes(currentCategoryKey)) {
        console.log(`Categoria "${currentCategoryKey}" è ordinata. Cerco esercizio successivo.`);
        // Trova l'indice dell'esercizio corrente nell'array della sua categoria
        const currentIndex = categoryExercises.findIndex(ex => ex.id === currentExerciseId);

        if (currentIndex !== -1 && currentIndex < categoryExercises.length - 1) {
            // Se trovato e NON è l'ultimo, prendi il prossimo nell'array
            nextExercise = categoryExercises[currentIndex + 1];
            console.log(`Prossimo esercizio (ordinato): ${nextExercise.name || nextExercise.id}`);
        } else {
            // Era l'ultimo della categoria o non trovato (improbabile)
            console.log("Ultimo esercizio della categoria ordinata completato.");
            nextExercise = null; // Indica che la categoria è finita
        }
    } else {
        // Logica Random per categorie non ordinate
        console.log(`Categoria "${currentCategoryKey}" non ordinata. Cerco esercizio random.`);
        const availableExercises = categoryExercises.filter(ex => ex.id !== currentExerciseId);
        if (availableExercises.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableExercises.length);
            nextExercise = availableExercises[randomIndex];
            console.log(`Prossimo esercizio (random): ${nextExercise.name || nextExercise.id}`);
        } else {
            console.log("Nessun altro esercizio disponibile in questa categoria.");
            nextExercise = null; // Indica che la categoria è finita
        }
    }
    // ============================================

    // Gestione passaggio all'esercizio successivo o fine categoria
    if (nextExercise) {
        const delay = 2000; // Delay prima di caricare il prossimo
        playedNoteSpan.textContent = "Bravo!";
        updateInfo(`Prossimo: ${nextExercise.name || nextExercise.id}...`);
        exerciseCompletionTimeout = setTimeout(() => {
            exerciseCompletionTimeout = null;
            exerciseSelect.value = nextExercise.id; // Aggiorna il dropdown
            selectExercise(nextExercise.id, currentCategoryKey); // Carica il prossimo
            if (midiReady) { setTimeout(startExercise, 100); } // Avvia automaticamente se MIDI pronto
            else { console.warn("MIDI non pronto."); startButton.disabled = true; }
        }, delay);
    } else {
        // Categoria completata (o nessun altro esercizio)
        console.log("Categoria completata!");
        updateInfo("Categoria Completata!");
        playedNoteSpan.textContent = "Ottimo Lavoro!";
        // Riabilita i controlli per scegliere nuova categoria/esercizio
        categorySelect.disabled = false; exerciseSelect.disabled = false;
        startButton.disabled = !midiReady || !currentExerciseData || totalNotesPerRepetition === 0;
    }
}

// --- Funzione updateMidiStatus ---
function updateMidiStatus(message, isConnected) {
    // (Identica alla versione precedente funzionante)
    midiStatusSpan.textContent = message; midiReady = isConnected; startButton.disabled = !isConnected || !currentExerciseData || isPlaying || totalNotesPerRepetition === 0; if (!isConnected && isPlaying) { console.warn("MIDI disconnesso durante esercizio."); stopExercise(); alert("Dispositivo MIDI disconnesso!"); }
}

// --- Event Listeners ---
// (Identici alla versione precedente funzionante)
categorySelect.addEventListener('change', (e) => { populateExerciseSelect(e.target.value); });
exerciseSelect.addEventListener('change', (e) => { selectExercise(e.target.value, categorySelect.value); });
startButton.addEventListener('click', startExercise);
stopButton.addEventListener('click', stopExercise);

// --- Inizializzazione ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Caricato. Init versione finale con avanzamento ordinato...");
    loadExerciseData();
    initializeMIDI(handleNoteOn, updateMidiStatus);
});