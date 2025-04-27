/**
 * js/vexflow_renderer.js
 * Renderer per esercizi musicali usando VexFlow.
 * **VERSIONE COMPLETA con CLEF ESPLICITO in StaveNote**
 */

// Importa le classi necessarie da VexFlow
const { Factory, Stave, StaveNote, Formatter, Voice, Beam, Accidental, StaveConnector, TickContext } = Vex.Flow;

// --- Funzioni Helper ---

/**
 * Converte una stringa di durata VexFlow (es. 'q', 'h.', '8d') in tick.
 * @param {string} durationString La stringa della durata.
 * @returns {number} Il numero di tick VexFlow.
 */
function durationToTicks(durationString) {
    const BEAT_TICKS = Vex.Flow.RESOLUTION / 4; // Ticks per semiminima (quarto)
    let ticks = 0;
    // Rimuove punti e 'd' (per durata base)
    const baseDuration = durationString.replace('.', '').replace('d', '');

    switch (baseDuration) {
        case 'w': ticks = 4 * BEAT_TICKS; break;  // Semibreve
        case 'h': ticks = 2 * BEAT_TICKS; break;  // Minima
        case 'q': ticks = BEAT_TICKS; break;      // Semiminima
        case '8': ticks = BEAT_TICKS / 2; break;  // Croma
        case '16': ticks = BEAT_TICKS / 4; break; // Semicroma
        case '32': ticks = BEAT_TICKS / 8; break; // Biscroma
        default: ticks = BEAT_TICKS; // Default a semiminima se sconosciuto
    }

    // Gestione punti (aggiunge metà del valore per ogni punto)
    if (durationString.includes('.')) {
        let numDots = (durationString.match(/\./g) || []).length;
        let dotValue = ticks;
        for (let i = 0; i < numDots; i++) {
            dotValue /= 2;
            ticks += dotValue;
        }
    }
    // Gestione 'd' per punto singolo (alternativa a '.')
    else if (durationString.endsWith('d')) {
         ticks = ticks * 1.5; // Aggiunge metà del valore
    }

    return ticks;
}

/**
 * Imposta l'area di rendering VexFlow nel DOM.
 * @param {string} elementId ID dell'elemento div per il rendering.
 * @param {boolean} needsGrandStaff Indica se serve spazio per il doppio pentagramma.
 * @returns {object|null} Oggetto con factory, context, scoreDiv, rendererWidth, rendererHeight o null se fallisce.
 */
function setupScore(elementId, needsGrandStaff) {
    const scoreDiv = document.getElementById(elementId);
    if (!scoreDiv) {
        console.error(`Element with id "${elementId}" not found.`);
        return null;
    }
    scoreDiv.innerHTML = ''; // Pulisce il contenuto precedente
    // Calcola larghezza, usa 800px come fallback se l'elemento non ha larghezza visibile
    const rendererWidth = scoreDiv.clientWidth > 0 ? scoreDiv.clientWidth : 800;
    // Altezza dipende se è pentagramma singolo o doppio
    const rendererHeight = needsGrandStaff ? 300 : 200;

    // Crea la factory VexFlow
    const factory = new Factory({
        renderer: { elementId: elementId, width: rendererWidth, height: rendererHeight }
    });
    const context = factory.getContext();
    context.setFont('Arial', 10); // Imposta font (opzionale)

    return { factory, context, scoreDiv, rendererWidth, rendererHeight };
}

/**
 * Crea un array di oggetti Vex.Flow.StaveNote stilizzati a partire dai dati.
 * @param {Array} noteDataArray Array di oggetti { keys, duration, status?, midiValue? }.
 * @param {string} clefType Il tipo di chiave ('treble' o 'bass') per queste note.
 * @param {string} defaultFill Colore di riempimento di default.
 * @param {string} defaultStroke Colore del bordo di default.
 * @returns {Array<Vex.Flow.StaveNote>} Array di StaveNote stilizzate e con chiave specificata.
 */
