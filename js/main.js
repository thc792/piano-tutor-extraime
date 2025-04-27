/**
 * js/main.js
 * **VERSIONE FINALE: Input Indipendente + Gestione Accordi + Ripetizioni + Gestione Pause**
 */

import { renderExercise } from './vexflow_renderer.js';
import { initializeMIDI } from './midi_handler.js';

// --- Costanti e Riferimenti DOM ---
const MIDI_SPLIT_POINT = 60; // C4 (Note < 60 vanno al Basso, >= 60 al Violino)
const categorySelect = document.getElementById('category-select');
const exerciseSelect = document.getElementById('exercise-select');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const scoreDivId = 'score';
const midiStatusSpan = document.getElementById('midi-status');
const successRateSpan = document.getElementById('success-rate');
const expectedNoteSpan = document.getElementById('expected-note'); // Info/Ripetizioni
const playedNoteSpan = document.getElementById('played-note');

// --- Stato Applicazione ---
let allExercises = {};
let currentExerciseData = null;         // Copia di lavoro modificabile dell'esercizio
let currentExerciseDefinition = null; // Riferimento all'originale per repetitions, ecc.
let totalNotesPerRepetition = 0;    // Note INDIVIDUALI per singola ripetizione
let correctNotesThisRepetition = 0; // Note INDIVIDUALI corrette nella ripetizione corrente
let currentRepetition = 1;            // Ripetizione attuale (parte da 1)
let targetRepetitions = 1;            // Ripetizioni totali richieste dall'esercizio
let isPlaying = false;
let midiReady = false;
let exerciseCompletionTimeout = null; // Timeout per passare all'esercizio successivo

// --- Funzioni Inizializzazione ---
function loadExerciseData() {
    if (window.exerciseData) {
        allExercises = window.exerciseData;
        // Verifica base dati (ignora pause nella verifica MIDI)
        Object.entries(allExercises).forEach(([category, exercises]) => {
             if (!Array.isArray(exercises)) { console.error(`Errore: i dati per la categoria "${category}" non sono un array.`); return; }
             exercises.forEach((ex, index) => {
                 if (!ex || typeof ex !== 'object') { console.error(`Esercizio ${category}[${index}] non è un oggetto valido.`); return; }
                 let dataOk = true; let noteCount = 0;
                 ['notes', 'notesTreble', 'notesBass'].forEach(key => {
                     if (ex[key]) {
                         if(!Array.isArray(ex[key])) { console.error(`Errore dati ${ex.id || index}: "${key}" non è array.`); dataOk = false; return; }
                         // Verifica dati MIDI o se è una pausa
                         if (!ex[key].every(n =>
                                 (n && n.keys && Array.isArray(n.keys) && n.keys[0]?.toLowerCase().startsWith('r/')) || // Permetti pause (case insensitive)
                                 (n && typeof n.midiValue === 'number') ||
                                 (n && Array.isArray(n.midiValues) && n.midiValues.length > 0)
                             )) {
                             dataOk = false;
                             console.warn(`ATTENZIONE: Esercizio "${ex.id || index}" manca dati MIDI validi o ha formato errato in "${key}"`);
                         } else {
                             // Conta solo note suonabili
                             ex[key].forEach(noteObj => {
                                 if (!(noteObj.keys && noteObj.keys[0]?.toLowerCase().startsWith('r/'))) {
                                     if (typeof noteObj.midiValue === 'number') noteCount++;
                                     else if (Array.isArray(noteObj.midiValues)) noteCount += noteObj.midiValues.length;
                                 }
                             });
                         }
                     }
                 });
                 if (!dataOk) console.error(`Esercizio ${category}[${index}] ('${ex.id || 'NO ID'}') ha dati MIDI mancanti o malformati.`);
                 // Avvisa se un esercizio definito sembra non avere note suonabili
                 if (noteCount === 0 && dataOk && (ex.notesTreble?.length > 0 || ex.notesBass?.length > 0 || ex.notes?.length > 0) && !(ex.notesTreble?.every(n=>n.keys[0]?.toLowerCase().startsWith('r/'))) && !(ex.notesBass?.every(n=>n.keys[0]?.toLowerCase().startsWith('r/'))) && !(ex.notes?.every(n=>n.keys[0]?.toLowerCase().startsWith('r/')))) {
                     console.warn(`Esercizio ${category}[${index}] ('${ex.id || 'NO ID'}') sembra non avere note suonabili (solo pause?).`);
                 }
             });
        });
        console.log("Dati caricati e verificati.");
    } else { console.error("Errore caricamento dati esercizi: window.exerciseData non trovato."); }
    populateCategorySelect();
}
function populateCategorySelect() { const categories = Object.keys(allExercises); categorySelect.innerHTML = '<option value="">-- Categoria --</option>'; categories.forEach(catKey => { const option = document.createElement('option'); option.value = catKey; option.textContent = catKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); categorySelect.appendChild(option); }); }
function populateExerciseSelect(categoryKey) { exerciseSelect.innerHTML = '<option value="">-- Esercizio --</option>'; exerciseSelect.disabled = true; if (categoryKey && allExercises[categoryKey] && Array.isArray(allExercises[categoryKey])) { const exercises = allExercises[categoryKey]; exercises.forEach(ex => { if(ex && ex.id){ const option = document.createElement('option'); option.value = ex.id; option.textContent = ex.name || ex.id; exerciseSelect.appendChild(option); } else { console.warn("Trovato esercizio senza ID in categoria:", categoryKey)} }); exerciseSelect.disabled = false; } else { exerciseSelect.innerHTML = '<option value="">-- Seleziona Categoria --</option>'; console.warn(`Categoria "${categoryKey}" non trovata o non è un array in window.exerciseData`); } resetUIState(); document.getElementById(scoreDivId).innerHTML = '<p>Seleziona un esercizio.</p>'; startButton.disabled = true; }

