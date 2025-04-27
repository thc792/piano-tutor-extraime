/**
 * js/exercises/indipendenza_mani.js
 * Esercizi per sviluppare l'indipendenza delle mani al pianoforte.
 * **VERSIONE COMPLETA E CORRETTA**
 *
 * STRUTTURA DATI:
 * - `keys`: Stringhe VexFlow per VISUALIZZAZIONE corretta. Bass clef usa /3, /4 ecc.
 * - `midiValue` (numero): MIDI pitch REALE della nota singola.
 * - `midiValues` (array): MIDI pitch REALI delle note di un accordo.
 * - `repetitions`: Numero di volte che l'esercizio va ripetuto (LOGICA IN main.js).
 */

const independenceExercises = [

    // === Sezione 1: Ritmi Diversi (Posizione 5 dita Do Magg) ===
    {
        id: "indep-01-rhQ-lh8", name: "Ritmo 1: RH Q / LH 8 (Do Magg)",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["d/4"], duration: "q", midiValue: 62 }, { keys: ["e/4"], duration: "q", midiValue: 64 }, { keys: ["f/4"], duration: "q", midiValue: 65 }, { keys: ["g/4"], duration: "w", midiValue: 67 } ],
        notesBass: [ { keys: ["c/3"], duration: "8", midiValue: 48 }, { keys: ["d/3"], duration: "8", midiValue: 50 }, { keys: ["e/3"], duration: "8", midiValue: 52 }, { keys: ["f/3"], duration: "8", midiValue: 53 }, { keys: ["g/3"], duration: "8", midiValue: 55 }, { keys: ["f/3"], duration: "8", midiValue: 53 }, { keys: ["e/3"], duration: "8", midiValue: 52 }, { keys: ["d/3"], duration: "8", midiValue: 50 }, { keys: ["c/3"], duration: "w", midiValue: 48 } ]
    },
    {
        id: "indep-02-rh8-lhQ", name: "Ritmo 2: RH 8 / LH Q (Do Magg)",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
         notesTreble: [ { keys: ["c/4"], duration: "8", midiValue: 60 }, { keys: ["d/4"], duration: "8", midiValue: 62 }, { keys: ["e/4"], duration: "8", midiValue: 64 }, { keys: ["f/4"], duration: "8", midiValue: 65 }, { keys: ["g/4"], duration: "8", midiValue: 67 }, { keys: ["f/4"], duration: "8", midiValue: 65 }, { keys: ["e/4"], duration: "8", midiValue: 64 }, { keys: ["d/4"], duration: "8", midiValue: 62 }, { keys: ["c/4"], duration: "w", midiValue: 60 } ],
         notesBass: [ { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["d/3"], duration: "q", midiValue: 50 }, { keys: ["e/3"], duration: "q", midiValue: 52 }, { keys: ["f/3"], duration: "q", midiValue: 53 }, { keys: ["g/3"], duration: "w", midiValue: 55 } ]
    },
    {
        id: "indep-03-rhHold-lhMove", name: "Ritmo 3: RH Tiene / LH 8 (Do Magg)",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ { keys: ["c/4"], duration: "w", midiValue: 60 }, { keys: ["c/4"], duration: "w", midiValue: 60 } ], // Due misure
        notesBass: [ { keys: ["c/3"], duration: "8", midiValue: 48 }, { keys: ["d/3"], duration: "8", midiValue: 50 }, { keys: ["e/3"], duration: "8", midiValue: 52 }, { keys: ["f/3"], duration: "8", midiValue: 53 }, { keys: ["g/3"], duration: "8", midiValue: 55 }, { keys: ["f/3"], duration: "8", midiValue: 53 }, { keys: ["e/3"], duration: "8", midiValue: 52 }, { keys: ["d/3"], duration: "8", midiValue: 50 }, { keys: ["c/3"], duration: "8", midiValue: 48 }, { keys: ["d/3"], duration: "8", midiValue: 50 }, { keys: ["e/3"], duration: "8", midiValue: 52 }, { keys: ["f/3"], duration: "8", midiValue: 53 }, { keys: ["g/3"], duration: "8", midiValue: 55 }, { keys: ["f/3"], duration: "8", midiValue: 53 }, { keys: ["e/3"], duration: "8", midiValue: 52 }, { keys: ["d/3"], duration: "8", midiValue: 50 } ]
    },
    {
        id: "indep-04-lhHold-rhMove", name: "Ritmo 4: LH Tiene / RH 8 (Do Magg)",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ { keys: ["c/4"], duration: "8", midiValue: 60 }, { keys: ["d/4"], duration: "8", midiValue: 62 }, { keys: ["e/4"], duration: "8", midiValue: 64 }, { keys: ["f/4"], duration: "8", midiValue: 65 }, { keys: ["g/4"], duration: "8", midiValue: 67 }, { keys: ["f/4"], duration: "8", midiValue: 65 }, { keys: ["e/4"], duration: "8", midiValue: 64 }, { keys: ["d/4"], duration: "8", midiValue: 62 }, { keys: ["c/4"], duration: "8", midiValue: 60 }, { keys: ["d/4"], duration: "8", midiValue: 62 }, { keys: ["e/4"], duration: "8", midiValue: 64 }, { keys: ["f/4"], duration: "8", midiValue: 65 }, { keys: ["g/4"], duration: "8", midiValue: 67 }, { keys: ["f/4"], duration: "8", midiValue: 65 }, { keys: ["e/4"], duration: "8", midiValue: 64 }, { keys: ["d/4"], duration: "8", midiValue: 62 } ],
         notesBass: [ { keys: ["c/3"], duration: "w", midiValue: 48 }, { keys: ["c/3"], duration: "w", midiValue: 48 } ]
    },
    {
        id: "indep-05-rhDotted-lhQ", name: "Ritmo 5: RH Puntato / LH Q (Do Magg)",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ { keys: ["c/4"], duration: "8d", midiValue: 60 }, { keys: ["d/4"], duration: "16", midiValue: 62 }, { keys: ["e/4"], duration: "8d", midiValue: 64 }, { keys: ["f/4"], duration: "16", midiValue: 65 }, { keys: ["g/4"], duration: "8d", midiValue: 67 }, { keys: ["f/4"], duration: "16", midiValue: 65 }, { keys: ["e/4"], duration: "8d", midiValue: 64 }, { keys: ["d/4"], duration: "16", midiValue: 62 }, { keys: ["c/4"], duration: "h", midiValue: 60 } ],
        notesBass: [ { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["d/3"], duration: "q", midiValue: 50 }, { keys: ["e/3"], duration: "q", midiValue: 52 }, { keys: ["f/3"], duration: "q", midiValue: 53 }, { keys: ["g/3"], duration: "h", midiValue: 55 } ]
    },
    {
        id: "indep-06-lhDotted-rhQ", name: "Ritmo 6: LH Puntato / RH Q (Do Magg)",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["d/4"], duration: "q", midiValue: 62 }, { keys: ["e/4"], duration: "q", midiValue: 64 }, { keys: ["f/4"], duration: "q", midiValue: 65 }, { keys: ["g/4"], duration: "h", midiValue: 67 } ],
        notesBass: [ { keys: ["c/3"], duration: "8d", midiValue: 48 }, { keys: ["d/3"], duration: "16", midiValue: 50 }, { keys: ["e/3"], duration: "8d", midiValue: 52 }, { keys: ["f/3"], duration: "16", midiValue: 53 }, { keys: ["g/3"], duration: "8d", midiValue: 55 }, { keys: ["f/3"], duration: "16", midiValue: 53 }, { keys: ["e/3"], duration: "8d", midiValue: 52 }, { keys: ["d/3"], duration: "16", midiValue: 50 }, { keys: ["c/3"], duration: "h", midiValue: 48 } ]
    },

    // === Sezione 2: Moto Contrario (Diverse Tonalità) ===
    {
        id: "indep-07-contrary-scale-Cmaj", name: "Moto Contrario 1: Scala Do Magg",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["d/4"], duration: "q", midiValue: 62 }, { keys: ["e/4"], duration: "q", midiValue: 64 }, { keys: ["f/4"], duration: "q", midiValue: 65 }, { keys: ["g/4"], duration: "q", midiValue: 67 }, { keys: ["a/4"], duration: "q", midiValue: 69 }, { keys: ["b/4"], duration: "q", midiValue: 71 }, { keys: ["c/5"], duration: "q", midiValue: 72 } ],
        notesBass: [ { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["b/3"], duration: "q", midiValue: 59 }, { keys: ["a/3"], duration: "q", midiValue: 57 }, { keys: ["g/3"], duration: "q", midiValue: 55 }, { keys: ["f/3"], duration: "q", midiValue: 53 }, { keys: ["e/3"], duration: "q", midiValue: 52 }, { keys: ["d/3"], duration: "q", midiValue: 50 }, { keys: ["c/3"], duration: "q", midiValue: 48 } ]
    },
     {
        id: "indep-08-contrary-scale-Gmaj", name: "Moto Contrario 2: Scala Sol Magg",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "G", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ { keys: ["g/4"], duration: "q", midiValue: 67 }, { keys: ["a/4"], duration: "q", midiValue: 69 }, { keys: ["b/4"], duration: "q", midiValue: 71 }, { keys: ["c/5"], duration: "q", midiValue: 72 }, { keys: ["d/5"], duration: "q", midiValue: 74 }, { keys: ["e/5"], duration: "q", midiValue: 76 }, { keys: ["f#/5"], duration: "q", midiValue: 78 }, { keys: ["g/5"], duration: "q", midiValue: 79 } ],
        notesBass: [ { keys: ["g/4"], duration: "q", midiValue: 67 }, { keys: ["f#/4"], duration: "q", midiValue: 66 }, { keys: ["e/4"], duration: "q", midiValue: 64 }, { keys: ["d/4"], duration: "q", midiValue: 62 }, { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["b/3"], duration: "q", midiValue: 59 }, { keys: ["a/3"], duration: "q", midiValue: 57 }, { keys: ["g/3"], duration: "q", midiValue: 55 } ]
    },
     {
        id: "indep-09-contrary-scale-AminHarm", name: "Moto Contrario 3: Scala La Min Arm",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "Am", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ { keys: ["a/4"], duration: "q", midiValue: 69 }, { keys: ["b/4"], duration: "q", midiValue: 71 }, { keys: ["c/5"], duration: "q", midiValue: 72 }, { keys: ["d/5"], duration: "q", midiValue: 74 }, { keys: ["e/5"], duration: "q", midiValue: 76 }, { keys: ["f/5"], duration: "q", midiValue: 77 }, { keys: ["g#/5"], duration: "q", midiValue: 80 }, { keys: ["a/5"], duration: "q", midiValue: 81 } ],
        notesBass: [ { keys: ["a/4"], duration: "q", midiValue: 69 }, { keys: ["g#/4"], duration: "q", midiValue: 68 }, { keys: ["f/4"], duration: "q", midiValue: 65 }, { keys: ["e/4"], duration: "q", midiValue: 64 }, { keys: ["d/4"], duration: "q", midiValue: 62 }, { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["b/3"], duration: "q", midiValue: 59 }, { keys: ["a/3"], duration: "q", midiValue: 57 } ]
    },

    // --- Sezione 3: Moto Parallelo a Intervalli Diversi ---
    {
        id: "indep-10-parallel-3rds-Cmaj", name: "Parallelo 1: Terze (Do Magg)",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ { keys: ["e/4"], duration: "q", midiValue: 64 }, { keys: ["f/4"], duration: "q", midiValue: 65 }, { keys: ["g/4"], duration: "q", midiValue: 67 }, { keys: ["a/4"], duration: "q", midiValue: 69 }, { keys: ["b/4"], duration: "h", midiValue: 71 } ],
        notesBass: [ { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["d/3"], duration: "q", midiValue: 50 }, { keys: ["e/3"], duration: "q", midiValue: 52 }, { keys: ["f/3"], duration: "q", midiValue: 53 }, { keys: ["g/3"], duration: "h", midiValue: 55 } ]
    },
     {
        id: "indep-11-parallel-6ths-Cmaj", name: "Parallelo 2: Seste (Do Magg)",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ { keys: ["a/4"], duration: "q", midiValue: 69 }, { keys: ["b/4"], duration: "q", midiValue: 71 }, { keys: ["c/5"], duration: "q", midiValue: 72 }, { keys: ["d/5"], duration: "q", midiValue: 74 }, { keys: ["e/5"], duration: "h", midiValue: 76 } ],
        notesBass: [ { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["d/3"], duration: "q", midiValue: 50 }, { keys: ["e/3"], duration: "q", midiValue: 52 }, { keys: ["f/3"], duration: "q", midiValue: 53 }, { keys: ["g/3"], duration: "h", midiValue: 55 } ]
    },
     {
        id: "indep-12-parallel-3rds-Gmaj", name: "Parallelo 3: Terze (Sol Magg)",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "G", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ { keys: ["b/4"], duration: "q", midiValue: 71 }, { keys: ["c/5"], duration: "q", midiValue: 72 }, { keys: ["d/5"], duration: "q", midiValue: 74 }, { keys: ["e/5"], duration: "q", midiValue: 76 }, { keys: ["f#/5"], duration: "h", midiValue: 78 } ],
        notesBass: [ { keys: ["g/3"], duration: "q", midiValue: 55 }, { keys: ["a/3"], duration: "q", midiValue: 57 }, { keys: ["b/3"], duration: "q", midiValue: 59 }, { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["d/4"], duration: "h", midiValue: 62 } ]
    },
    {
        id: "indep-13-parallel-6ths-Gmaj", name: "Parallelo 4: Seste (Sol Magg)",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "G", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ { keys: ["e/5"], duration: "q", midiValue: 76 }, { keys: ["f#/5"], duration: "q", midiValue: 78 }, { keys: ["g/5"], duration: "q", midiValue: 79 }, { keys: ["a/5"], duration: "q", midiValue: 81 }, { keys: ["b/5"], duration: "h", midiValue: 83 } ],
        notesBass: [ { keys: ["g/3"], duration: "q", midiValue: 55 }, { keys: ["a/3"], duration: "q", midiValue: 57 }, { keys: ["b/3"], duration: "q", midiValue: 59 }, { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["d/4"], duration: "h", midiValue: 62 } ]
    },

    // --- Sezione 4: Ostinato vs Melodia/Scala ---
    {
        id: "indep-14-ostinatoLH-scaleRH-Cmaj", name: "Ostinato 1: LH C-G / RH Scala Do Magg",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["d/4"], duration: "q", midiValue: 62 }, { keys: ["e/4"], duration: "q", midiValue: 64 }, { keys: ["f/4"], duration: "q", midiValue: 65 }, { keys: ["g/4"], duration: "q", midiValue: 67 }, { keys: ["a/4"], duration: "q", midiValue: 69 }, { keys: ["b/4"], duration: "q", midiValue: 71 }, { keys: ["c/5"], duration: "q", midiValue: 72 } ],
        notesBass: [ { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["g/3"], duration: "q", midiValue: 55 }, { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["g/3"], duration: "q", midiValue: 55 }, { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["g/3"], duration: "q", midiValue: 55 }, { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["g/3"], duration: "q", midiValue: 55 } ]
    },
     {
        id: "indep-15-ostinatoRH-scaleLH-Cmaj", name: "Ostinato 2: RH C-G / LH Scala Do Magg",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["g/4"], duration: "q", midiValue: 67 }, { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["g/4"], duration: "q", midiValue: 67 }, { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["g/4"], duration: "q", midiValue: 67 }, { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["g/4"], duration: "q", midiValue: 67 } ],
        notesBass: [ { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["d/3"], duration: "q", midiValue: 50 }, { keys: ["e/3"], duration: "q", midiValue: 52 }, { keys: ["f/3"], duration: "q", midiValue: 53 }, { keys: ["g/3"], duration: "q", midiValue: 55 }, { keys: ["a/3"], duration: "q", midiValue: 57 }, { keys: ["b/3"], duration: "q", midiValue: 59 }, { keys: ["c/4"], duration: "q", midiValue: 60 } ]
    },
    {
        id: "indep-16-ostinatoLH-arpeggioRH-Cmaj", name: "Ostinato 3: LH C-G / RH Arpeggio Do Magg",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ /* C-E-G-C5-G-E-C */ { keys: ["c/4"], duration: "8", midiValue: 60 }, { keys: ["e/4"], duration: "8", midiValue: 64 }, { keys: ["g/4"], duration: "8", midiValue: 67 }, { keys: ["c/5"], duration: "8", midiValue: 72 }, { keys: ["g/4"], duration: "8", midiValue: 67 }, { keys: ["e/4"], duration: "8", midiValue: 64 }, { keys: ["c/4"], duration: "q", midiValue: 60 } ],
        notesBass: [ /* C-G Semiminime */ { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["g/3"], duration: "q", midiValue: 55 }, { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["g/3"], duration: "q", midiValue: 55 } ]
    },
    {
        id: "indep-17-ostinatoRH-arpeggioLH-Amin", name: "Ostinato 4: RH A-E / LH Arpeggio La Min",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "Am", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ /* A-E Semiminime */ { keys: ["a/4"], duration: "q", midiValue: 69 }, { keys: ["e/5"], duration: "q", midiValue: 76 }, { keys: ["a/4"], duration: "q", midiValue: 69 }, { keys: ["e/5"], duration: "q", midiValue: 76 } ],
        notesBass: [ /* Am Arp: A-C-E-A4-E-C-A */ { keys: ["a/2"], duration: "8", midiValue: 45 }, { keys: ["c/3"], duration: "8", midiValue: 48 }, { keys: ["e/3"], duration: "8", midiValue: 52 }, { keys: ["a/3"], duration: "8", midiValue: 57 }, { keys: ["e/3"], duration: "8", midiValue: 52 }, { keys: ["c/3"], duration: "8", midiValue: 48 }, { keys: ["a/2"], duration: "q", midiValue: 45 } ]
    },

     // --- Sezione 5: Sincopi e Ritmi Incrociati Semplici ---
    {
        id: "indep-18-sync-RHoffbeat", name: "Sincopi 1: RH Offbeat / LH Onbeat (Do)",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ { keys: ["r/4"], duration: "8", midiValue: null }, { keys: ["c/4"], duration: "8", midiValue: 60 }, { keys: ["r/4"], duration: "8", midiValue: null }, { keys: ["d/4"], duration: "8", midiValue: 62 }, { keys: ["r/4"], duration: "8", midiValue: null }, { keys: ["e/4"], duration: "8", midiValue: 64 }, { keys: ["r/4"], duration: "8", midiValue: null }, { keys: ["f/4"], duration: "8", midiValue: 65 } ],
        notesBass: [ { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["d/3"], duration: "q", midiValue: 50 }, { keys: ["e/3"], duration: "q", midiValue: 52 }, { keys: ["f/3"], duration: "q", midiValue: 53 } ]
    },
    {
        id: "indep-19-sync-LHoffbeat", name: "Sincopi 2: LH Offbeat / RH Onbeat (Do)",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["d/4"], duration: "q", midiValue: 62 }, { keys: ["e/4"], duration: "q", midiValue: 64 }, { keys: ["f/4"], duration: "q", midiValue: 65 } ],
        notesBass: [ { keys: ["r/4"], duration: "8", midiValue: null }, { keys: ["c/3"], duration: "8", midiValue: 48 }, { keys: ["r/4"], duration: "8", midiValue: null }, { keys: ["d/3"], duration: "8", midiValue: 50 }, { keys: ["r/4"], duration: "8", midiValue: null }, { keys: ["e/3"], duration: "8", midiValue: 52 }, { keys: ["r/4"], duration: "8", midiValue: null }, { keys: ["f/3"], duration: "8", midiValue: 53 } ]
    },
    {
        id: "indep-20-sync-3over2-RH", name: "Ritmo Incrociato 1: RH 3 Crome / LH 2 Semiminime",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "3/4", repetitions: 10, // Tempo 3/4 per facilitare
        notesTreble: [ // Gruppi di 3 crome
            { keys: ["c/4"], duration: "8", midiValue: 60 }, { keys: ["d/4"], duration: "8", midiValue: 62 }, { keys: ["e/4"], duration: "8", midiValue: 64 },
            { keys: ["f/4"], duration: "8", midiValue: 65 }, { keys: ["g/4"], duration: "8", midiValue: 67 }, { keys: ["a/4"], duration: "8", midiValue: 69 } // Fine misura
        ],
        notesBass: [ // Due semiminime per misura
             { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["g/3"], duration: "q", midiValue: 55 },
             { keys: ["c/3"], duration: "q", midiValue: 48 } // Ultima nota
        ]
    },
    {
        id: "indep-21-sync-3over2-LH", name: "Ritmo Incrociato 2: LH 3 Crome / RH 2 Semiminime",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "3/4", repetitions: 10,
        notesTreble: [ // Due semiminime per misura
             { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["g/4"], duration: "q", midiValue: 67 },
             { keys: ["c/4"], duration: "q", midiValue: 60 } // Ultima nota
        ],
        notesBass: [ // Gruppi di 3 crome
             { keys: ["c/3"], duration: "8", midiValue: 48 }, { keys: ["d/3"], duration: "8", midiValue: 50 }, { keys: ["e/3"], duration: "8", midiValue: 52 },
             { keys: ["f/3"], duration: "8", midiValue: 53 }, { keys: ["g/3"], duration: "8", midiValue: 55 }, { keys: ["a/3"], duration: "8", midiValue: 57 }
        ]
    },

    // --- Sezione 6: Variazioni Aggiuntive ---
    {
        id: "indep-22-alternate-hands-Cmaj", name: "Alternanza Mani: Scala Do Magg (1 nota per mano)",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ // Note dispari della scala
            { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["e/4"], duration: "q", midiValue: 64 },
            { keys: ["g/4"], duration: "q", midiValue: 67 }, { keys: ["b/4"], duration: "q", midiValue: 71 },
            { keys: ["c/5"], duration: "w", midiValue: 72 } // Fine
        ],
        notesBass: [ // Note pari della scala (ritmicamente alternate)
            { keys: ["r/4"], duration: "q", midiValue: null }, // Pausa iniziale
            { keys: ["d/3"], duration: "q", midiValue: 50 }, { keys: ["f/3"], duration: "q", midiValue: 53 },
            { keys: ["a/3"], duration: "q", midiValue: 57 }, { keys: ["r/4"], duration: "w", midiValue: null } // Pausa finale
        ]
    },
    {
        id: "indep-23-LHchord-RHmelody-Cmaj", name: "Accompagnamento 1: LH Accordo C / RH Melodia Semplice",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ // Melodia semplice G4-A4-G4-F4-E4...
            { keys: ["g/4"], duration: "q", midiValue: 67 }, { keys: ["a/4"], duration: "q", midiValue: 69 },
            { keys: ["g/4"], duration: "q", midiValue: 67 }, { keys: ["f/4"], duration: "q", midiValue: 65 },
            { keys: ["e/4"], duration: "q", midiValue: 64 }, { keys: ["d/4"], duration: "q", midiValue: 62 },
            { keys: ["c/4"], duration: "h", midiValue: 60 }
        ],
        notesBass: [ // Accordo C tenuto
             { keys: ["c/3", "e/3", "g/3"], duration: "w", midiValues: [48, 52, 55] },
             { keys: ["c/3", "e/3", "g/3"], duration: "w", midiValues: [48, 52, 55] }
        ]
    },
    {
        id: "indep-24-RHchord-LHmelody-Cmaj", name: "Accompagnamento 2: RH Accordo C / LH Melodia Semplice",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ // Accordo C tenuto
            { keys: ["c/4", "e/4", "g/4"], duration: "w", midiValues: [60, 64, 67] },
            { keys: ["c/4", "e/4", "g/4"], duration: "w", midiValues: [60, 64, 67] }
        ],
         notesBass: [ // Melodia semplice G3-A3-G3-F3-E3...
            { keys: ["g/3"], duration: "q", midiValue: 55 }, { keys: ["a/3"], duration: "q", midiValue: 57 },
            { keys: ["g/3"], duration: "q", midiValue: 55 }, { keys: ["f/3"], duration: "q", midiValue: 53 },
            { keys: ["e/3"], duration: "q", midiValue: 52 }, { keys: ["d/3"], duration: "q", midiValue: 50 },
            { keys: ["c/3"], duration: "h", midiValue: 48 }
        ]
    },
    {
        id: "indep-25-polyrhythm-4vs3-RH", name: "Poliritmo Base 1: RH 4 Crome / LH 3 Semiminime",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "6/8", repetitions: 10, // Tempo composto
        notesTreble: [ // 4 note per misura (semiminima puntata + croma)
             { keys: ["c/4"], duration: "qd", midiValue: 60 }, { keys: ["d/4"], duration: "8", midiValue: 62 },
             { keys: ["e/4"], duration: "qd", midiValue: 64 }, { keys: ["f/4"], duration: "8", midiValue: 65 } // Seconda misura
        ],
        notesBass: [ // 3 note per misura (semiminime)
             { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["e/3"], duration: "q", midiValue: 52 }, { keys: ["g/3"], duration: "q", midiValue: 55 },
             { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["e/3"], duration: "q", midiValue: 52 }, { keys: ["g/3"], duration: "q", midiValue: 55 }
        ]
    },
     {
        id: "indep-26-polyrhythm-3vs4-RH", name: "Poliritmo Base 2: RH 3 Semiminime / LH 4 Crome",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "6/8", repetitions: 10,
        notesTreble: [ // 3 note per misura
             { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["e/4"], duration: "q", midiValue: 64 }, { keys: ["g/4"], duration: "q", midiValue: 67 },
             { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["e/4"], duration: "q", midiValue: 64 }, { keys: ["g/4"], duration: "q", midiValue: 67 }
        ],
        notesBass: [ // 4 note per misura
             { keys: ["c/3"], duration: "qd", midiValue: 48 }, { keys: ["d/3"], duration: "8", midiValue: 50 },
             { keys: ["e/3"], duration: "qd", midiValue: 52 }, { keys: ["f/3"], duration: "8", midiValue: 53 }
        ]
    },
    {
        id: "indep-27-contrary-thirds-Cmaj", name: "Moto Contrario 5: Terze Parallele Contr.",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ // RH Terze ascendenti
            { keys: ["c/4", "e/4"], duration: "q", midiValues: [60, 64] }, { keys: ["d/4", "f/4"], duration: "q", midiValues: [62, 65] },
            { keys: ["e/4", "g/4"], duration: "q", midiValues: [64, 67] }, { keys: ["f/4", "a/4"], duration: "q", midiValues: [65, 69] },
        ],
        notesBass: [ // LH Terze discendenti
             { keys: ["c/4", "a/3"], duration: "q", midiValues: [60, 57] }, { keys: ["b/3", "g/3"], duration: "q", midiValues: [59, 55] },
            { keys: ["a/3", "f/3"], duration: "q", midiValues: [57, 53] }, { keys: ["g/3", "e/3"], duration: "q", midiValues: [55, 52] },
        ]
    },
     {
        id: "indep-28-legatoRH-staccatoLH", name: "Tocco 1: RH Legato / LH Staccato (Do Magg)",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        // Nota: Staccato è un'articolazione, non modificabile facilmente qui, ma l'esercizio lo implica.
        notesTreble: [ // RH Scala Legata
            { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["d/4"], duration: "q", midiValue: 62 },
            { keys: ["e/4"], duration: "q", midiValue: 64 }, { keys: ["f/4"], duration: "q", midiValue: 65 },
             { keys: ["g/4"], duration: "w", midiValue: 67 }
        ],
        notesBass: [ // LH Scala Staccato (scritto uguale, ma da suonare staccato)
            { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["d/3"], duration: "q", midiValue: 50 },
            { keys: ["e/3"], duration: "q", midiValue: 52 }, { keys: ["f/3"], duration: "q", midiValue: 53 },
            { keys: ["g/3"], duration: "w", midiValue: 55 }
        ]
    },
     {
        id: "indep-29-staccatoRH-legatoLH", name: "Tocco 2: RH Staccato / LH Legato (Do Magg)",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ // RH Scala Staccato
            { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["d/4"], duration: "q", midiValue: 62 },
            { keys: ["e/4"], duration: "q", midiValue: 64 }, { keys: ["f/4"], duration: "q", midiValue: 65 },
             { keys: ["g/4"], duration: "w", midiValue: 67 }
        ],
        notesBass: [ // LH Scala Legata
            { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["d/3"], duration: "q", midiValue: 50 },
            { keys: ["e/3"], duration: "q", midiValue: 52 }, { keys: ["f/3"], duration: "q", midiValue: 53 },
            { keys: ["g/3"], duration: "w", midiValue: 55 }
        ]
    },
    {
        id: "indep-30-crosshands-RHmelody", name: "Incrocio Semplice 1: RH Melodia / LH Nota Tenuta Lontana",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ // RH Melodia C4-G4
             { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["e/4"], duration: "q", midiValue: 64 },
             { keys: ["g/4"], duration: "q", midiValue: 67 }, { keys: ["f/4"], duration: "q", midiValue: 65 }
        ],
        notesBass: [ // LH tiene G2
            { keys: ["g/2"], duration: "w", midiValue: 43 }
        ]
    },
     {
        id: "indep-31-crosshands-LHmelody", name: "Incrocio Semplice 2: LH Melodia / RH Nota Tenuta Lontana",
        category: "indipendenza_mani", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 10,
        notesTreble: [ // RH tiene C5
             { keys: ["c/5"], duration: "w", midiValue: 72 }
        ],
        notesBass: [ // LH Melodia C3-G3
             { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["e/3"], duration: "q", midiValue: 52 },
             { keys: ["g/3"], duration: "q", midiValue: 55 }, { keys: ["f/3"], duration: "q", midiValue: 53 }
        ]
    },


]; // Fine array independenceExercises

// Rendi l'array accessibile globalmente
window.exerciseData = window.exerciseData || {};
window.exerciseData.indipendenza_mani = independenceExercises;

console.log("Dati Esercizi Indipendenza Mani (Ampliati) Caricati.");