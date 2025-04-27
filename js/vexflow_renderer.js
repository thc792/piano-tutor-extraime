/**
 * NomeFile.js/style.css - Breve descrizione (da personalizzare per ogni file)
 *
 * Piano Future
 * Copyright (c) 2025 Lorenzetti Giuseppe
 *
 * Questo codice sorgente è rilasciato sotto la licenza MIT.
 * Vedi il file LICENSE nel repository GitHub per i dettagli completi.
 * https://github.com/thc792/piano-tutor-extraime/blob/main/LICENSE
 */
/**
 * js/vexflow_renderer.js
 * Renderer per esercizi musicali usando VexFlow.
 * **VERSIONE CON SISTEMI MULTIPLI (MULTI-LINE STAVES)**
 */

const { Factory, Stave, StaveNote, Formatter, Voice, Beam, Accidental, StaveConnector, TickContext, Fraction, Note } = Vex.Flow;

// --- Costanti ---
const MEASURES_PER_LINE = 4; // Quante battute per riga (puoi aggiustare)
const SYSTEM_SPACING = 200; // Spazio verticale tra i sistemi (grand staff)
const SINGLE_STAVE_SYSTEM_SPACING = 150; // Spazio verticale (single staff)
const STAVE_START_X = 15; // Margine sinistro
const STAVE_START_Y_GRAND = 40; // Y del primo pentagramma treble (grand staff)
const STAVE_START_Y_SINGLE = 60; // Y del primo pentagramma (single staff)
const STAVE_VERTICAL_DISTANCE = 100; // Distanza tra treble e bass nel grand staff

// --- Funzioni Helper (durationToTicks rimane uguale) ---
function durationToTicks(durationString) {
    const BEAT_TICKS = Vex.Flow.RESOLUTION / 4; let ticks = 0;
    const baseDuration = durationString.replace('.', '').replace('d', '');
    switch (baseDuration) { case 'w': ticks = 4 * BEAT_TICKS; break; case 'h': ticks = 2 * BEAT_TICKS; break; case 'q': ticks = BEAT_TICKS; break; case '8': ticks = BEAT_TICKS / 2; break; case '16': ticks = BEAT_TICKS / 4; break; case '32': ticks = BEAT_TICKS / 8; break; default: ticks = BEAT_TICKS; }
    if (durationString.includes('.')) { let numDots = (durationString.match(/\./g) || []).length; let dotValue = ticks; for (let i = 0; i < numDots; i++) { dotValue /= 2; ticks += dotValue; } }
    else if (durationString.endsWith('d')) { ticks = ticks * 1.5; }
    return ticks;
}

// Helper per calcolare i tick per battuta
function getTicksPerMeasure(timeSignature) {
    try {
        if (!timeSignature) return Vex.Flow.RESOLUTION; // Default a 4/4 (1 beat = resolution/4)
        const beats = parseInt(timeSignature.split('/')[0]);
        const beatValue = parseInt(timeSignature.split('/')[1]);
        if (isNaN(beats) || isNaN(beatValue) || beatValue === 0) return Vex.Flow.RESOLUTION;
        // Resolution = ticks per whole note. Beat value 4 = quarter note.
        return (Vex.Flow.RESOLUTION / beatValue) * beats;
    } catch (e) {
        console.error("Error parsing time signature:", timeSignature, e);
        return Vex.Flow.RESOLUTION; // Fallback
    }
}