function createStyledStaveNotes(noteDataArray, clefType, defaultFill = '#333', defaultStroke = '#333') {
    if (!noteDataArray) return []; // Ritorna array vuoto se non ci sono dati

    return noteDataArray.map((noteData, index) => {
        // 1. Crea oggetto di configurazione per StaveNote, aggiungendo la chiave
        const noteConfig = {
            keys: noteData.keys,
            duration: noteData.duration,
            clef: clefType // <<====== CHIAVE ESPLICITA PER POSIZIONAMENTO
            // VexFlow userà automaticamente altri campi come 'dots' se presenti in noteData
        };
        const staveNote = new StaveNote(noteConfig);

        // 2. Aggiungi Accidentali Visibili (se specificati nel nome della nota)
        noteData.keys.forEach((key, keyIndex) => {
            const keyParts = key.split('/');
            const pitchName = keyParts[0]; // Es: "f#", "b", "bb"

            if (pitchName.endsWith('##')) {
                staveNote.addModifier(new Accidental('##'), keyIndex);
            } else if (pitchName.endsWith('#')) {
                 staveNote.addModifier(new Accidental('#'), keyIndex);
            } else if (pitchName.endsWith('bb')) {
                // Nome finisce in 'bb', aggiungi un SINGOLO bemolle visivo
                staveNote.addModifier(new Accidental('b'), keyIndex);
            } else if (pitchName.length > 1 && pitchName.endsWith('b')) {
                // Nome finisce in 'b' ma NON è 'b' naturale (es. "gb")
                staveNote.addModifier(new Accidental('b'), keyIndex);
            }
            // Le note naturali (es. "c/4", "b/4") non ricevono accidentali qui.
            // Quelle richieste dalla tonalità verranno gestite da VexFlow stesso.
        });

        // 3. Aggiungi Punti (se presenti nella stringa duration)
        // Vexflow 4+ gestisce la 'd' (es 'qd') automaticamente, ma '.' no.
         if (noteData.duration.includes('.')) {
             let numDots = (noteData.duration.match(/\./g) || []).length;
             for (let i = 0; i < numDots; i++) {
                 staveNote.addDotToAll(); // Aggiunge punto a tutte le note nell'accordo/nota
             }
         }

        // 4. Applica Stile basato sullo stato (passato da main.js)
        let fillStyle = defaultFill;
        let strokeStyle = defaultStroke;
        switch (noteData.status) {
            case 'correct':
                fillStyle = '#28a745'; // Verde
                strokeStyle = '#1c7430';
                break;
            case 'incorrect': // Stato usato se la nota era attesa ma si è suonato altro
                fillStyle = 'rgba(220, 53, 69, 0.4)'; // Rosso semi-trasparente
                strokeStyle = '#a71d2a';
                break;
            case 'expected': // Stato per note in attesa (modalità libera)
                fillStyle = 'rgba(0, 123, 255, 0.3)'; // Blu semi-trasparente
                strokeStyle = 'rgba(0, 123, 255, 0.5)';
                break;
            // 'pending' userà i colori di default
        }
        staveNote.setStyle({ fillStyle: fillStyle, strokeStyle: strokeStyle });

        // 5. Ritorna la nota configurata
        return staveNote;
    });
}

// --- Funzione Principale Esportata ---
/**
 * Renderizza l'esercizio musicale sul pentagramma specificato.
 * @param {string} elementId ID dell'elemento div contenitore.
 * @param {object} exercise Oggetto esercizio con i dati delle note.
 */
