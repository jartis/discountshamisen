var SHAMISEN_NOTES = [
    [
        'D2', 'F2', 'G2', 'A2', 'C3', 'D3', 'F3', 'G3', 'A3', 'C4',
        'G2', 'A2', 'C3', 'D3', 'F3', 'G3', 'A3', 'C4', 'D4', 'F4',
        'D3', 'F3', 'G3', 'A3', 'C4', 'D4', 'F4', 'G4', 'A4', 'C5',
    ],
    [
        'D2', 'F2', 'G2', 'A2', 'C3', 'D3', 'F3', 'G3', 'A3', 'C4',
        'A2', 'C3', 'D3', 'F3', 'G3', 'A3', 'C4', 'D4', 'F4', 'G4',
        'D3', 'F3', 'G3', 'A3', 'C4', 'D4', 'F4', 'G4', 'A4', 'C5',
    ],
    [
        'D2', 'F2', 'G2', 'A2', 'C3', 'D3', 'F3', 'G3', 'A3', 'C4',
        'G2', 'A2', 'C3', 'D3', 'F3', 'G3', 'A3', 'C4', 'D4', 'F4',
        'C3', 'D3', 'F3', 'G3', 'A3', 'C4', 'D4', 'F4', 'G4', 'A4',
    ],
];

var SHAMISEN_KEYS = [
    'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash',
    'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon',
    'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP',
];

const plucky = new Tone.Sampler({
    urls: {
        'C3': './samp.wav',
    },
}).toDestination();

const HON_SHOSHI = 0;
const NI_AGARI = 1;
const SAN_SAGARI = 2;
var tuning = 0;

var lastNotes = [
    '',
    '',
    '',
];

const TuningNames = [
    '本調子 (Hon Choshi)',
    '二上がり (Ni Agari)',
    '三下がり (San Sagari)',
]

window.onload = function() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

function handleKeyDown(event) {
    event.preventDefault();
    let key = event.key;
    if (event.key == 'ArrowUp') {
        tuning = (tuning + 1) % 3;
        document.getElementById('tuning').innerHTML = 'Currently ' + TuningNames[tuning];
    } else if (event.key == 'ArrowDown') {
        tuning = (tuning + 2) % 3;
        document.getElementById('tuning').innerHTML = 'Currently ' + TuningNames[tuning];
    }
    let index = SHAMISEN_KEYS.indexOf(event.code);
    if (index >= 0) {
        let string = Math.floor(index / 10);
        if (lastNotes[string] != '') {
            plucky.triggerRelease(lastNotes[string], "+0");
        }
        let note = SHAMISEN_NOTES[tuning][index];
        if (event.ctrlKey) {
            note = Tone.Frequency(note).transpose(2);
        } else if (event.shiftKey) {
            note = Tone.Frequency(note).transpose(1);
        }
        lastNotes[string] = note;

        plucky.triggerAttack(note);
    }
}

function handleKeyUp(event) {}

function perlin_noise(canvas) {
    let canvas_ctx = canvas.getContext('2d');
    let offscreen = document.createElement('canvas');
    let offscreen_ctx = offscreen.getContext('2d');
    let saved_alpha = canvas_ctx.globalAlpha;

    /* Fill the offscreen buffer with random noise. */
    offscreen.width = 16;
    offscreen.height = 9;

    let offscreen_id = offscreen_ctx.getImageData(0, 0, offscreen.width, offscreen.height);
    let offscreen_pixels = offscreen_id.data;

    for (let i = 0; i < offscreen_pixels.length; i += 4) {
        offscreen_pixels[i] = Math.floor(Math.random() * 50);
        offscreen_pixels[i + 1] = Math.floor(Math.random() * 50);
        offscreen_pixels[i + 2] = Math.floor(Math.random() * 50);
        offscreen_pixels[i + 3] = 32;
    }

    offscreen_ctx.putImageData(offscreen_id, 0, 0);

    /* Scale random iterations onto the canvas to generate Perlin noise. */
    for (let size = 4; size <= offscreen.width; size *= 2) {
        let x = Math.floor(Math.random() * (offscreen.width - size));
        let y = Math.floor(Math.random() * (offscreen.height - size));

        canvas_ctx.globalAlpha = 4 / size;
        canvas_ctx.drawImage(offscreen, x, y, size, size, 0, 0, canvas.width, canvas.height);
    }

    canvas_ctx.globalAlpha = saved_alpha;
}

var bg_canvas = document.getElementById('canvas');

function drawFrame() {
    perlin_noise(bg_canvas);
    requestAnimationFrame(drawFrame);
}

drawFrame();