// --- Gestione Stato Esercizio ---
function selectExercise(exerciseId, categoryKey) {
    if (!exerciseId || !categoryKey || !allExercises[categoryKey] || !Array.isArray(allExercises[categoryKey])) {
        currentExerciseData = null; currentExerciseDefinition = null; startButton.disabled = true; totalNotesPerRepetition = 0;
        document.getElementById(scoreDivId).innerHTML = '<p>Selezione non valida o categoria non trovata.</p>';
        resetUIState(); return;
    }
    currentExerciseDefinition = allExercises[categoryKey].find(ex => ex.id === exerciseId);
    if (currentExerciseDefinition) {
        console.log("Selezionato:", currentExerciseDefinition.name || currentExerciseDefinition.id);
        // Verifica dati MIDI e calcola note per ripetizione
        let hasValidMidiData = true; totalNotesPerRepetition = 0;
        ['notes', 'notesTreble', 'notesBass'].forEach(key => {
             if (currentExerciseDefinition[key]) {
                 if (!currentExerciseDefinition[key].every(n => (n.keys && n.keys[0]?.toLowerCase().startsWith('r/')) || typeof n.midiValue === 'number' || (Array.isArray(n.midiValues) && n.midiValues.length > 0))) {
                     hasValidMidiData = false; console.error(`Errore dati MIDI in "${key}" per ${exerciseId}`);
                 } else {
                      currentExerciseDefinition[key].forEach(noteObj => {
                          if (!(noteObj.keys && noteObj.keys[0]?.toLowerCase().startsWith('r/'))) { // Ignora pause
                             if(typeof noteObj.midiValue === 'number') totalNotesPerRepetition++;
                             else if (Array.isArray(noteObj.midiValues)) totalNotesPerRepetition += noteObj.midiValues.length;
                          }
                     });
                 }
             }
         });
        if (!hasValidMidiData) { document.getElementById(scoreDivId).innerHTML = `<p style="color: red;">Errore dati esercizio: dati MIDI mancanti o malformati.</p>`; currentExerciseData = null; currentExerciseDefinition = null; startButton.disabled = true; totalNotesPerRepetition = 0; resetUIState(); return; }

        targetRepetitions = currentExerciseDefinition.repetitions || 1; // Legge repetitions, default 1
        console.log(`Note suonabili per ripetizione: ${totalNotesPerRepetition}, Ripetizioni target: ${targetRepetitions}`);

        // Abilita Start solo se ci sono note da suonare
        if (totalNotesPerRepetition === 0) {
            console.warn("Esercizio selezionato non contiene note suonabili.");
            startButton.disabled = true;
             document.getElementById(scoreDivId).innerHTML = '<p>Questo esercizio non contiene note da suonare.</p>';
        } else {
             startButton.disabled = !midiReady;
             document.getElementById(scoreDivId).innerHTML = ''; // Pulisce area score
        }

        currentExerciseData = JSON.parse(JSON.stringify(currentExerciseDefinition)); // Copia per stato
        resetNoteStates(); // Imposta stati iniziali
        if (totalNotesPerRepetition > 0) { // Renderizza solo se ci sono note
           renderExercise(scoreDivId, currentExerciseData);
        }
        resetUIState(); // Resetta solo l'UI
        stopButton.disabled = true;

    } else {
        console.error(`Esercizio ID "${exerciseId}" non trovato in categoria "${categoryKey}".`);
        currentExerciseData = null; currentExerciseDefinition = null; startButton.disabled = true; totalNotesPerRepetition = 0; resetUIState();
    }
}

