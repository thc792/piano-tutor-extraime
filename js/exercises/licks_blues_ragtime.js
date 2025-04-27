/**
 * js/exercises/licks_blues_ragtime.js
 * Brevi frasi e lick comuni nel linguaggio Blues e Ragtime.
 */

const licksBluesRagtimeExercises = [

    // === Licks Blues ===
    {
        id: "lick-blues-minor-pent-Am", name: "Lick Blues Pentatonica Minore (Am)", category: "licks_blues_ragtime",
        staveLayout: "single", clef: "treble", keySignature: "Am", timeSignature: "4/4", repetitions: 4,
        notes: [ // Pattern discendente comune
            { keys: ["a/5"], duration: "8", midiValue: 81 }, { keys: ["g/5"], duration: "8", midiValue: 79 },
            { keys: ["e/5"], duration: "q", midiValue: 76 },
            { keys: ["d/5"], duration: "8", midiValue: 74 }, { keys: ["c/5"], duration: "8", midiValue: 72 },
            { keys: ["a/4"], duration: "h", midiValue: 69 }
        ]
    },
     {
        id: "lick-blues-blue-note-C", name: "Lick Blues con Blue Note (C)", category: "licks_blues_ragtime",
        staveLayout: "single", clef: "treble", keySignature: "F", timeSignature: "4/4", repetitions: 4, // Key F per Eb e Bb
        notes: [ // Include Eb (blue note)
            { keys: ["c/4"], duration: "q", midiValue: 60 }, { keys: ["eb/4"], duration: "q", midiValue: 63 },
            { keys: ["f/4"], duration: "8", midiValue: 65 }, { keys: ["f#/4"], duration: "8", midiValue: 66 }, // Cromatismo
            { keys: ["g/4"], duration: "h", midiValue: 67 }
        ]
    },
    {
        id: "lick-blues-turnaround-G", name: "Lick Turnaround Blues (G)", category: "licks_blues_ragtime",
        staveLayout: "single", clef: "treble", keySignature: "C", timeSignature: "4/4", repetitions: 4,
        notes: [ // Su G7 | C7 | G7 | D7 (tipico turnaround)
            { keys: ["d/5"], duration: "8", midiValue: 74 }, { keys: ["f/5"], duration: "8", midiValue: 77 }, // G7
            { keys: ["d/5"], duration: "8", midiValue: 74 }, { keys: ["b/4"], duration: "8", midiValue: 71 },
            { keys: ["c/5"], duration: "8", midiValue: 72 }, { keys: ["e/5"], duration: "8", midiValue: 76 }, // C7
            { keys: ["c/5"], duration: "8", midiValue: 72 }, { keys: ["g/4"], duration: "8", midiValue: 67 },
            { keys: ["b/4"], duration: "8", midiValue: 71 }, { keys: ["g/4"], duration: "8", midiValue: 67 }, // G7
            { keys: ["f#/4"], duration: "8", midiValue: 66 }, { keys: ["d/4"], duration: "8", midiValue: 62 }, // D7
            { keys: ["c/4"], duration: "q", midiValue: 60 } // Risoluzione (implicita su G)
        ]
    },
     {
        id: "lick-blues-call-response", name: "Lick Blues Call & Response (Am)", category: "licks_blues_ragtime",
        staveLayout: "single", clef: "treble", keySignature: "Am", timeSignature: "4/4", repetitions: 4,
        notes: [ // Call (batt 1-2) / Response (batt 3-4)
            { keys: ["a/4"], duration: "8", midiValue: 69 }, { keys: ["c/5"], duration: "8", midiValue: 72 }, { keys: ["d/5"], duration: "q", midiValue: 74 }, { keys: ["r/4"], duration: "h"}, // Call + Pausa
            { keys: ["e/5"], duration: "8", midiValue: 76 }, { keys: ["c/5"], duration: "8", midiValue: 72 }, { keys: ["a/4"], duration: "h", midiValue: 69 } // Response
        ]
    },

    // === Pattern Ragtime Semplificati ===
    {
        id: "lick-ragtime-stride-LH", name: "Pattern Ragtime Stride Base (LH)", category: "licks_blues_ragtime",
        staveLayout: "single", clef: "bass", keySignature: "C", timeSignature: "2/4", repetitions: 5, // Tempo 2/4 comune
        notes: [ // Basso-Accordo alternato su C
            { keys: ["c/2"], duration: "8", midiValue: 36 }, // Basso
            { keys: ["c/3", "e/3", "g/3"], duration: "8", midiValues: [48, 52, 55] }, // Accordo
            { keys: ["c/2"], duration: "8", midiValue: 36 },
            { keys: ["c/3", "e/3", "g/3"], duration: "8", midiValues: [48, 52, 55] },
        ]
    },
    {
        id: "lick-ragtime-stride-LH-G7", name: "Pattern Ragtime Stride Base (LH su G7)", category: "licks_blues_ragtime",
        staveLayout: "single", clef: "bass", keySignature: "C", timeSignature: "2/4", repetitions: 5,
        notes: [ // Basso-Accordo alternato su G7
            { keys: ["g/2"], duration: "8", midiValue: 43 },
            { keys: ["b/2", "d/3", "f/3"], duration: "8", midiValues: [47, 50, 53] }, // Accordo G7
            { keys: ["g/2"], duration: "8", midiValue: 43 },
            { keys: ["b/2", "d/3", "f/3"], duration: "8", midiValues: [47, 50, 53] },
        ]
    },
     {
        id: "lick-ragtime-sync-RH", name: "Pattern Ragtime Melodia Sincopata (RH)", category: "licks_blues_ragtime",
        staveLayout: "single", clef: "treble", keySignature: "C", timeSignature: "2/4", repetitions: 5,
        notes: [ // Ritmo tipico: 8-q-8
            { keys: ["e/4"], duration: "8", midiValue: 64 }, { keys: ["f/4"], duration: "q", midiValue: 65 },
            { keys: ["g/4"], duration: "8", midiValue: 67 },
        ]
    },
    {
        id: "lick-ragtime-octave-RH", name: "Pattern Ragtime Melodia in Ottave (RH)", category: "licks_blues_ragtime",
        staveLayout: "single", clef: "treble", keySignature: "C", timeSignature: "4/4", repetitions: 5,
        notes: [ // Melodia semplice raddoppiata all'ottava
             { keys: ["c/4", "c/5"], duration: "q", midiValues: [60, 72] },
             { keys: ["d/4", "d/5"], duration: "q", midiValues: [62, 74] },
             { keys: ["e/4", "e/5"], duration: "h", midiValues: [64, 76] },
        ]
    },
     // Aggiungi altri 5-10 lick Blues (bending simulato, slide, ecc.) e Ragtime (più sincopi, accordi diminuiti)

];
window.exerciseData = window.exerciseData || {};
window.exerciseData.voicing_jazz_blues = voicingJazzBluesExercises; // Assicurati che la chiave sia coerente
window.exerciseData.licks_jazz = licksJazzExercises;
window.exerciseData.licks_blues_ragtime = licksBluesRagtimeExercises;
console.log("Dati Esercizi Licks Blues/Ragtime Caricati.");