/**
 * js/exercises/licks_jazz.js
 * Brevi frasi e lick comuni nel linguaggio jazz.
 */

const licksJazzExercises = [
    {
        id: "lick-jazz-ii-V-I-Cmaj-1", name: "Lick ii-V-I (C Maj) - Base", category: "licks_jazz",
        staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 4,
        notesTreble: [ // Su Dm7 | G7 | Cmaj7
            // Dm7
            { keys: ["f/4"], duration: "8", midiValue: 65 }, { keys: ["e/4"], duration: "8", midiValue: 64 },
            { keys: ["d/4"], duration: "8", midiValue: 62 }, { keys: ["c/5"], duration: "8", midiValue: 72 }, // Su Dm7
            // G7
            { keys: ["b/4"], duration: "8", midiValue: 71 }, { keys: ["a/4"], duration: "8", midiValue: 69 },
            { keys: ["g/4"], duration: "8", midiValue: 67 }, { keys: ["f/4"], duration: "8", midiValue: 65 }, // Su G7
            // Cmaj7
            { keys: ["e/4"], duration: "h", midiValue: 64 }, { keys: ["c/4"], duration: "h", midiValue: 60 } // Risoluzione
        ],
        notesBass: [ // Accompagnamento semplice
            { keys: ["d/3","a/3"], duration: "h", midiValues: [50, 57] }, // Dm
            { keys: ["g/2","b/2"], duration: "h", midiValues: [43, 47] }, // G (o G7 shell)
            { keys: ["c/3","g/3"], duration: "w", midiValues: [48, 55] }  // C
        ]
    },
    {
        id: "lick-jazz-ii-V-I-Cmaj-2", name: "Lick ii-V-I (C Maj) - Arp + Cromatismo", category: "licks_jazz",
        staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 4,
        notesTreble: [
            // Dm7 Arp
            { keys: ["d/4"], duration: "8", midiValue: 62 }, { keys: ["f/4"], duration: "8", midiValue: 65 },
            { keys: ["a/4"], duration: "8", midiValue: 69 }, { keys: ["c/5"], duration: "8", midiValue: 72 },
            // G7 Cromatismo verso 3a di C
            { keys: ["b/4"], duration: "8", midiValue: 71 }, { keys: ["bb/4"], duration: "8", midiValue: 70 }, // Nota di G7
            { keys: ["a/4"], duration: "8", midiValue: 69 }, { keys: ["ab/4"], duration: "8", midiValue: 68 }, // Appr cromatico a G
            // Cmaj7
            { keys: ["g/4"], duration: "q", midiValue: 67 }, { keys: ["e/4"], duration: "h", midiValue: 64 }
        ],
        notesBass: [
             { keys: ["d/3"], duration: "h", midiValue: 50 },
             { keys: ["g/2"], duration: "h", midiValue: 43 },
             { keys: ["c/3"], duration: "w", midiValue: 48 }
        ]
    },
     {
        id: "lick-jazz-minor-ii-V-i-Am", name: "Lick Minore ii-V-i (Am)", category: "licks_jazz",
        staveLayout: "grand", keySignature: "Am", timeSignature: "4/4", repetitions: 4,
        notesTreble: [ // Su Bm7b5 | E7 | Am7
            // Bm7b5
            { keys: ["a/4"], duration: "8", midiValue: 69 }, { keys: ["f/4"], duration: "8", midiValue: 65 }, // Da Bm7b5
            { keys: ["d/4"], duration: "8", midiValue: 62 }, { keys: ["b/3"], duration: "8", midiValue: 59 }, // Vis B3
            // E7
            { keys: ["c/4"], duration: "8", midiValue: 60 }, // Appr cromatico a B
            { keys: ["b/3"], duration: "8", midiValue: 59 }, // Vis B3
            { keys: ["g#/3"], duration: "8", midiValue: 56 }, { keys: ["e/3"], duration: "8", midiValue: 52 }, // Da E7
            // Am7
            { keys: ["f/3"], duration: "8", midiValue: 53 }, { keys: ["a/3"], duration: "8", midiValue: 57 }, // Approccio
            { keys: ["c/4"], duration: "h", midiValue: 60 } // Risoluzione su C (terza di Am)
        ],
        notesBass: [
             { keys: ["b/2"], duration: "h", midiValue: 47 },
             { keys: ["e/3"], duration: "h", midiValue: 52 },
             { keys: ["a/2"], duration: "w", midiValue: 45 }
        ]
    },
    {
        id: "lick-jazz-turnaround-Cmaj", name: "Lick Turnaround I-vi-ii-V (C Maj)", category: "licks_jazz",
        staveLayout: "grand", keySignature: "C", timeSignature: "4/4", repetitions: 4,
        notesTreble: [ // 2 battiti per accordo
            { keys: ["e/4"], duration: "8", midiValue: 64 }, { keys: ["g/4"], duration: "8", midiValue: 67 }, { keys: ["a/4"], duration: "8", midiValue: 69 }, { keys: ["g/4"], duration: "8", midiValue: 67 }, // Su Cmaj7
            { keys: ["f/4"], duration: "8", midiValue: 65 }, { keys: ["a/4"], duration: "8", midiValue: 69 }, { keys: ["g/4"], duration: "8", midiValue: 67 }, { keys: ["e/4"], duration: "8", midiValue: 64 }, // Su Am7
            { keys: ["d/4"], duration: "8", midiValue: 62 }, { keys: ["f/4"], duration: "8", midiValue: 65 }, { keys: ["a/4"], duration: "8", midiValue: 69 }, { keys: ["c/5"], duration: "8", midiValue: 72 }, // Su Dm7
            { keys: ["b/4"], duration: "q", midiValue: 71 }, { keys: ["g/4"], duration: "q", midiValue: 67 } // Su G7
        ],
        notesBass: [
            { keys: ["c/3"], duration: "h", midiValue: 48 }, { keys: ["a/2"], duration: "h", midiValue: 45 },
            { keys: ["d/3"], duration: "h", midiValue: 50 }, { keys: ["g/2"], duration: "h", midiValue: 43 }
        ]
    },
    // Aggiungi altri 5-10 lick jazz (es. basati su scale alterate, pattern bebop, ecc.)

];
window.exerciseData = window.exerciseData || {};
window.exerciseData.licks_jazz = licksJazzExercises;
console.log("Dati Esercizi Licks Jazz Caricati.");