// Resetta stato note e contatore ripetizione
function resetNoteStates() {
    if (!currentExerciseData) return;
    correctNotesThisRepetition = 0;
     ['notes', 'notesTreble', 'notesBass'].forEach(key => {
        if (currentExerciseData[key]) {
            currentExerciseData[key].forEach(noteObj => {
                if (!(noteObj.keys && noteObj.keys[0]?.toLowerCase().startsWith('r/'))) { // Ignora pause
                    noteObj.status = 'pending';
                    noteObj.correctMidiValues = []; // Resetta note corrette interne accordo
                } else {
                    noteObj.status = 'rest'; // Stato specifico per pause (per Vexflow se necessario)
                }
            });
        }
    });
}

function startExercise() {
    if (!currentExerciseData || !midiReady || totalNotesPerRepetition === 0) return; // Controllo note > 0
    if (exerciseCompletionTimeout) clearTimeout(exerciseCompletionTimeout);
    exerciseCompletionTimeout = null;

    currentRepetition = 1;
    resetNoteStates(); // Resetta stati e contatore
    console.log("Avvio:", currentExerciseData.name || currentExerciseData.id, `- Ripetizione ${currentRepetition}/${targetRepetitions}`);
    isPlaying = true;
    startButton.disabled = true; stopButton.disabled = false;
    categorySelect.disabled = true; exerciseSelect.disabled = true;

    updateSuccessRate(); // Aggiorna % (mostrerà 0%)
    highlightPendingNotes(); // Metti 'expected' (blu) le note suonabili
    renderExercise(scoreDivId, currentExerciseData); // Renderizza stato iniziale
    updateInfo(`Ripetizione ${currentRepetition}/${targetRepetitions}. Suona le note.`);
    playedNoteSpan.textContent = '--';
}

function stopExercise() {
    if (exerciseCompletionTimeout) clearTimeout(exerciseCompletionTimeout);
    exerciseCompletionTimeout = null;
    console.log("Arresto esercizio.");
    isPlaying = false;

    if (currentExerciseData) {
        resetNoteStates(); // Riporta a pending per visualizzazione
        renderExercise(scoreDivId, currentExerciseData);
    }

    startButton.disabled = !midiReady || !currentExerciseData || totalNotesPerRepetition === 0;
    stopButton.disabled = true;
    categorySelect.disabled = false; exerciseSelect.disabled = false;
    updateInfo("--");
}

