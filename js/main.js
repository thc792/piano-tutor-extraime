/**
 * main.js - Logica principale e gestione eventi Piano Future.
 *
 * Piano Future
 * Copyright (c) 2025 Lorenzetti Giuseppe
 *
 * Questo codice sorgente è rilasciato sotto la licenza MIT.
 * Vedi il file LICENSE nel repository GitHub per i dettagli completi.
 * https://github.com/thc792/piano-tutor-extraime/blob/main/LICENSE
 */

/**
 * js/main.js
 * **VERSIONE FINALE + AVANZAMENTO ORDINATO PER CATEGORIE SPECIFICHE**
 * Include la gestione per selezionare la nota 'expected' più a sinistra
 * in caso di duplicati, tramite l'ordine di ricerca (basso poi violino)
 * e l'iterazione sequenziale all'interno di ciascun array di note.
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

// === Array per categorie con avanzamento ordinato ===
const ORDERED_CATEGORIES = ['accordi_rivolti']; // Aggiungi qui altre chiavi se necessario

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
function loadExerciseData() {
    // Assicura che i dati MIDI siano validi (numeri MIDI o pause 'r/')
    if (window.exerciseData) {
        allExercises = window.exerciseData;
        Object.entries(allExercises).forEach(([category, exercises]) => {
            if (!Array.isArray(exercises)) {
                console.error(`Errore nei dati JSON: la categoria "${category}" non contiene un array di esercizi.`);
                return; // Salta questa categoria
            }
            exercises.forEach((ex, index) => {
                if (!ex || typeof ex !== 'object') {
                     console.error(`Errore nei dati JSON: l'elemento all'indice ${index} nella categoria "${category}" non è un oggetto esercizio valido.`);
                     // Potresti voler rimuovere l'esercizio non valido o segnalarlo ulteriormente
                     return; // Salta questo esercizio specifico
                }
                let dataOk = true;
                let noteCount = 0;
                // Controlla la validità dei dati MIDI in notes, notesTreble, notesBass
                ['notes', 'notesTreble', 'notesBass'].forEach(key => {
                    if (ex[key]) { // Se l'array di note esiste
                        if (!Array.isArray(ex[key])) {
                            console.error(`Errore dati esercizio ${ex.id || index} nella categoria "${category}": la chiave "${key}" non è un array.`);
                            dataOk = false;
                            return; // Esci dal forEach della chiave
                        }
                        // Verifica ogni oggetto nota nell'array
                        if (!ex[key].every(n =>
                            (n && n.keys && Array.isArray(n.keys) && n.keys[0]?.toLowerCase().startsWith('r/')) || // È una pausa Vexflow valida?
                            (n && typeof n.midiValue === 'number') || // Ha un midiValue numerico singolo?
                            (n && Array.isArray(n.midiValues) && n.midiValues.length > 0 && n.midiValues.every(m => typeof m === 'number')) // Ha un array di midiValues numerici?
                        )) {
                            dataOk = false;
                            console.warn(`ATTENZIONE: Esercizio "${ex.id || index}" nella categoria "${category}" ha un formato dati MIDI non valido o note malformate nella chiave "${key}". Verranno ignorate le note non valide.`);
                             // Potresti voler filtrare le note non valide qui se necessario
                             // ex[key] = ex[key].filter(n => ... condizione di validità ...);
                        } else {
                            // Calcola il numero di note *suonabili* (non pause)
                            ex[key].forEach(noteObj => {
                                if (!(noteObj.keys && noteObj.keys[0]?.toLowerCase().startsWith('r/'))) { // Se non è una pausa
                                    if (typeof noteObj.midiValue === 'number') {
                                        noteCount++;
                                    } else if (Array.isArray(noteObj.midiValues)) {
                                        noteCount += noteObj.midiValues.length;
                                    }
                                }
                            });
                        }
                    }
                });
                if (!dataOk) {
                    console.error(`Esercizio ${category}[${index}] (ID: '${ex.id || 'NO ID'}') ha dati MIDI mancanti o malformati in una delle sue chiavi note.`);
                    // Potresti decidere di escludere l'intero esercizio se i dati sono critici
                }
                 // Aggiungi qui altri controlli essenziali se necessario (es. ID, nome)
                 if (!ex.id) {
                    console.warn(`Esercizio ${category}[${index}] non ha un ID.`);
                 }
            });
        });
        console.log("Dati degli esercizi caricati e verificati preliminarmente.");
    } else {
        console.error("Errore critico nel caricamento dei dati: window.exerciseData non è stato trovato.");
        // Potrebbe essere necessario mostrare un messaggio all'utente qui
        alert("Errore nel caricamento degli esercizi. Controlla la console per i dettagli.");
    }
    populateCategorySelect();
}

function populateCategorySelect() {
    const categories = Object.keys(allExercises);
    categorySelect.innerHTML = '<option value="">-- Seleziona Categoria --</option>';
    categories.forEach(catKey => {
        // Assicurati che ci siano esercizi validi nella categoria prima di aggiungerla
        if (Array.isArray(allExercises[catKey]) && allExercises[catKey].length > 0 && allExercises[catKey].some(ex => ex && ex.id)) {
            const option = document.createElement('option');
            option.value = catKey;
            // Formattazione del nome per la visualizzazione (opzionale)
            option.textContent = catKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            categorySelect.appendChild(option);
        } else {
            console.warn(`Categoria "${catKey}" ignorata perché vuota o senza esercizi validi con ID.`);
        }
    });
}

function populateExerciseSelect(categoryKey) {
    exerciseSelect.innerHTML = '<option value="">-- Seleziona Esercizio --</option>';
    exerciseSelect.disabled = true; // Disabilita di default

    if (categoryKey && allExercises[categoryKey] && Array.isArray(allExercises[categoryKey])) {
        const exercises = allExercises[categoryKey];
        let hasValidExercises = false;
        exercises.forEach(ex => {
            // Aggiungi solo esercizi che hanno un ID (e opzionalmente un nome)
            if (ex && ex.id) {
                const option = document.createElement('option');
                option.value = ex.id;
                option.textContent = ex.name || ex.id; // Usa il nome se esiste, altrimenti l'ID
                exerciseSelect.appendChild(option);
                hasValidExercises = true;
            } else {
                console.warn("Trovato un esercizio senza ID nella categoria:", categoryKey);
            }
        });

        if (hasValidExercises) {
            exerciseSelect.disabled = false; // Abilita solo se ci sono esercizi validi
        } else {
            exerciseSelect.innerHTML = '<option value="">-- Nessun esercizio valido --</option>';
        }
    } else if (categoryKey) {
        console.warn(`Categoria "${categoryKey}" selezionata non valida o non contiene un array.`);
        exerciseSelect.innerHTML = '<option value="">-- Errore Categoria --</option>';
    } else {
         // Caso in cui viene deselezionata la categoria ("-- Seleziona Categoria --")
         exerciseSelect.innerHTML = '<option value="">-- Seleziona Categoria --</option>';
    }

    // Resetta sempre lo stato UI e il visualizzatore quando cambia la categoria o non ci sono esercizi
    resetUIState();
    document.getElementById(scoreDivId).innerHTML = '<p>Seleziona un esercizio per iniziare.</p>';
    startButton.disabled = true;
    currentExerciseData = null; // Assicura che nessun esercizio sia considerato attivo
    currentExerciseDefinition = null;
    totalNotesPerRepetition = 0;
}


// --- Gestione Stato Esercizio ---
function selectExercise(exerciseId, categoryKey) {
    // Validazione input
    if (!exerciseId || !categoryKey || !allExercises[categoryKey] || !Array.isArray(allExercises[categoryKey])) {
        console.warn("Tentativo di selezionare un esercizio con ID o categoria non validi:", exerciseId, categoryKey);
        currentExerciseData = null;
        currentExerciseDefinition = null;
        startButton.disabled = true;
        totalNotesPerRepetition = 0;
        document.getElementById(scoreDivId).innerHTML = '<p>Selezione non valida o categoria errata.</p>';
        resetUIState();
        return;
    }

    // Trova la definizione dell'esercizio
    currentExerciseDefinition = allExercises[categoryKey].find(ex => ex && ex.id === exerciseId);

    if (currentExerciseDefinition) {
        console.log("Esercizio selezionato:", currentExerciseDefinition.name || currentExerciseDefinition.id);

        // Validazione dati MIDI e calcolo note per ripetizione
        let hasValidMidiData = true;
        totalNotesPerRepetition = 0;
        ['notes', 'notesTreble', 'notesBass'].forEach(key => {
            if (currentExerciseDefinition[key]) {
                // Riconferma la validità dei dati per questo specifico esercizio
                if (!Array.isArray(currentExerciseDefinition[key]) || !currentExerciseDefinition[key].every(n =>
                    (n && n.keys && Array.isArray(n.keys) && n.keys[0]?.toLowerCase().startsWith('r/')) || // Pausa valida
                    (n && typeof n.midiValue === 'number') || // Nota singola valida
                    (n && Array.isArray(n.midiValues) && n.midiValues.length > 0 && n.midiValues.every(m => typeof m === 'number')) // Accordo valido
                )) {
                    hasValidMidiData = false;
                    console.error(`Errore critico nei dati MIDI dell'esercizio "${exerciseId}" nella chiave "${key}". L'esercizio non può essere avviato.`);
                } else {
                    // Calcola le note suonabili per questa chiave
                    currentExerciseDefinition[key].forEach(noteObj => {
                        if (!(noteObj.keys && noteObj.keys[0]?.toLowerCase().startsWith('r/'))) { // Ignora le pause
                            if (typeof noteObj.midiValue === 'number') {
                                totalNotesPerRepetition++;
                            } else if (Array.isArray(noteObj.midiValues)) {
                                totalNotesPerRepetition += noteObj.midiValues.length;
                            }
                        }
                    });
                }
            }
        });

        // Se i dati MIDI non sono validi, blocca tutto
        if (!hasValidMidiData) {
            document.getElementById(scoreDivId).innerHTML = `<p style="color: red;">Errore nei dati MIDI dell'esercizio selezionato. Impossibile visualizzare o eseguire.</p>`;
            currentExerciseData = null;
            currentExerciseDefinition = null; // Rimuovi la definizione problematica
            startButton.disabled = true;
            totalNotesPerRepetition = 0;
            resetUIState();
            return; // Interrompi la funzione
        }

        // Imposta le ripetizioni
        targetRepetitions = currentExerciseDefinition.repetitions || 1;
        console.log(`Note totali per ripetizione: ${totalNotesPerRepetition}, Ripetizioni target: ${targetRepetitions}`);

        // Verifica se ci sono note suonabili
        if (totalNotesPerRepetition === 0 && !(currentExerciseDefinition.notesTreble?.some(n => n.keys && !n.keys[0]?.toLowerCase().startsWith('r/')) || currentExerciseDefinition.notesBass?.some(n => n.keys && !n.keys[0]?.toLowerCase().startsWith('r/')) || currentExerciseDefinition.notes?.some(n => n.keys && !n.keys[0]?.toLowerCase().startsWith('r/')) )) {
            // Controlliamo esplicitamente se ci sono *solo* pause, anche se totalNotesPerRepetition è 0
            if (currentExerciseDefinition.notesTreble?.length > 0 || currentExerciseDefinition.notesBass?.length > 0 || currentExerciseDefinition.notes?.length > 0) {
                 console.warn("L'esercizio selezionato contiene solo pause.");
                 document.getElementById(scoreDivId).innerHTML = `<p>Questo esercizio contiene solo pause.</p>`;
                 // Potrebbe comunque essere utile renderizzarlo
            } else {
                console.warn("L'esercizio selezionato sembra vuoto (nessuna nota o pausa definita).");
                document.getElementById(scoreDivId).innerHTML = `<p>Esercizio vuoto.</p>`;
            }
             startButton.disabled = true; // Non si può 'suonare' un esercizio senza note
        } else {
            // Ci sono note suonabili
            startButton.disabled = !midiReady; // Abilita start solo se MIDI è pronto
        }

        // Crea una copia deep per lo stato di runtime per non modificare l'originale
        currentExerciseData = JSON.parse(JSON.stringify(currentExerciseDefinition));
        resetNoteStates(); // Inizializza lo stato delle note (pending/rest)

        // Renderizza l'esercizio se ha note/pause o se ci sono note da suonare
         if (totalNotesPerRepetition > 0 || (currentExerciseData.notesTreble?.length > 0 || currentExerciseData.notesBass?.length > 0 || currentExerciseData.notes?.length > 0) ) {
            renderExercise(scoreDivId, currentExerciseData);
        } else {
            // Se è veramente vuoto, pulisci l'area score
            document.getElementById(scoreDivId).innerHTML = '';
        }

        // Resetta l'interfaccia utente per il nuovo esercizio
        resetUIState();
        stopButton.disabled = true; // Stop è disabilitato finché non si preme start

    } else {
        // Esercizio non trovato nell'array della categoria (non dovrebbe succedere se populate è corretto)
        console.error(`Errore interno: Esercizio con ID "${exerciseId}" non trovato nella categoria "${categoryKey}" dopo la selezione.`);
        currentExerciseData = null;
        currentExerciseDefinition = null;
        startButton.disabled = true;
        totalNotesPerRepetition = 0;
        document.getElementById(scoreDivId).innerHTML = `<p>Errore nel caricamento dell'esercizio.</p>`;
        resetUIState();
    }
}

function resetNoteStates() {
    if (!currentExerciseData) return;
    correctNotesThisRepetition = 0; // Resetta il contatore per la ripetizione corrente

    ['notes', 'notesTreble', 'notesBass'].forEach(key => {
        if (currentExerciseData[key] && Array.isArray(currentExerciseData[key])) {
            currentExerciseData[key].forEach(noteObj => {
                if (noteObj && typeof noteObj === 'object') { // Check extra per sicurezza
                    // Se è una pausa, marca come 'rest'
                    if (noteObj.keys && Array.isArray(noteObj.keys) && noteObj.keys[0]?.toLowerCase().startsWith('r/')) {
                        noteObj.status = 'rest';
                    }
                    // Se è una nota suonabile (singola o accordo)
                    else if (typeof noteObj.midiValue === 'number' || (Array.isArray(noteObj.midiValues) && noteObj.midiValues.length > 0)) {
                        noteObj.status = 'pending'; // In attesa di essere suonata
                        // Resetta l'array delle note corrette per gli accordi
                        if (Array.isArray(noteObj.midiValues)) {
                            noteObj.correctMidiValues = [];
                        }
                    } else {
                        // Oggetto non riconosciuto come nota o pausa valida, ignora o segnala
                         // console.warn("Oggetto nota non valido trovato durante resetNoteStates:", noteObj);
                         // Potrebbe essere utile assegnare uno stato 'error' o 'ignored'
                         noteObj.status = 'ignored';
                    }
                }
            });
        }
    });
    // Nota: Non è necessario renderizzare qui, verrà fatto da startExercise o selectExercise
}

function startExercise() {
    if (!currentExerciseData || !midiReady || totalNotesPerRepetition === 0 || isPlaying) {
         console.warn("Impossibile avviare l'esercizio. Controlla stato MIDI, selezione esercizio, presenza note suonabili e se è già in corso.");
         // Fornisci feedback all'utente se necessario
         if (!midiReady) updateInfo("Collega un dispositivo MIDI.");
         else if (!currentExerciseData) updateInfo("Seleziona un esercizio.");
         else if (totalNotesPerRepetition === 0) updateInfo("Questo esercizio non ha note da suonare.");
         else if (isPlaying) updateInfo("Esercizio già in corso.");
         return;
    }

    // Pulisci eventuali timeout precedenti per il passaggio automatico
    if (exerciseCompletionTimeout) {
        clearTimeout(exerciseCompletionTimeout);
        exerciseCompletionTimeout = null;
    }

    currentRepetition = 1;       // Inizia dalla prima ripetizione
    resetNoteStates();          // Resetta lo stato delle note a 'pending'/'rest'
    console.log("Avvio Esercizio:", currentExerciseData.name || currentExerciseData.id, `- Ripetizione ${currentRepetition}/${targetRepetitions}`);

    isPlaying = true;           // Imposta lo stato globale
    // Aggiorna UI
    startButton.disabled = true;
    stopButton.disabled = false;
    categorySelect.disabled = true;
    exerciseSelect.disabled = true;
    updateSuccessRate();        // Mostra 0% all'inizio della prima ripetizione
    playedNoteSpan.textContent = '--'; // Pulisci l'ultima nota suonata

    highlightPendingNotes();    // Marca le note 'pending' come 'expected'
    renderExercise(scoreDivId, currentExerciseData); // Renderizza lo stato iniziale
    updateInfo(`Ripetizione ${currentRepetition}/${targetRepetitions}. Suona la prima nota.`); // Messaggio iniziale
}

function stopExercise() {
     if (!isPlaying && stopButton.disabled) return; // Evita azioni multiple se già fermo

     // Pulisci timeout per avanzamento automatico se presente
    if (exerciseCompletionTimeout) {
        clearTimeout(exerciseCompletionTimeout);
        exerciseCompletionTimeout = null;
    }

    console.log("Arresto manuale dell'esercizio.");
    isPlaying = false;

    // Resetta lo stato delle note nell'esercizio corrente (se esiste) e renderizza lo stato 'pulito'
    if (currentExerciseData) {
        resetNoteStates(); // Riporta le note a 'pending'/'rest'
        renderExercise(scoreDivId, currentExerciseData); // Mostra lo spartito senza evidenziazioni di stato
    } else {
        // Se non c'è un esercizio caricato, assicurati che lo score sia vuoto o mostri un messaggio
        document.getElementById(scoreDivId).innerHTML = '<p>Nessun esercizio attivo.</p>';
    }

    // Riabilita i controlli
    // Lo start button va riabilitato solo se le condizioni sono soddisfatte
    startButton.disabled = !midiReady || !currentExerciseData || totalNotesPerRepetition === 0;
    stopButton.disabled = true; // Disabilita stop perché l'esercizio è fermo
    categorySelect.disabled = false;
    exerciseSelect.disabled = false;

    // Resetta i messaggi di stato
    updateInfo("Esercizio interrotto. Pronto per iniziare.");
    // Non resettare la success rate qui, potrebbe essere utile vederla fino al prossimo start
    // successRateSpan.textContent = '-- %';
    playedNoteSpan.textContent = '--';
}

function resetUIState() {
    // Questa funzione resetta parti dell'UI quando si cambia esercizio o categoria,
    // o quando si ferma un esercizio non completato.
    isPlaying = false; // Assicura che lo stato di gioco sia falso
    successRateSpan.textContent = '-- %';
    updateInfo("-- Seleziona o avvia un esercizio --");
    playedNoteSpan.textContent = '--';
    stopButton.disabled = true; // Stop è sempre disabilitato quando non si sta suonando

    // Riabilita i selettori (potrebbero essere stati disabilitati durante l'esecuzione)
    categorySelect.disabled = false;
    // exerciseSelect viene gestito da populateExerciseSelect
    // startButton viene gestito da selectExercise e updateMidiStatus

    // Pulisci eventuale timeout residuo per l'avanzamento automatico
    if (exerciseCompletionTimeout) {
        clearTimeout(exerciseCompletionTimeout);
        exerciseCompletionTimeout = null;
    }
}

function updateSuccessRate() {
    if (!currentExerciseData) {
         successRateSpan.textContent = '-- %';
         return;
    }
     if (totalNotesPerRepetition === 0) {
         successRateSpan.textContent = 'N/A'; // Non applicabile se non ci sono note da suonare
     } else {
         // Assicura che il conteggio non superi il totale (potrebbe succedere per errori logici)
         const currentCorrect = Math.min(correctNotesThisRepetition, totalNotesPerRepetition);
         const percentage = ((currentCorrect / totalNotesPerRepetition) * 100).toFixed(1);
         successRateSpan.textContent = `${percentage} %`;
     }
}

function highlightPendingNotes() {
    // Marca tutte le note 'pending' come 'expected' per indicare che sono le prossime possibili da suonare
    if (!currentExerciseData) return;

    let firstExpectedFound = false;
    const processNotes = (notesArray) => {
        if (!notesArray) return;
        notesArray.forEach(noteObj => {
            if (noteObj.status === 'pending') {
                 // Marca come 'expected'
                noteObj.status = 'expected';
                 // Se è un accordo, assicurati che l'array per le note corrette sia vuoto
                 if (Array.isArray(noteObj.midiValues)) {
                    noteObj.correctMidiValues = [];
                 }
                 // Aggiorna il messaggio UI solo per la prima nota 'expected' trovata
                 if (!firstExpectedFound) {
                    // Costruisci una rappresentazione testuale della/e nota/e attesa/e
                    let expectedText = "";
                    if (typeof noteObj.midiValue === 'number') {
                        // Qui potresti convertire midiValue in nome nota se hai una libreria/funzione
                        expectedText = `Attesa: Nota MIDI ${noteObj.midiValue}`;
                    } else if (Array.isArray(noteObj.midiValues)) {
                        expectedText = `Atteso: Accordo (MIDI: ${noteObj.midiValues.join(', ')})`;
                    } else if (noteObj.keys) {
                         expectedText = `Attesa: ${noteObj.keys.join(', ')}`; // Usa le chiavi VexFlow se disponibili
                    }
                    updateInfo(expectedText || `Attesa prossima nota/accordo.`);
                    firstExpectedFound = true;
                 }
            }
        });
    }

    // Processa prima il basso poi il violino per coerenza con la gestione MIDI
    processNotes(currentExerciseData.notesBass);
    processNotes(currentExerciseData.notesTreble);
    processNotes(currentExerciseData.notes); // Gestisce anche il caso di pentagramma singolo

    // Se dopo aver processato tutto non è stata trovata nessuna nota 'expected'
    // (improbabile se totalNotes > 0 e si è all'inizio di una ripetizione,
    // ma potrebbe succedere se la logica ha problemi), aggiorna l'info.
    // if (!firstExpectedFound && isPlaying) {
    //     updateInfo("Errore: nessuna nota attesa trovata.");
    // }
}

function updateInfo(message) {
    expectedNoteSpan.textContent = message;
}


// --- Gestione Input MIDI V4 (Modificata con commenti e logica chiara) ---
// Cerca la nota corrispondente prima nel pentagramma inferiore (basso),
// poi in quello superiore (violino). All'interno di ciascun pentagramma,
// cerca da sinistra a destra. Si ferma alla *prima* corrispondenza trovata.
function handleNoteOn(noteName, midiNote, velocity) {
    playedNoteSpan.textContent = `${noteName} (MIDI: ${midiNote}, Vel: ${velocity})`;
    playedNoteSpan.style.color = ''; // Resetta colore da eventuale errore precedente

    if (!isPlaying || !currentExerciseData) return; // Ignora input se non si sta suonando

    console.log(`Input MIDI Ricevuto: ${noteName} (MIDI: ${midiNote}) - Ripetizione: ${currentRepetition}`);

    let noteMatchedAndMarked = false; // Flag globale per sapere se una nota è stata processata
    let foundInBass = false;          // Flag specifico per il pentagramma basso
    // let foundInTreble = false;     // Flag specifico per il pentagramma violino (opzionale, basta !foundInBass)

    /**
     * Helper function per trovare e marcare la prima nota 'expected' che corrisponde al MIDI input.
     * Itera sequenzialmente sull'array fornito (da sinistra a destra).
     * Ritorna `true` non appena trova e marca una corrispondenza, `false` altrimenti.
     * Questo garantisce che la nota più a sinistra venga selezionata in caso di duplicati nello stesso array.
     * @param {Array|null} notesArray - L'array di note da cercare (es. currentExerciseData.notesBass).
     * @param {string} arrayName - Nome dell'array per logging (es. 'notesBass').
     * @returns {boolean} - True se una nota è stata trovata e marcata correttamente.
     */
    const findAndMarkFirstNote = (notesArray, arrayName) => {
        if (!notesArray || !Array.isArray(notesArray)) return false;

        for (let noteObj of notesArray) {
            // Considera solo note in stato 'expected'
            if (noteObj && noteObj.status === 'expected') {

                // CASO 1: Nota singola
                if (typeof noteObj.midiValue === 'number' && noteObj.midiValue === midiNote) {
                    noteObj.status = 'correct';           // Marca come corretta
                    correctNotesThisRepetition++;         // Incrementa contatore note corrette
                    noteMatchedAndMarked = true;          // Imposta il flag globale
                    console.log(`   [${arrayName}] Corretta! Nota singola ${noteName} (MIDI: ${midiNote}). Conteggio: ${correctNotesThisRepetition}/${totalNotesPerRepetition}`);
                    updateInfo(`OK: ${noteName}`);         // Aggiorna UI
                    return true;                          // Trovata, esci dalla funzione e dall'iterazione
                }
                // CASO 2: Accordo
                else if (Array.isArray(noteObj.midiValues) && noteObj.midiValues.includes(midiNote)) {
                    // Verifica che questa specifica nota dell'accordo non sia già stata segnata come corretta in questo tentativo
                    if (!noteObj.correctMidiValues || !Array.isArray(noteObj.correctMidiValues)) {
                         noteObj.correctMidiValues = []; // Inizializza se mancante (safety check)
                    }
                    if (!noteObj.correctMidiValues.includes(midiNote)) {
                        noteObj.correctMidiValues.push(midiNote); // Aggiungi la nota MIDI corretta all'accordo
                        correctNotesThisRepetition++;             // Incrementa contatore generale
                        noteMatchedAndMarked = true;              // Imposta il flag globale
                        console.log(`   [${arrayName}] Corretta! Nota ${noteName} (MIDI: ${midiNote}) dell'accordo. Note accordo: ${noteObj.correctMidiValues.length}/${noteObj.midiValues.length}. Conteggio Totale: ${correctNotesThisRepetition}/${totalNotesPerRepetition}`);
                        updateInfo(`OK: ${noteName} (parte di accordo)`);

                        // Controlla se l'accordo è completo
                        if (noteObj.correctMidiValues.length >= noteObj.midiValues.length) {
                            noteObj.status = 'correct'; // Marca l'intero accordo come corretto
                            console.log(`   -> Accordo in ${arrayName} completato!`);
                            // Non aggiornare l'info qui, verrà fatto dal check generale sotto
                        }
                         return true; // Trovata corrispondenza (anche parziale), esci
                    } else {
                        // Nota MIDI già suonata correttamente per questo accordo in questa ripetizione
                        console.log(`   [${arrayName}] Nota ${noteName} (MIDI: ${midiNote}) già corretta per questo accordo.`);
                        // Non ritornare true, potremmo dover cercare un'altra nota uguale più a destra
                    }
                }
                // else: nota non corrispondente, continua il ciclo for
            }
            // else: nota non 'expected' (correct, pending, rest, ignored), continua il ciclo for
        }
        // Se il ciclo finisce senza trovare corrispondenze 'expected'
        return false;
    };

    // --- Determina gli Array da Scansionare ---
    // Priorità: `notesBass` se esiste, altrimenti `notes` se clef='bass'. `null` altrimenti.
    const bassArrayKey = currentExerciseData.notesBass ? 'notesBass'
                       : (currentExerciseData.clef === 'bass' && currentExerciseData.notes) ? 'notes'
                       : null;
    // Priorità: `notesTreble` se esiste, altrimenti `notes` se clef!='bass'. `null` altrimenti.
    const trebleArrayKey = currentExerciseData.notesTreble ? 'notesTreble'
                         : (currentExerciseData.clef !== 'bass' && currentExerciseData.notes) ? 'notes'
                         : null;

    // --- Ordine di Ricerca: Basso prima, poi Violino ---
    // Questo ordine, combinato con findAndMarkFirstNote che ritorna alla prima corrispondenza,
    // assicura che la nota 'expected' più a sinistra venga selezionata,
    // dando priorità al pentagramma inferiore in caso di ambiguità tra i due.

    // 1. Cerca nel pentagramma INFERIORE (se definito)
    if (bassArrayKey && currentExerciseData[bassArrayKey]) {
        console.log("-> Scansiono Array Basso/Inferiore...");
        foundInBass = findAndMarkFirstNote(currentExerciseData[bassArrayKey], bassArrayKey);
    }

    // 2. Se NON trovata nel pentagramma inferiore, cerca in quello SUPERIORE (se definito)
    if (!foundInBass && trebleArrayKey && currentExerciseData[trebleArrayKey]) {
        console.log("-> Scansiono Array Violino/Superiore...");
        // foundInTreble = findAndMarkFirstNote(currentExerciseData[trebleArrayKey], trebleArrayKey);
        // L'assegnazione a foundInTreble non è strettamente necessaria se usiamo solo noteMatchedAndMarked dopo
         findAndMarkFirstNote(currentExerciseData[trebleArrayKey], trebleArrayKey);
    }

    // --- Logica Post-Scansione ---
    if (noteMatchedAndMarked) {
        updateSuccessRate(); // Aggiorna la percentuale di successo
        renderExercise(scoreDivId, currentExerciseData); // Ridisegna lo spartito con la nota/accordo aggiornato

        // Controlla se la ripetizione corrente è completata
        if (correctNotesThisRepetition >= totalNotesPerRepetition) {
            console.log(`--- Ripetizione ${currentRepetition} di ${targetRepetitions} completata! ---`);
            currentRepetition++; // Passa alla prossima ripetizione

            // Controlla se tutte le ripetizioni sono state completate
            if (currentRepetition > targetRepetitions) {
                handleExerciseCompletion(); // Esercizio finito
            } else {
                // Prepara la prossima ripetizione dopo un breve ritardo
                console.log(`Avvio preparazione per ripetizione ${currentRepetition}/${targetRepetitions}`);
                updateInfo(`Ottimo! Prepara la Rip. ${currentRepetition}`);
                // Usa setTimeout per dare tempo all'utente di vedere il risultato
                // e prepararsi alla prossima sequenza.
                setTimeout(() => {
                    if (!isPlaying) return; // Controlla se l'esercizio è stato fermato nel frattempo
                    console.log(`Inizio Ripetizione ${currentRepetition}`);
                    resetNoteStates();          // Resetta stati a 'pending'/'rest'
                    highlightPendingNotes();    // Marca 'pending' come 'expected' e aggiorna l'info per la prima nota
                    renderExercise(scoreDivId, currentExerciseData); // Renderizza per la nuova ripetizione
                    updateSuccessRate();        // Resetta la % per la nuova ripetizione (mostrerà 0%)
                }, 1000); // Delay prima di resettare per la prossima ripetizione (es. 1 secondo)
            }
        } else {
            // Nota corretta, ma la ripetizione non è finita. Trova la prossima nota 'expected'.
            // La funzione highlightPendingNotes può essere chiamata qui se si vuole
            // aggiornare immediatamente il messaggio 'Attesa:' alla prossima nota,
            // oppure si può attendere che highlightPendingNotes venga chiamata all'inizio
            // della prossima ripetizione (come è ora). Per feedback immediato:
            highlightPendingNotes(); // Aggiorna subito il messaggio 'Attesa:' alla prossima
        }

    } else {
        // La nota suonata non corrisponde a nessuna nota 'expected' in nessuno dei pentagrammi
        console.log(`   Nota ${noteName} (MIDI: ${midiNote}) non valida o già suonata correttamente.`);
        updateInfo(`Errore: ${noteName} non atteso`);
        playedNoteSpan.style.color = 'red'; // Evidenzia l'errore
        // Non rimuovere subito il colore rosso, lascialo finché non arriva la prossima nota (corretta o errata)
        // setTimeout(() => { playedNoteSpan.style.color = ''; }, 500); // Rimuove flash rosso troppo presto
    }
}