// Helper per dividere le note in segmenti basati sulle battute
function segmentNotesByMeasure(notes, ticksPerMeasure, measuresPerLine) {
    if (!notes || notes.length === 0) return [];
    const segments = [];
    let currentSegment = [];
    let currentTickCount = 0;
    const ticksPerLine = ticksPerMeasure * measuresPerLine;

    notes.forEach(note => {
        const noteTicks = durationToTicks(note.duration);
        // Se aggiungere questa nota supera il limite della riga *e* il segmento corrente non è vuoto
        if (currentTickCount + noteTicks > ticksPerLine && currentSegment.length > 0) {
            segments.push(currentSegment); // Finalizza il segmento corrente
            currentSegment = [note];       // Inizia un nuovo segmento con la nota attuale
            currentTickCount = noteTicks; // Resetta i tick
        } else {
            currentSegment.push(note);
            currentTickCount += noteTicks;
        }
    });
    // Aggiunge l'ultimo segmento se non è vuoto
    if (currentSegment.length > 0) {
        segments.push(currentSegment);
    }
    return segments;
}


// Helper per creare le StaveNote (invariato, ma ora usato per segmenti)
function createStyledStaveNotes(noteDataArray, clefType, defaultFill = '#333', defaultStroke = '#333') { /* ... (Codice COMPLETO da risposta precedente) ... */
     if (!noteDataArray) return [];
    return noteDataArray.map((noteData) => {
        const isRest = noteData.keys[0].toLowerCase().startsWith('r/');
        const noteConfig = { keys: isRest ? ["b/4"] : noteData.keys, duration: noteData.duration.replace('d','.'), clef: clefType, type: isRest ? 'r' : undefined };
        const staveNote = new StaveNote(noteConfig);
        if (!isRest) {
            noteData.keys.forEach((key, keyIndex) => { const keyParts = key.split('/'); const pitchName = keyParts[0]; if (pitchName.endsWith('##')) staveNote.addModifier(new Accidental('##'), keyIndex); else if (pitchName.endsWith('#')) staveNote.addModifier(new Accidental('#'), keyIndex); else if (pitchName.endsWith('bb')) staveNote.addModifier(new Accidental('b'), keyIndex); else if (pitchName.length > 1 && pitchName.endsWith('b')) staveNote.addModifier(new Accidental('b'), keyIndex); });
            if (noteData.duration.includes('.')) { let numDots = (noteData.duration.match(/\./g) || []).length; for (let i = 0; i < numDots; i++) staveNote.addDotToAll(); }
        }
        let fillStyle = defaultFill; let strokeStyle = defaultStroke; if (!isRest) { switch (noteData.status) { case 'correct': fillStyle = '#28a745'; strokeStyle = '#1c7430'; break; case 'incorrect': fillStyle = 'rgba(220, 53, 69, 0.4)'; strokeStyle = '#a71d2a'; break; case 'expected': fillStyle = 'rgba(0, 123, 255, 0.3)'; strokeStyle = 'rgba(0, 123, 255, 0.5)'; break; } } staveNote.setStyle({ fillStyle: fillStyle, strokeStyle: strokeStyle }); return staveNote;
    });
}