function resetUIState() {
    isPlaying = false;
    successRateSpan.textContent = '-- %';
    updateInfo("--");
    playedNoteSpan.textContent = '--';
    stopButton.disabled = true;
     if (exerciseCompletionTimeout) { clearTimeout(exerciseCompletionTimeout); exerciseCompletionTimeout = null; }
}

// Aggiorna % successo RIPETIZIONE CORRENTE
function updateSuccessRate() {
    if (totalNotesPerRepetition === 0) { successRateSpan.textContent = 'N/A'; }
    else {
        const currentCorrect = Math.min(correctNotesThisRepetition, totalNotesPerRepetition);
        const percentage = ((currentCorrect / totalNotesPerRepetition) * 100).toFixed(1);
        successRateSpan.textContent = `${percentage} %`;
    }
}

// Imposta 'expected' per oggetti nota/accordo non 'correct' e non pause
function highlightPendingNotes() {
    if (!currentExerciseData) return;
     ['notes', 'notesTreble', 'notesBass'].forEach(key => {
        if (currentExerciseData[key]) {
            currentExerciseData[key].forEach(noteObj => {
                if (!(noteObj.keys && noteObj.keys[0]?.toLowerCase().startsWith('r/')) && noteObj.status !== 'correct') {
                    noteObj.status = 'expected'; // Blu
                }
                // Resetta tracciamento interno accordi
                if (Array.isArray(noteObj.midiValues)) {
                   noteObj.correctMidiValues = [];
                }
            });
        }
    });
}

function updateInfo(message) { expectedNoteSpan.textContent = message; }

// --- Gestione Input MIDI con Ripetizioni e Accordi ---
function handleNoteOn(noteName, midiNote, velocity) {
    playedNoteSpan.textContent = `${noteName} (MIDI: ${midiNote}, Vel: ${velocity})`;
    if (!isPlaying || !currentExerciseData) return;

    console.log(`Input: ${noteName} (MIDI: ${midiNote}) - Rep: ${currentRepetition}`);

    let noteMatchedAndMarked = false;
    let targetArrayKey = null;
    let targetArray = null;

    // 1. Determina array target
    if (midiNote < MIDI_SPLIT_POINT) targetArrayKey = currentExerciseData.notesBass ? 'notesBass' : (currentExerciseData.clef === 'bass' ? 'notes' : null);
    else targetArrayKey = currentExerciseData.notesTreble ? 'notesTreble' : (currentExerciseData.clef !== 'bass' ? 'notes' : null);

    // 2. Cerca nell'array target
    if (targetArrayKey) {
        targetArray = currentExerciseData[targetArrayKey];
        if (targetArray) {
            targetArray.forEach(noteObj => {
                if (noteObj.status === 'expected') { // Processa solo quelli blu/in attesa
                    if (typeof noteObj.midiValue === 'number') { // Nota singola
                        if (noteObj.midiValue === midiNote) {
                            noteObj.status = 'correct';
                            correctNotesThisRepetition++;
                            noteMatchedAndMarked = true;
                            console.log(`   Correct Single! Count: ${correctNotesThisRepetition}/${totalNotesPerRepetition}`);
                        }
                    } else if (Array.isArray(noteObj.midiValues)) { // Accordo
                        if (noteObj.midiValues.includes(midiNote) && !noteObj.correctMidiValues.includes(midiNote)) {
                            noteObj.correctMidiValues.push(midiNote);
                            correctNotesThisRepetition++;
                            noteMatchedAndMarked = true;
                            console.log(`   Correct Chord Note! Count: ${correctNotesThisRepetition}/${totalNotesPerRepetition}. Chord Notes: ${noteObj.correctMidiValues.length}/${noteObj.midiValues.length}`);
                            if (noteObj.correctMidiValues.length >= noteObj.midiValues.length) {
                                noteObj.status = 'correct';
                                console.log("   -> Chord complete this repetition!");
                            }
                        }
                    }
                }
            });
        }
    }

    // 3. Aggiorna UI e controlla completamento
    if (noteMatchedAndMarked) {
        updateSuccessRate();
        renderExercise(scoreDivId, currentExerciseData);

        // Controlla se la RIPETIZIONE è completa
        if (correctNotesThisRepetition >= totalNotesPerRepetition) {
            console.log(`--- Ripetizione ${currentRepetition} completata! ---`);
            currentRepetition++;
            if (currentRepetition > targetRepetitions) {
                handleExerciseCompletion(); // Finito tutte le ripetizioni
            } else {
                // Prepara la prossima ripetizione
                console.log(`Avvio ripetizione ${currentRepetition}/${targetRepetitions}`);
                setTimeout(() => {
                    resetNoteStates();
                    highlightPendingNotes();
                    renderExercise(scoreDivId, currentExerciseData);
                    updateInfo(`Ripetizione ${currentRepetition}/${targetRepetitions}. Suona.`);
                    updateSuccessRate(); // Resetta %
                 }, 300); // Delay per vedere ultima nota verde
            }
        }
    } else {
        console.log("   Invalid note played or target already correct.");
        playedNoteSpan.style.color = 'red';
        setTimeout(() => { playedNoteSpan.style.color = ''; }, 500);
    }
}