// --- Gestione Completamento Esercizio (MODIFICATA per Avanzamento Ordinato/Random) ---
function handleExerciseCompletion() {
    console.log("Esercizio (tutte le ripetizioni) completato con successo!");
    isPlaying = false; // Ferma lo stato di gioco
    stopButton.disabled = true; // Disabilita stop
    // startButton rimarrà disabilitato finché non si seleziona/avanza a un nuovo esercizio

    updateInfo("Esercizio Completato!");
    playedNoteSpan.textContent = "Bravo!"; // Messaggio di congratulazioni

    const currentCategoryKey = categorySelect.value;
    const currentExerciseId = currentExerciseDefinition?.id;

    // Verifica che lo stato sia consistente per procedere
    if (!currentCategoryKey || !allExercises[currentCategoryKey] || !currentExerciseId || !Array.isArray(allExercises[currentCategoryKey])) {
        console.error("Stato applicazione non valido per determinare il prossimo esercizio. Categoria o ID esercizio corrente mancanti o non validi.");
        // Riabilita i controlli per selezione manuale
        categorySelect.disabled = false;
        exerciseSelect.disabled = false;
        // Riabilita start solo se possibile (MIDI pronto e un esercizio valido è ancora selezionato teoricamente)
        // Ma è più sicuro lasciarlo disabilitato finché l'utente non seleziona di nuovo.
        startButton.disabled = true; // Forza la riselezione o attendi nuovo esercizio
        updateInfo("Errore stato. Seleziona un nuovo esercizio.");
        return;
    }

    const categoryExercises = allExercises[currentCategoryKey];
    let nextExercise = null; // Esercizio successivo da avviare

    // === Logica di Avanzamento: Ordinato vs Random ===
    if (ORDERED_CATEGORIES.includes(currentCategoryKey)) {
        // --- Avanzamento Ordinato ---
        console.log(`Categoria "${currentCategoryKey}" è configurata per avanzamento ordinato. Cerco esercizio successivo.`);
        const currentIndex = categoryExercises.findIndex(ex => ex && ex.id === currentExerciseId);

        if (currentIndex !== -1 && currentIndex < categoryExercises.length - 1) {
            // Trovato esercizio corrente, prendi il prossimo nell'array
            // Assicurati che il prossimo elemento sia un esercizio valido
             let nextIndex = currentIndex + 1;
             while(nextIndex < categoryExercises.length && (!categoryExercises[nextIndex] || !categoryExercises[nextIndex].id)) {
                console.warn(`Elemento all'indice ${nextIndex} non valido, salto al successivo.`);
                nextIndex++;
             }
             if (nextIndex < categoryExercises.length) {
                nextExercise = categoryExercises[nextIndex];
                console.log(`Prossimo esercizio (ordinato): ${nextExercise.name || nextExercise.id} (ID: ${nextExercise.id})`);
             } else {
                console.log("Nessun esercizio valido trovato dopo l'indice corrente.");
                nextExercise = null; // Nessun altro esercizio valido trovato
             }
        } else if (currentIndex === -1) {
            console.error(`Errore: Impossibile trovare l'indice dell'esercizio corrente (ID: ${currentExerciseId}) nella categoria ordinata.`);
            nextExercise = null; // Non si può determinare il prossimo
        } else {
            // Era l'ultimo esercizio (o l'ultimo valido) della categoria
            console.log("Ultimo esercizio della categoria ordinata completato.");
            nextExercise = null;
        }
    } else {
        // --- Avanzamento Random ---
        console.log(`Categoria "${currentCategoryKey}" non è in ORDERED_CATEGORIES. Cerco esercizio random (diverso dal corrente).`);
        // Filtra per ottenere solo esercizi validi (con ID) diversi da quello appena completato
        const availableExercises = categoryExercises.filter(ex => ex && ex.id && ex.id !== currentExerciseId);

        if (availableExercises.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableExercises.length);
            nextExercise = availableExercises[randomIndex];
            console.log(`Prossimo esercizio (random): ${nextExercise.name || nextExercise.id} (ID: ${nextExercise.id})`);
        } else {
            // Solo 1 esercizio nella categoria o tutti gli altri non sono validi
            console.log("Nessun altro esercizio valido disponibile per la selezione random in questa categoria.");
            nextExercise = null;
        }
    }
    // ============================================

    // --- Avvia il prossimo esercizio o termina ---
    if (nextExercise && nextExercise.id) {
        const delay = 2500; // Pausa prima di iniziare il prossimo (in ms)
        updateInfo(`Prossimo: ${nextExercise.name || nextExercise.id}...`);
        console.log(`Attendo ${delay}ms prima di caricare ${nextExercise.id}`);

        // Disabilita i controlli durante l'attesa
        categorySelect.disabled = true;
        exerciseSelect.disabled = true;
        startButton.disabled = true;

        exerciseCompletionTimeout = setTimeout(() => {
            exerciseCompletionTimeout = null; // Pulisce il riferimento al timeout
             if (!nextExercise || !nextExercise.id) { // Doppio controllo
                 console.error("Timeout scaduto ma nextExercise non è valido.");
                 updateInfo("Errore caricamento prossimo esercizio.");
                 categorySelect.disabled = false; // Riabilita per scelta manuale
                 exerciseSelect.disabled = false;
                 return;
             }
            console.log(`Caricamento automatico: ${nextExercise.id}`);
            // Imposta il valore nel select (aggiorna UI)
            exerciseSelect.value = nextExercise.id;
            // Seleziona l'esercizio (carica dati, renderizza, calcola note, abilita/disabilita start)
            selectExercise(nextExercise.id, currentCategoryKey);

            // Avvia automaticamente il nuovo esercizio solo se il MIDI è pronto e l'esercizio ha note
            if (midiReady && currentExerciseData && totalNotesPerRepetition > 0) {
                 console.log("Avvio automatico del prossimo esercizio...");
                 // Breve pausa aggiuntiva per permettere il rendering prima dello start effettivo
                 setTimeout(startExercise, 200);
            } else {
                 console.warn("MIDI non pronto o esercizio non avviabile. L'utente dovrà premere Start.");
                 // Assicurati che i controlli siano nello stato corretto
                 categorySelect.disabled = true; // Mantiene bloccato sulla categoria corrente
                 exerciseSelect.disabled = true; // Mantiene bloccato sull'esercizio caricato
                 startButton.disabled = true; // Sarà abilitato da selectExercise se possibile, altrimenti rimane disabilitato
                 if (!midiReady) updateInfo(`Prossimo: ${nextExercise.name || nextExercise.id}. Collega MIDI.`);
                 else updateInfo(`Prossimo: ${nextExercise.name || nextExercise.id}. Premi Start.`);
            }
        }, delay);

    } else {
        // Nessun altro esercizio disponibile o categoria completata
        console.log("Nessun prossimo esercizio da avviare automaticamente.");
        updateInfo("Categoria Completata! Scegli una nuova categoria o esercizio.");
        playedNoteSpan.textContent = "Ottimo Lavoro!";
        // Riabilita i controlli per permettere all'utente di scegliere cosa fare dopo
        categorySelect.disabled = false;
        exerciseSelect.disabled = false;
        // Start button rimane disabilitato finché non viene selezionato un nuovo esercizio valido
        startButton.disabled = true;
        // Assicurati che lo stato dell'ultimo esercizio non sia più attivo
        currentExerciseData = null;
        currentExerciseDefinition = null;
        totalNotesPerRepetition = 0;
         // Potresti voler pulire lo spartito o lasciare l'ultimo visualizzato
         // document.getElementById(scoreDivId).innerHTML = '<p>Categoria completata!</p>';
    }
}


