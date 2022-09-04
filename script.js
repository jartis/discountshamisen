var SHAMISEN_NOTES = [
    "D2", "F2", "G2", "A2", "C3", "D3", "F3", "G3", "A3", "C4",
    "G2", "A2", "C3", "D3", "F3", "G3", "A3", "C4", "D4", "F4",
    "D3", "F3", "G3", "A3", "C4", "D4", "F4", "G4", "A4", "C5",
]

var SHAMISEN_KEYS = [
    "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
    "a", "s", "d", "f", "g", "h", "j", "k", "l", ";",
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
]

const plucky = new Tone.PolySynth(Tone.PluckSynth, { resonance: 0.91, octaves: 1.5, dampening: 1000 }).toDestination();


window.onload = function() {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
}

function handleKeyDown(event) {
    let key = event.key;
    let index = SHAMISEN_KEYS.indexOf(key);
    if (index >= 0) {
        plucky.triggerAttackRelease(SHAMISEN_NOTES[index], "32n");
    }
}

function handleKeyUp(event) {}

function perlin_noise(canvas) {
    let canvas_ctx = canvas.getContext("2d");
    let offscreen = document.createElement("canvas");
    let offscreen_ctx = offscreen.getContext("2d");
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