export function renderExercise(elementId, exercise) {
    // Determina se usare doppio pentagramma (Grand Staff)
    const useGrandStaff = exercise.staveLayout === 'grand' || (exercise.notesTreble && exercise.notesBass);

    // Imposta l'area di rendering
    const setup = setupScore(elementId, useGrandStaff);
    if (!setup) return; // Esce se l'elemento non è stato trovato
    const { factory, context, scoreDiv, rendererWidth } = setup;

    // --- Calcolo Larghezza Pentagramma ---
    // Raccogli tutte le note definite per stimare la durata totale
    const notesForWidthCalc = [];
    if (exercise.notesTreble) notesForWidthCalc.push(...exercise.notesTreble);
    if (exercise.notesBass) notesForWidthCalc.push(...exercise.notesBass);
    if (exercise.notes) notesForWidthCalc.push(...exercise.notes); // Supporto vecchio formato

    // Calcola i tick totali (prendi il massimo tra le due voci se grand staff)
    let totalTicks = 0;
    if (useGrandStaff) {
        const ticksTreble = exercise.notesTreble?.reduce((sum, note) => sum + durationToTicks(note.duration), 0) ?? 0;
        const ticksBass = exercise.notesBass?.reduce((sum, note) => sum + durationToTicks(note.duration), 0) ?? 0;
        totalTicks = Math.max(ticksTreble, ticksBass);
    } else {
         totalTicks = notesForWidthCalc.reduce((sum, note) => sum + durationToTicks(note.duration), 0) ?? 0;
    }

    // Stima la larghezza minima necessaria e calcola la larghezza effettiva
    const estimatedMinWidth = (totalTicks / Vex.Flow.RESOLUTION) * (useGrandStaff ? 200 : 180); // Fattore moltiplicativo per pixel/beat
    const staveWidth = Math.max(rendererWidth * 0.9, estimatedMinWidth); // Usa 90% larghezza o minima stimata
    const staveStartX = 20; // Margine sinistro
    const staveTrebleY = useGrandStaff ? 40 : 60; // Posizione Y pentagramma superiore (o unico)
    const staveBassY = staveTrebleY + 100; // Posizione Y pentagramma inferiore (solo se grand staff)

    // --- Disegno Pentagrammi e Note ---
    try {
        let staveTreble = null, staveBass = null; // Riferimenti ai pentagrammi VexFlow
        const staves = []; // Array per contenere i pentagrammi (utile per formattazione)

        // 1. Configurazione e Disegno Pentagrammi
        if (useGrandStaff) {
            // Pentagramma Violino (Superiore)
            staveTreble = new Stave(staveStartX, staveTrebleY, staveWidth).addClef('treble');
            if (exercise.keySignature) staveTreble.addKeySignature(exercise.keySignature);
            if (exercise.timeSignature) staveTreble.addTimeSignature(exercise.timeSignature);
            staveTreble.setContext(context).draw();
            staves.push(staveTreble);

            // Pentagramma Basso (Inferiore)
            staveBass = new Stave(staveStartX, staveBassY, staveWidth).addClef('bass');
            if (exercise.keySignature) staveBass.addKeySignature(exercise.keySignature); // Usa stessa tonalità
            if (exercise.timeSignature) staveBass.addTimeSignature(exercise.timeSignature); // Usa stesso tempo
            staveBass.setContext(context).draw();
            staves.push(staveBass);

            // Connettori per Grand Staff (graffa, linea iniziale comune)
            new StaveConnector(staveTreble, staveBass).setType(StaveConnector.type.GRAND_STAFF).setContext(context).draw();
            new StaveConnector(staveTreble, staveBass).setType(StaveConnector.type.BRACE).setContext(context).draw();
            new StaveConnector(staveTreble, staveBass).setType(StaveConnector.type.SINGLE_LEFT).setContext(context).draw();

        } else {
             // Pentagramma Singolo
             const singleStaveY = staveTrebleY; // Usa la Y superiore
             const clef = exercise.clef || 'treble'; // Default a treble se non specificato
             const singleStave = new Stave(staveStartX, singleStaveY, staveWidth).addClef(clef);
             if (exercise.keySignature) singleStave.addKeySignature(exercise.keySignature);
             if (exercise.timeSignature) singleStave.addTimeSignature(exercise.timeSignature);
             singleStave.setContext(context).draw();
             staves.push(singleStave);

             // Assegna a staveTreble o staveBass per riferimento futuro
             if (clef === 'treble') staveTreble = singleStave; else staveBass = singleStave;
             // Linea iniziale singola
             new StaveConnector(singleStave, singleStave).setType(StaveConnector.type.SINGLE_LEFT).setContext(context).draw();
        }

        // 2. Creazione Note VexFlow STILIZZATE (passando la chiave corretta)
        let notesVexTreble = []; // Array di oggetti Vex.Flow.StaveNote
        let notesVexBass = [];
        const voicesToFormat = []; // Array di oggetti Vex.Flow.Voice
        let voiceTreble = null; // Riferimento alla voce treble
        let voiceBass = null;   // Riferimento alla voce bass

        if (useGrandStaff) {
            // Crea note e voce per Treble (passando 'treble')
            if (exercise.notesTreble && exercise.notesTreble.length > 0) {
                notesVexTreble = createStyledStaveNotes(exercise.notesTreble, 'treble');
                voiceTreble = new Voice({ num_beats: totalTicks / (Vex.Flow.RESOLUTION / 4) , beat_value: 4 }).setStrict(false).addTickables(notesVexTreble);
                voicesToFormat.push(voiceTreble);
            }
            // Crea note e voce per Bass (passando 'bass')
            if (exercise.notesBass && exercise.notesBass.length > 0) {
                console.log(">>> DEBUG DATI BASSO per createStyledStaveNotes:", JSON.stringify(exercise.notesBass)); // Log Dati
                notesVexBass = createStyledStaveNotes(exercise.notesBass, 'bass');
                voiceBass = new Voice({ num_beats: totalTicks / (Vex.Flow.RESOLUTION / 4), beat_value: 4 }).setStrict(false).addTickables(notesVexBass);
                voicesToFormat.push(voiceBass);
            }
        } else {
            // Gestione pentagramma singolo
             const clefType = exercise.clef || 'treble';
             const notesToRender = exercise.notes || (clefType === 'bass' ? exercise.notesBass : exercise.notesTreble);
             if (notesToRender && notesToRender.length > 0) {
                 console.log(`>>> DEBUG DATI SINGLE (${clefType}) per createStyledStaveNotes:`, JSON.stringify(notesToRender));
                 // Passa la chiave corretta ('treble' o 'bass')
                 const styledNotes = createStyledStaveNotes(notesToRender, clefType);
                 const singleVoice = new Voice({ num_beats: totalTicks / (Vex.Flow.RESOLUTION / 4), beat_value: 4 }).setStrict(false).addTickables(styledNotes);
                 voicesToFormat.push(singleVoice);
                 // Assegna note e voce per riferimento
                 if (clefType === 'bass') { notesVexBass = styledNotes; voiceBass = singleVoice; }
                 else { notesVexTreble = styledNotes; voiceTreble = singleVoice; }
            }
        }

        // 3. Formattazione e Disegno Voci e Travature
        if (voicesToFormat.length > 0) {
            // Usa Formatter per allineare le voci (essenziale se > 1 voce)
            const formatter = new Formatter().joinVoices(voicesToFormat);
            // Calcola larghezza disponibile per le note (un po' meno del pentagramma)
            const formatWidth = staveWidth * 0.9;
            formatter.format(voicesToFormat, formatWidth);

            // Disegna ogni voce sul pentagramma corretto
            if (voiceTreble && staveTreble) {
                 voiceTreble.draw(context, staveTreble);
                 // Aggiungi travature (beams) per la voce treble
                 Beam.generateBeams(voiceTreble.getTickables())
                     .forEach(beam => beam.setContext(context).draw());
            }
             if (voiceBass && staveBass) {
                 voiceBass.draw(context, staveBass);
                  // Aggiungi travature (beams) per la voce bass
                 Beam.generateBeams(voiceBass.getTickables())
                     .forEach(beam => beam.setContext(context).draw());
            }
        } else {
            // Messaggio se non ci sono note nell'esercizio
            console.log("Nessuna nota da renderizzare.");
            scoreDiv.innerHTML += '<p>Esercizio vuoto o dati non validi.</p>';
        }
    } catch (error) {
        // Gestione errori VexFlow
        console.error("Errore durante il rendering VexFlow:", error);
        // Mostra messaggio di errore all'utente nel div dello spartito
        scoreDiv.innerHTML = `<p style="color: red; font-family: monospace; white-space: pre-wrap;">Errore VexFlow: ${error.message}\n${error.stack}</p>`;
    }
}