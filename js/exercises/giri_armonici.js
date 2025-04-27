/**
 * js/exercises/giri_armonici.js
 * Contiene dati per esercizi su giri armonici comuni e importanti.
 *
 * STRUTTURA DATI:
 * - `keys`: Stringhe VexFlow per la VISUALIZZAZIONE corretta sulla chiave specificata.
 *           Per Basso, usare ottave /3, /4 ecc. per posizionamento standard bass clef.
 * - `midiValue` (numero): Per note singole (es. nel basso).
 * - `midiValues` (array): Per accordi (contiene i MIDI di tutte le note dell'accordo).
 */

const giriArmoniciExercises = [

    // ===========================================
    // === GIRI POP / ROCK / CLASSICI COMUNI ===
    // ===========================================
    {
        id: "c-pop-I-V-vi-IV-triads",
        name: "Pop I-V-vi-IV (Do Magg - Triadi)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "C", timeSignature: "4/4",
        notesTreble: [ /* I-V-vi-IV */ { keys: ["c/4", "e/4", "g/4"], duration: "h", midiValues: [60, 64, 67] }, { keys: ["g/4", "b/4", "d/5"], duration: "h", midiValues: [67, 71, 74] }, { keys: ["a/4", "c/5", "e/5"], duration: "h", midiValues: [69, 72, 76] }, { keys: ["f/4", "a/4", "c/5"], duration: "h", midiValues: [65, 69, 72] } ],
        notesBass: [ /* Radici */ { keys: ["c/3"], duration: "h", midiValue: 48 }, { keys: ["g/3"], duration: "h", midiValue: 55 }, { keys: ["a/3"], duration: "h", midiValue: 57 }, { keys: ["f/3"], duration: "h", midiValue: 53 } ]
    },
    {
        id: "g-pop-I-V-vi-IV-triads",
        name: "Pop I-V-vi-IV (Sol Magg - Triadi)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "G", timeSignature: "4/4",
        notesTreble: [ /* I-V-vi-IV */ { keys: ["g/4", "b/4", "d/5"], duration: "h", midiValues: [67, 71, 74] }, { keys: ["d/4", "f#/4", "a/4"], duration: "h", midiValues: [62, 66, 69] }, { keys: ["e/4", "g/4", "b/4"], duration: "h", midiValues: [64, 67, 71] }, { keys: ["c/4", "e/4", "g/4"], duration: "h", midiValues: [60, 64, 67] } ],
        notesBass: [ /* Radici G-D-Em-C */ { keys: ["g/3"], duration: "h", midiValue: 55 }, { keys: ["d/3"], duration: "h", midiValue: 50 }, { keys: ["e/3"], duration: "h", midiValue: 52 }, { keys: ["c/3"], duration: "h", midiValue: 48 } ]
    },
    {
        id: "c-50s-I-vi-IV-V-triads",
        name: "Giro '50s I-vi-IV-V (Do Magg - Triadi)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "C", timeSignature: "4/4",
        notesTreble: [ /* I-vi-IV-V */ { keys: ["c/4", "e/4", "g/4"], duration: "h", midiValues: [60, 64, 67] }, { keys: ["a/4", "c/5", "e/5"], duration: "h", midiValues: [69, 72, 76] }, { keys: ["f/4", "a/4", "c/5"], duration: "h", midiValues: [65, 69, 72] }, { keys: ["g/4", "b/4", "d/5"], duration: "h", midiValues: [67, 71, 74] } ],
        notesBass: [ /* Radici C-Am-F-G */ { keys: ["c/3"], duration: "h", midiValue: 48 }, { keys: ["a/3"], duration: "h", midiValue: 57 }, { keys: ["f/3"], duration: "h", midiValue: 53 }, { keys: ["g/3"], duration: "h", midiValue: 55 } ]
    },
     {
        id: "am-minor-i-VI-III-VII",
        name: "Giro Minore i-VI-III-VII (La Min)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "Am", timeSignature: "4/4",
        notesTreble: [ /* Am-F-C-G */ { keys: ["a/4", "c/5", "e/5"], duration: "h", midiValues: [69, 72, 76] }, { keys: ["f/4", "a/4", "c/5"], duration: "h", midiValues: [65, 69, 72] }, { keys: ["c/4", "e/4", "g/4"], duration: "h", midiValues: [60, 64, 67] }, { keys: ["g/4", "b/4", "d/5"], duration: "h", midiValues: [67, 71, 74] } ],
        notesBass: [ /* Radici Am-F-C-G */ { keys: ["a/3"], duration: "h", midiValue: 57 }, { keys: ["f/3"], duration: "h", midiValue: 53 }, { keys: ["c/3"], duration: "h", midiValue: 48 }, { keys: ["g/3"], duration: "h", midiValue: 55 } ]
    },
     {
        id: "c-perfect-cadence-V-I",
        name: "Cadenza Perfetta V-I (Do Magg - Triadi)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "C", timeSignature: "4/4",
        notesTreble: [ { keys: ["g/4", "b/4", "d/5"], duration: "h", midiValues: [67, 71, 74] }, { keys: ["c/4", "e/4", "g/4"], duration: "h", midiValues: [60, 64, 67] } ],
        notesBass: [ { keys: ["g/3"], duration: "h", midiValue: 55 }, { keys: ["c/3"], duration: "h", midiValue: 48 } ]
    },
    {
        id: "c-plagal-cadence-IV-I",
        name: "Cadenza Plagale IV-I (Do Magg - Triadi)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "C", timeSignature: "4/4",
        notesTreble: [ { keys: ["f/4", "a/4", "c/5"], duration: "h", midiValues: [65, 69, 72] }, { keys: ["c/4", "e/4", "g/4"], duration: "h", midiValues: [60, 64, 67] } ],
        notesBass: [ { keys: ["f/3"], duration: "h", midiValue: 53 }, { keys: ["c/3"], duration: "h", midiValue: 48 } ]
    },
     {
        id: "c-deceptive-cadence-V-vi",
        name: "Cadenza D'inganno V-vi (Do Magg - Triadi)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "C", timeSignature: "4/4",
        notesTreble: [ { keys: ["g/4", "b/4", "d/5"], duration: "h", midiValues: [67, 71, 74] }, { keys: ["a/4", "c/5", "e/5"], duration: "h", midiValues: [69, 72, 76] } ],
        notesBass: [ { keys: ["g/3"], duration: "h", midiValue: 55 }, { keys: ["a/3"], duration: "h", midiValue: 57 } ]
    },
    {
        id: "c-circle-of-fifths-desc",
        name: "Circolo Quinte Discendente (Do Magg - Triadi)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "C", timeSignature: "4/4",
        notesTreble: [ // C-F-Bb-Eb... ma semplificato in C: C-F-Dm-G-C
            { keys: ["c/4", "e/4", "g/4"], duration: "q", midiValues: [60, 64, 67] }, // C
            { keys: ["f/4", "a/4", "c/5"], duration: "q", midiValues: [65, 69, 72] }, // F
            { keys: ["d/4", "f/4", "a/4"], duration: "q", midiValues: [62, 65, 69] }, // Dm
            { keys: ["g/4", "b/4", "d/5"], duration: "q", midiValues: [67, 71, 74] }, // G
            { keys: ["c/4", "e/4", "g/4"], duration: "w", midiValues: [60, 64, 67] }  // C
        ],
        notesBass: [
            { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["f/2"], duration: "q", midiValue: 41 },
            { keys: ["d/3"], duration: "q", midiValue: 50 }, { keys: ["g/2"], duration: "q", midiValue: 43 },
            { keys: ["c/3"], duration: "w", midiValue: 48 }
        ]
    },
     {
        id: "am-andalusian-i-VII-VI-V",
        name: "Cadenza Andalusa (La Min - Triadi)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "Am", timeSignature: "4/4",
        notesTreble: [ /* Am-G-F-E */ { keys: ["a/4", "c/5", "e/5"], duration: "h", midiValues: [69, 72, 76] }, { keys: ["g/4", "b/4", "d/5"], duration: "h", midiValues: [67, 71, 74] }, { keys: ["f/4", "a/4", "c/5"], duration: "h", midiValues: [65, 69, 72] }, { keys: ["e/4", "g#/4", "b/4"], duration: "h", midiValues: [64, 68, 71] } ],
        notesBass: [ { keys: ["a/3"], duration: "h", midiValue: 57 }, { keys: ["g/3"], duration: "h", midiValue: 55 }, { keys: ["f/3"], duration: "h", midiValue: 53 }, { keys: ["e/3"], duration: "h", midiValue: 52 } ]
    },
     {
        id: "c-pachelbel-pattern",
        name: "Canone di Pachelbel (Pattern Base - Do Magg)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "C", timeSignature: "4/4",
        notesTreble: [ /* I-V-vi-iii-IV-I-IV-V */ { keys: ["c/4", "e/4", "g/4"], duration: "q", midiValues: [60, 64, 67] }, { keys: ["g/4", "b/4", "d/5"], duration: "q", midiValues: [67, 71, 74] }, { keys: ["a/4", "c/5", "e/5"], duration: "q", midiValues: [69, 72, 76] }, { keys: ["e/4", "g/4", "b/4"], duration: "q", midiValues: [64, 67, 71] }, { keys: ["f/4", "a/4", "c/5"], duration: "q", midiValues: [65, 69, 72] }, { keys: ["c/4", "e/4", "g/4"], duration: "q", midiValues: [60, 64, 67] }, { keys: ["f/4", "a/4", "c/5"], duration: "q", midiValues: [65, 69, 72] }, { keys: ["g/4", "b/4", "d/5"], duration: "q", midiValues: [67, 71, 74] } ],
        notesBass: [ /* Bassline */ { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["g/2"], duration: "q", midiValue: 43 }, { keys: ["a/2"], duration: "q", midiValue: 45 }, { keys: ["e/3"], duration: "q", midiValue: 52 }, { keys: ["f/2"], duration: "q", midiValue: 41 }, { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["f/2"], duration: "q", midiValue: 41 }, { keys: ["g/2"], duration: "q", midiValue: 43 } ]
    },

    // ===========================================
    // === GIRI JAZZ STANDARD                  ===
    // ===========================================
    {
        id: "c-jazz-ii-V-I-7th",
        name: "Jazz ii-V-I (Do Magg - Settima)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "C", timeSignature: "4/4",
        notesTreble: [ /* Dm7-G7-Cmaj7 */ { keys: ["d/4", "f/4", "a/4", "c/5"], duration: "h", midiValues: [62, 65, 69, 72] }, { keys: ["g/4", "b/4", "d/5", "f/5"], duration: "h", midiValues: [67, 71, 74, 77] }, { keys: ["c/4", "e/4", "g/4", "b/4"], duration: "w", midiValues: [60, 64, 67, 71] } ],
        notesBass: [ { keys: ["d/3"], duration: "h", midiValue: 50 }, { keys: ["g/3"], duration: "h", midiValue: 55 }, { keys: ["c/3"], duration: "w", midiValue: 48 } ]
    },
    {
        id: "g-jazz-ii-V-I-7th",
        name: "Jazz ii-V-I (Sol Magg - Settima)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "G", timeSignature: "4/4",
        notesTreble: [ /* Am7-D7-Gmaj7 */ { keys: ["a/4", "c/5", "e/5", "g/5"], duration: "h", midiValues: [69, 72, 76, 79] }, { keys: ["d/4", "f#/4", "a/4", "c/5"], duration: "h", midiValues: [62, 66, 69, 72] }, { keys: ["g/4", "b/4", "d/5", "f#/5"], duration: "w", midiValues: [67, 71, 74, 78] } ],
        notesBass: [ { keys: ["a/3"], duration: "h", midiValue: 57 }, { keys: ["d/3"], duration: "h", midiValue: 50 }, { keys: ["g/3"], duration: "w", midiValue: 55 } ]
    },
    {
        id: "f-jazz-ii-V-I-7th",
        name: "Jazz ii-V-I (Fa Magg - Settima)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "F", timeSignature: "4/4",
        notesTreble: [ /* Gm7-C7-Fmaj7 */ { keys: ["g/4", "bb/4", "d/5", "f/5"], duration: "h", midiValues: [67, 70, 74, 77] }, { keys: ["c/4", "e/4", "g/4", "bb/4"], duration: "h", midiValues: [60, 64, 67, 70] }, { keys: ["f/4", "a/4", "c/5", "e/5"], duration: "w", midiValues: [65, 69, 72, 76] } ],
        notesBass: [ { keys: ["g/3"], duration: "h", midiValue: 55 }, { keys: ["c/3"], duration: "h", midiValue: 48 }, { keys: ["f/3"], duration: "w", midiValue: 53 } ]
    },
     {
        id: "am-jazz-ii-V-i-m7", // Minore con m7 alla fine
        name: "Jazz ii°-V-i (La Min - m7 finale)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "Am", timeSignature: "4/4",
        notesTreble: [ /* Bm7b5-E7-Am7 */ { keys: ["b/4", "d/5", "f/5", "a/5"], duration: "h", midiValues: [71, 74, 77, 81] }, { keys: ["e/4", "g#/4", "b/4", "d/5"], duration: "h", midiValues: [64, 68, 71, 74] }, { keys: ["a/4", "c/5", "e/5", "g/5"], duration: "w", midiValues: [69, 72, 76, 79] } ],
        notesBass: [ { keys: ["b/2"], duration: "h", midiValue: 47 }, { keys: ["e/3"], duration: "h", midiValue: 52 }, { keys: ["a/2"], duration: "w", midiValue: 45 } ]
    },
    {
        id: "c-jazz-I-vi-ii-V-7th",
        name: "Jazz I-vi-ii-V (Do Magg - Settima)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "C", timeSignature: "4/4",
        notesTreble: [ /* Cmaj7-Am7-Dm7-G7 */ { keys: ["c/4", "e/4", "g/4", "b/4"], duration: "q", midiValues: [60, 64, 67, 71] }, { keys: ["a/4", "c/5", "e/5", "g/5"], duration: "q", midiValues: [69, 72, 76, 79] }, { keys: ["d/4", "f/4", "a/4", "c/5"], duration: "q", midiValues: [62, 65, 69, 72] }, { keys: ["g/4", "b/4", "d/5", "f/5"], duration: "q", midiValues: [67, 71, 74, 77] } ],
        notesBass: [ { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["a/2"], duration: "q", midiValue: 45 }, { keys: ["d/3"], duration: "q", midiValue: 50 }, { keys: ["g/2"], duration: "q", midiValue: 43 } ]
    },
    {
        id: "c-jazz-iii-vi-ii-V-7th",
        name: "Jazz iii-vi-ii-V (Do Magg - Settima)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "C", timeSignature: "4/4",
        notesTreble: [ /* Em7-Am7-Dm7-G7 */ { keys: ["e/4", "g/4", "b/4", "d/5"], duration: "q", midiValues: [64, 67, 71, 74] }, { keys: ["a/4", "c/5", "e/5", "g/5"], duration: "q", midiValues: [69, 72, 76, 79] }, { keys: ["d/4", "f/4", "a/4", "c/5"], duration: "q", midiValues: [62, 65, 69, 72] }, { keys: ["g/4", "b/4", "d/5", "f/5"], duration: "q", midiValues: [67, 71, 74, 77] } ],
        notesBass: [ { keys: ["e/3"], duration: "q", midiValue: 52 }, { keys: ["a/2"], duration: "q", midiValue: 45 }, { keys: ["d/3"], duration: "q", midiValue: 50 }, { keys: ["g/2"], duration: "q", midiValue: 43 } ]
    },
    {
        id: "c-jazz-turnaround-I-vi-ii-V",
        name: "Turnaround I-vi-ii-V (Ciclico)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "C", timeSignature: "4/4",
        notesTreble: [ // Ripetibile
            { keys: ["c/4", "e/4", "g/4", "b/4"], duration: "h", midiValues: [60, 64, 67, 71] }, // Cmaj7
            { keys: ["a/4", "c/5", "e/5", "g/5"], duration: "h", midiValues: [69, 72, 76, 79] }, // Am7
            { keys: ["d/4", "f/4", "a/4", "c/5"], duration: "h", midiValues: [62, 65, 69, 72] }, // Dm7
            { keys: ["g/4", "b/4", "d/5", "f/5"], duration: "h", midiValues: [67, 71, 74, 77] }  // G7
        ],
        notesBass: [
            { keys: ["c/3"], duration: "h", midiValue: 48 }, { keys: ["a/2"], duration: "h", midiValue: 45 },
            { keys: ["d/3"], duration: "h", midiValue: 50 }, { keys: ["g/2"], duration: "h", midiValue: 43 }
        ]
    },
     {
        id: "dm-modal-vamp",
        name: "Vamp Modale 'So What' (Re Dorico)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "C", timeSignature: "4/4",
        notesTreble: [ // Accordi quartali stile 'So What'
            { keys: ["d/4", "g/4", "c/5", "f/5", "a/5"], duration: "w", midiValues: [62, 67, 72, 77, 81] }, // Dm11 voicing
            { keys: ["d/4", "g/4", "c/5", "f/5", "a/5"], duration: "w", midiValues: [62, 67, 72, 77, 81] },
            { keys: ["eb/4", "ab/4", "db/5", "gb/5", "bb/5"], duration: "w", midiValues: [63, 68, 73, 78, 82] }, // Ebm11 voicing (un semitono sopra)
            { keys: ["eb/4", "ab/4", "db/5", "gb/5", "bb/5"], duration: "w", midiValues: [63, 68, 73, 78, 82] }
        ],
        notesBass: [ // Radici D e Eb
             { keys: ["d/3"], duration: "w", midiValue: 50 }, { keys: ["d/3"], duration: "w", midiValue: 50 },
             { keys: ["eb/3"], duration: "w", midiValue: 51 }, { keys: ["eb/3"], duration: "w", midiValue: 51 }
        ]
    },

    // ===========================================
    // === BLUES                               ===
    // ===========================================
    {
        id: "c-12bar-blues-7th",
        name: "12 Bar Blues (Do - Settima)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "F", timeSignature: "4/4",
        notesTreble: [ /* I7 x4 | IV7 x2 | I7 x2 | V7 | IV7 | I7 | V7 */ { keys: ["c/4", "e/4", "g/4", "bb/4"], duration: "w", midiValues: [60, 64, 67, 70] }, { keys: ["c/4", "e/4", "g/4", "bb/4"], duration: "w", midiValues: [60, 64, 67, 70] }, { keys: ["c/4", "e/4", "g/4", "bb/4"], duration: "w", midiValues: [60, 64, 67, 70] }, { keys: ["c/4", "e/4", "g/4", "bb/4"], duration: "w", midiValues: [60, 64, 67, 70] }, { keys: ["f/4", "a/4", "c/5", "eb/5"], duration: "w", midiValues: [65, 69, 72, 75] }, { keys: ["f/4", "a/4", "c/5", "eb/5"], duration: "w", midiValues: [65, 69, 72, 75] }, { keys: ["c/4", "e/4", "g/4", "bb/4"], duration: "w", midiValues: [60, 64, 67, 70] }, { keys: ["c/4", "e/4", "g/4", "bb/4"], duration: "w", midiValues: [60, 64, 67, 70] }, { keys: ["g/4", "b/4", "d/5", "f/5"], duration: "w", midiValues: [67, 71, 74, 77] }, { keys: ["f/4", "a/4", "c/5", "eb/5"], duration: "w", midiValues: [65, 69, 72, 75] }, { keys: ["c/4", "e/4", "g/4", "bb/4"], duration: "w", midiValues: [60, 64, 67, 70] }, { keys: ["g/4", "b/4", "d/5", "f/5"], duration: "w", midiValues: [67, 71, 74, 77] } ],
        notesBass: [ { keys: ["c/3"], duration: "w", midiValue: 48 }, { keys: ["c/3"], duration: "w", midiValue: 48 }, { keys: ["c/3"], duration: "w", midiValue: 48 }, { keys: ["c/3"], duration: "w", midiValue: 48 }, { keys: ["f/2"], duration: "w", midiValue: 41 }, { keys: ["f/2"], duration: "w", midiValue: 41 }, { keys: ["c/3"], duration: "w", midiValue: 48 }, { keys: ["c/3"], duration: "w", midiValue: 48 }, { keys: ["g/2"], duration: "w", midiValue: 43 }, { keys: ["f/2"], duration: "w", midiValue: 41 }, { keys: ["c/3"], duration: "w", midiValue: 48 }, { keys: ["g/2"], duration: "w", midiValue: 43 } ]
    },
     {
        id: "g-12bar-blues-quickchange",
        name: "12 Bar Blues Quick Change (Sol - Settima)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "C", timeSignature: "4/4", // Key C per F naturale
        notesTreble: [ // I7 | IV7 | I7 | I7 | IV7 | IV7 | I7 | I7 | V7 | IV7 | I7 | V7
            { keys: ["g/4", "b/4", "d/5", "f/5"], duration: "w", midiValues: [67, 71, 74, 77] }, // G7 (1)
            { keys: ["c/4", "e/4", "g/4", "bb/4"], duration: "w", midiValues: [60, 64, 67, 70] }, // C7 (2) - Quick Change
            { keys: ["g/4", "b/4", "d/5", "f/5"], duration: "w", midiValues: [67, 71, 74, 77] }, // G7 (3)
            { keys: ["g/4", "b/4", "d/5", "f/5"], duration: "w", midiValues: [67, 71, 74, 77] }, // G7 (4)
            { keys: ["c/4", "e/4", "g/4", "bb/4"], duration: "w", midiValues: [60, 64, 67, 70] }, // C7 (5)
            { keys: ["c/4", "e/4", "g/4", "bb/4"], duration: "w", midiValues: [60, 64, 67, 70] }, // C7 (6)
            { keys: ["g/4", "b/4", "d/5", "f/5"], duration: "w", midiValues: [67, 71, 74, 77] }, // G7 (7)
            { keys: ["g/4", "b/4", "d/5", "f/5"], duration: "w", midiValues: [67, 71, 74, 77] }, // G7 (8)
            { keys: ["d/4", "f#/4", "a/4", "c/5"], duration: "w", midiValues: [62, 66, 69, 72] }, // D7 (9)
            { keys: ["c/4", "e/4", "g/4", "bb/4"], duration: "w", midiValues: [60, 64, 67, 70] }, // C7 (10)
            { keys: ["g/4", "b/4", "d/5", "f/5"], duration: "w", midiValues: [67, 71, 74, 77] }, // G7 (11)
            { keys: ["d/4", "f#/4", "a/4", "c/5"], duration: "w", midiValues: [62, 66, 69, 72] }  // D7 (12 - Turnaround)
        ],
        notesBass: [ // Fondamentali
            { keys: ["g/3"], duration: "w", midiValue: 55 }, { keys: ["c/3"], duration: "w", midiValue: 48 },
            { keys: ["g/3"], duration: "w", midiValue: 55 }, { keys: ["g/3"], duration: "w", midiValue: 55 },
            { keys: ["c/3"], duration: "w", midiValue: 48 }, { keys: ["c/3"], duration: "w", midiValue: 48 },
            { keys: ["g/3"], duration: "w", midiValue: 55 }, { keys: ["g/3"], duration: "w", midiValue: 55 },
            { keys: ["d/3"], duration: "w", midiValue: 50 }, { keys: ["c/3"], duration: "w", midiValue: 48 },
            { keys: ["g/3"], duration: "w", midiValue: 55 }, { keys: ["d/3"], duration: "w", midiValue: 50 },
        ]
    },
     {
        id: "am-minor-blues-simple",
        name: "Minor Blues Semplice (La Min)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "Am", timeSignature: "4/4",
        notesTreble: [ /* i7 x4 | iv7 x2 | i7 x2 | VImaj7 | V7 | i7 | V7 */ { keys: ["a/4", "c/5", "e/5", "g/5"], duration: "w", midiValues: [69, 72, 76, 79] }, { keys: ["a/4", "c/5", "e/5", "g/5"], duration: "w", midiValues: [69, 72, 76, 79] }, { keys: ["a/4", "c/5", "e/5", "g/5"], duration: "w", midiValues: [69, 72, 76, 79] }, { keys: ["a/4", "c/5", "e/5", "g/5"], duration: "w", midiValues: [69, 72, 76, 79] }, { keys: ["d/4", "f/4", "a/4", "c/5"], duration: "w", midiValues: [62, 65, 69, 72] }, { keys: ["d/4", "f/4", "a/4", "c/5"], duration: "w", midiValues: [62, 65, 69, 72] }, { keys: ["a/4", "c/5", "e/5", "g/5"], duration: "w", midiValues: [69, 72, 76, 79] }, { keys: ["a/4", "c/5", "e/5", "g/5"], duration: "w", midiValues: [69, 72, 76, 79] }, { keys: ["f/4", "a/4", "c/5", "e/5"], duration: "w", midiValues: [65, 69, 72, 76] }, { keys: ["e/4", "g#/4", "b/4", "d/5"], duration: "w", midiValues: [64, 68, 71, 74] }, { keys: ["a/4", "c/5", "e/5", "g/5"], duration: "w", midiValues: [69, 72, 76, 79] }, { keys: ["e/4", "g#/4", "b/4", "d/5"], duration: "w", midiValues: [64, 68, 71, 74] } ],
        notesBass: [ { keys: ["a/2"], duration: "w", midiValue: 45 }, { keys: ["a/2"], duration: "w", midiValue: 45 }, { keys: ["a/2"], duration: "w", midiValue: 45 }, { keys: ["a/2"], duration: "w", midiValue: 45 }, { keys: ["d/3"], duration: "w", midiValue: 50 }, { keys: ["d/3"], duration: "w", midiValue: 50 }, { keys: ["a/2"], duration: "w", midiValue: 45 }, { keys: ["a/2"], duration: "w", midiValue: 45 }, { keys: ["f/2"], duration: "w", midiValue: 41 }, { keys: ["e/3"], duration: "w", midiValue: 52 }, { keys: ["a/2"], duration: "w", midiValue: 45 }, { keys: ["e/3"], duration: "w", midiValue: 52 } ]
    },

    // ===========================================
    // === BOSSA NOVA / LATIN                  ===
    // ===========================================
    {
        id: "c-bossa-I-II-V",
        name: "Bossa Nova I-ii-V (Do Magg - Maj7/m7/7)",
        category: "giri_armonici", staveLayout: "grand", keySignature: "C", timeSignature: "4/4",
        notesTreble: [
            { keys: ["c/4", "e/4", "g/4", "b/4"], duration: "h", midiValues: [60, 64, 67, 71] }, // Cmaj7
            { keys: ["d/4", "f/4", "a/4", "c/5"], duration: "h", midiValues: [62, 65, 69, 72] }, // Dm7
            { keys: ["g/4", "b/4", "d/5", "f/5"], duration: "w", midiValues: [67, 71, 74, 77] }  // G7
        ],
        notesBass: [ // Radici con ritmo sincopato tipico (semplificato qui)
             { keys: ["c/3"], duration: "q", midiValue: 48 }, { keys: ["c/3"], duration: "8", midiValue: 48 }, { keys: ["r/4"], duration: "8"}, // Pausa
             { keys: ["d/3"], duration: "q", midiValue: 50 }, { keys: ["d/3"], duration: "8", midiValue: 50 }, { keys: ["r/4"], duration: "8"},
             { keys: ["g/3"], duration: "q", midiValue: 55 }, { keys: ["g/3"], duration: "8", midiValue: 55 }, { keys: ["r/4"], duration: "8"},
             { keys: ["g/3"], duration: "q", midiValue: 55 }, { keys: ["g/3"], duration: "8", midiValue: 55 }, { keys: ["r/4"], duration: "8"}, // Battuta extra per G7
        ]
    },

]; // Fine array giriArmoniciExercises

// Rendi l'array accessibile globalmente sotto la chiave 'giri_armonici'
window.exerciseData = window.exerciseData || {};
window.exerciseData.giri_armonici = giriArmoniciExercises;

console.log("Dati Esercizi Giri Armonici (Ampliati) Caricati.");