// --- Funzione updateMidiStatus ---
function updateMidiStatus(message, isConnected) {
    midiStatusSpan.textContent = message;
    midiReady = isConnected;

    // Aggiorna lo stato del pulsante Start in base alla connessione MIDI
    // e allo stato corrente dell'applicazione
    if (isConnected) {
        // MIDI Connesso: Abilita Start SE un esercizio valido è selezionato,
        // ci sono note da suonare e non si sta già suonando.
        startButton.disabled = isPlaying || !currentExerciseData || totalNotesPerRepetition === 0;
         // Se un esercizio era selezionato ma start era disabilitato per mancanza di MIDI,
         // aggiorna il messaggio informativo.
         if (!isPlaying && currentExerciseData && totalNotesPerRepetition > 0) {
             updateInfo(`MIDI pronto. Premi Start per ${currentExerciseData.name || currentExerciseData.id}.`);
         } else if (!currentExerciseData) {
             updateInfo("MIDI pronto. Seleziona un esercizio.");
         }
    } else {
        // MIDI Disconnesso: Disabilita sempre Start.
        startButton.disabled = true;
        updateInfo("Collega un dispositivo MIDI per iniziare.");
        // Se l'esercizio era in corso, fermalo bruscamente.
        if (isPlaying) {
            console.warn("Dispositivo MIDI disconnesso durante l'esecuzione dell'esercizio!");
            stopExercise(); // Ferma l'esercizio
            // Mostra un messaggio più evidente all'utente
            alert("ATTENZIONE: Dispositivo MIDI disconnesso! Esercizio interrotto.");
            updateInfo("MIDI Disconnesso! Esercizio interrotto.");
        }
    }
}