// --- Funzione Principale Esportata ---
export function renderExercise(elementId, exercise) {
    const scoreDiv = document.getElementById(elementId);
    if (!scoreDiv) { console.error(`Elemento "${elementId}" non trovato.`); return; }
    scoreDiv.innerHTML = ''; // Pulisce prima di disegnare

    const useGrandStaff = exercise.staveLayout === 'grand' || (exercise.notesTreble && exercise.notesBass);
    const rendererWidth = scoreDiv.clientWidth > 0 ? scoreDiv.clientWidth - 40 : 760; // Larghezza utile (meno padding)
    const ticksPerMeasure = getTicksPerMeasure(exercise.timeSignature || "4/4");
    const ticksPerLine = ticksPerMeasure * MEASURES_PER_LINE;

    // --- Suddividi le note in segmenti per riga ---
    const trebleSegments = segmentNotesByMeasure(exercise.notesTreble, ticksPerMeasure, MEASURES_PER_LINE);
    const bassSegments = segmentNotesByMeasure(exercise.notesBass, ticksPerMeasure, MEASURES_PER_LINE);
    // Supporto per vecchio formato 'notes' (assume treble se non specificato)
    const singleStaveSegments = segmentNotesByMeasure(exercise.notes, ticksPerMeasure, MEASURES_PER_LINE);

    const numSystems = useGrandStaff ? Math.max(trebleSegments.length, bassSegments.length) : singleStaveSegments.length;
    if (numSystems === 0) { scoreDiv.innerHTML = "<p>Nessuna nota da visualizzare.</p>"; return; }

    // Altezza totale stimata
    const totalHeight = (useGrandStaff ? STAVE_START_Y_GRAND + STAVE_VERTICAL_DISTANCE : STAVE_START_Y_SINGLE) +
                        (numSystems * (useGrandStaff ? SYSTEM_SPACING : SINGLE_STAVE_SYSTEM_SPACING)) + 50; // Aggiungi padding sotto

    // Crea Factory con altezza calcolata
    const factory = new Factory({ renderer: { elementId: elementId, width: rendererWidth + 40, height: totalHeight } });
    const context = factory.getContext();
    context.setFont('Arial', 10);

    let currentY_Treble = useGrandStaff ? STAVE_START_Y_GRAND : STAVE_START_Y_SINGLE;
    let currentY_Bass = STAVE_START_Y_GRAND + STAVE_VERTICAL_DISTANCE; // Usato solo per grand staff
    let previousTrebleStave = null;
    let previousBassStave = null;

    try {
        // --- Ciclo per disegnare ogni sistema (riga) ---
        for (let i = 0; i < numSystems; i++) {
            const staveWidth = rendererWidth; // Usa larghezza piena per ogni riga
            let staveTreble = null, staveBass = null;
            let notesVexTreble = []; let notesVexBass = [];
            const voicesToFormat = []; let voiceTreble = null; let voiceBass = null;
            const isFirstSystem = (i === 0);

            // Y corrente per questo sistema
            const systemY_Treble = useGrandStaff ? STAVE_START_Y_GRAND + (i * SYSTEM_SPACING) : STAVE_START_Y_SINGLE + (i * SINGLE_STAVE_SYSTEM_SPACING);
            const systemY_Bass = STAVE_START_Y_GRAND + STAVE_VERTICAL_DISTANCE + (i * SYSTEM_SPACING);

            if (useGrandStaff) {
                // Disegna Stave Treble
                staveTreble = new Stave(STAVE_START_X, systemY_Treble, staveWidth);
                if (isFirstSystem) { // Aggiungi elementi solo al primo sistema
                    staveTreble.addClef('treble');
                    if (exercise.keySignature) staveTreble.addKeySignature(exercise.keySignature);
                    if (exercise.timeSignature) staveTreble.addTimeSignature(exercise.timeSignature);
                } else {
                    staveTreble.addClef('treble'); // Chiave sempre necessaria all'inizio della riga
                }
                staveTreble.setContext(context).draw();

                // Disegna Stave Bass
                staveBass = new Stave(STAVE_START_X, systemY_Bass, staveWidth);
                if (isFirstSystem) {
                     staveBass.addClef('bass');
                     if (exercise.keySignature) staveBass.addKeySignature(exercise.keySignature);
                     if (exercise.timeSignature) staveBass.addTimeSignature(exercise.timeSignature);
                } else {
                     staveBass.addClef('bass');
                }
                staveBass.setContext(context).draw();

                 // Connettori
                if (isFirstSystem) { // Brace e linea iniziale solo per il primo sistema
                     new StaveConnector(staveTreble, staveBass).setType(StaveConnector.type.BRACE).setContext(context).draw();
                     new StaveConnector(staveTreble, staveBass).setType(StaveConnector.type.SINGLE_LEFT).setContext(context).draw();
                 }
                 // Linea che collega i due pentagrammi all'inizio di ogni sistema
                 new StaveConnector(staveTreble, staveBass).setType(StaveConnector.type.SINGLE_LEFT).setContext(context).draw();


            } else { // Pentagramma Singolo
                const clef = exercise.clef || 'treble';
                staveTreble = new Stave(STAVE_START_X, systemY_Treble, staveWidth); // Assume treble o usa var dedicata
                 if (isFirstSystem) {
                    staveTreble.addClef(clef);
                    if (exercise.keySignature) staveTreble.addKeySignature(exercise.keySignature);
                    if (exercise.timeSignature) staveTreble.addTimeSignature(exercise.timeSignature);
                 } else {
                     staveTreble.addClef(clef);
                 }
                 staveTreble.setContext(context).draw();
                 new StaveConnector(staveTreble, staveTreble).setType(StaveConnector.type.SINGLE_LEFT).setContext(context).draw();
                 // Assegna a treble o bass per riferimento note
                 if (clef === 'bass') staveBass = staveTreble;
            }

            // --- Prepara Note per questo Sistema ---
            if (useGrandStaff) {
                if (trebleSegments[i]?.length > 0) {
                    notesVexTreble = createStyledStaveNotes(trebleSegments[i], 'treble');
                    if(notesVexTreble.length > 0) { voiceTreble = new Voice().setMode(Voice.Mode.SOFT).addTickables(notesVexTreble); voicesToFormat.push(voiceTreble); }
                }
                 if (bassSegments[i]?.length > 0) {
                     console.log(`>>> DEBUG BASSO - Sistema ${i+1}:`, JSON.stringify(bassSegments[i]));
                     notesVexBass = createStyledStaveNotes(bassSegments[i], 'bass');
                    if(notesVexBass.length > 0) { voiceBass = new Voice().setMode(Voice.Mode.SOFT).addTickables(notesVexBass); voicesToFormat.push(voiceBass); }
                }
            } else { // Single Stave
                const clefType = exercise.clef || 'treble';
                if (singleStaveSegments[i]?.length > 0) {
                    console.log(`>>> DEBUG SINGLE ${clefType} - Sistema ${i+1}:`, JSON.stringify(singleStaveSegments[i]));
                    const styledNotes = createStyledStaveNotes(singleStaveSegments[i], clefType);
                    if(styledNotes.length > 0) {
                        const singleVoice = new Voice().setMode(Voice.Mode.SOFT).addTickables(styledNotes);
                        voicesToFormat.push(singleVoice);
                        if (clefType === 'bass') { notesVexBass = styledNotes; voiceBass = singleVoice; }
                        else { notesVexTreble = styledNotes; voiceTreble = singleVoice; }
                    }
                }
            }

             // --- Formatta e Disegna Voci per questo Sistema ---
             if (voicesToFormat.length > 0) {
                const formatter = new Formatter().joinVoices(voicesToFormat);
                const formatWidth = staveWidth - 40; // Spazio formattazione per sistema
                try {
                    // Usa minTotalTicks per la formattazione per evitare errori se una voce è vuota
                    formatter.format(voicesToFormat, formatWidth > 0 ? formatWidth : undefined, { align_rests: true });
                } catch (e) { console.warn(`Formatter error system ${i+1}:`, e); }

                // Disegna le voci
                if (voiceTreble && staveTreble) {
                    voiceTreble.draw(context, staveTreble);
                    Beam.generateBeams(voiceTreble.getTickables()).forEach(beam => beam.setContext(context).draw());
                }
                if (voiceBass && staveBass) {
                    voiceBass.draw(context, staveBass);
                    Beam.generateBeams(voiceBass.getTickables()).forEach(beam => beam.setContext(context).draw());
                }
            }

            previousTrebleStave = staveTreble; // Salva per eventuali connettori tra sistemi
            previousBassStave = staveBass;

        } // --- Fine ciclo for sui sistemi ---

    } catch (error) {
        console.error("Errore generale rendering VexFlow:", error);
        scoreDiv.innerHTML = `<p style="color: red;">Errore VexFlow: ${error.message}</p>`;
    }
}