// --- Gestione Completamento ESERCIZIO (dopo TUTTE le ripetizioni) ---
function handleExerciseCompletion() {
    console.log("Esercizio (tutte le ripetizioni) completato!");
    isPlaying = false; stopButton.disabled = true; updateInfo("Completato!");
    const currentCategoryKey = categorySelect.value; const currentExerciseId = currentExerciseDefinition?.id;
    if (!currentCategoryKey || !allExercises[currentCategoryKey]) { console.error("Cat non valida"); return; }
    const categoryExercises = allExercises[currentCategoryKey]; const availableExercises = categoryExercises.filter(ex => ex.id !== currentExerciseId);
    if (availableExercises.length > 0) { const randomIndex = Math.floor(Math.random() * availableExercises.length); const nextExercise = availableExercises[randomIndex]; console.log(`Prossimo: ${nextExercise.name || nextExercise.id}`); const delay = 2000; playedNoteSpan.textContent = "Bravo!";
        exerciseCompletionTimeout = setTimeout(() => { exerciseCompletionTimeout = null; exerciseSelect.value = nextExercise.id; selectExercise(nextExercise.id, currentCategoryKey); if (midiReady) { setTimeout(startExercise, 100); } else { console.warn("MIDI non pronto."); startButton.disabled = true; } }, delay);
    } else { console.log("Categoria completata!"); updateInfo("Categoria Completata!"); playedNoteSpan.textContent = "Ottimo Lavoro!"; categorySelect.disabled = false; exerciseSelect.disabled = false; startButton.disabled = !midiReady || !currentExerciseData || totalNotesPerRepetition === 0; }
}

// --- Funzione updateMidiStatus ---
function updateMidiStatus(message, isConnected) {
    midiStatusSpan.textContent = message; midiReady = isConnected; startButton.disabled = !isConnected || !currentExerciseData || isPlaying || totalNotesPerRepetition === 0; if (!isConnected && isPlaying) { console.warn("MIDI disconnesso durante esercizio."); stopExercise(); alert("Dispositivo MIDI disconnesso!"); }
}

// --- Event Listeners ---
categorySelect.addEventListener('change', (e) => { populateExerciseSelect(e.target.value); });
exerciseSelect.addEventListener('change', (e) => { selectExercise(e.target.value, categorySelect.value); });
startButton.addEventListener('click', startExercise);
stopButton.addEventListener('click', stopExercise);

// --- Inizializzazione ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Caricato. Init modello indipendente + accordi + ripetizioni + pause fix...");
    loadExerciseData();
    initializeMIDI(handleNoteOn, updateMidiStatus);
});