// --- Event Listeners ---
categorySelect.addEventListener('change', (e) => {
    // Quando la categoria cambia, popola il select degli esercizi
    // e resetta lo stato (questo viene fatto dentro populateExerciseSelect)
    populateExerciseSelect(e.target.value);
});

exerciseSelect.addEventListener('change', (e) => {
    // Quando un esercizio viene selezionato, carica i suoi dati
    const selectedExerciseId = e.target.value;
    const selectedCategoryKey = categorySelect.value;
    selectExercise(selectedExerciseId, selectedCategoryKey);
});

startButton.addEventListener('click', startExercise);
stopButton.addEventListener('click', stopExercise);

// --- Inizializzazione Applicazione ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente caricato e analizzato.");
    console.log("Inizializzazione Piano Future vFinale (Ordinato/Random)...");

    // 1. Carica i dati degli esercizi da window.exerciseData (generato da build_exercises.js)
    loadExerciseData(); // Include la validazione base e popola le categorie

    // 2. Inizializza il sistema MIDI (Web MIDI API)
    // Passa le callback per gestire gli eventi MIDI (note on) e gli aggiornamenti di stato
    initializeMIDI(handleNoteOn, updateMidiStatus);

    // 3. Imposta lo stato iniziale dell'UI
    resetUIState(); // Assicura che l'UI sia nello stato iniziale corretto
    stopButton.disabled = true; // Stop sempre disabilitato all'inizio
    startButton.disabled = true; // Start disabilitato finché MIDI non è pronto E un esercizio valido è selezionato
    document.getElementById(scoreDivId).innerHTML = '<p>Benvenuto! Seleziona una categoria e un esercizio.</p>'; // Messaggio iniziale
    updateInfo("Collega un dispositivo MIDI e seleziona un esercizio.");
});