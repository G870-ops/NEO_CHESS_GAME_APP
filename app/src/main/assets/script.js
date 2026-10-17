/**
 * NEO-CHESS | System v2.0 Quantum Matrix
 * OPERATOR / AUTHOR: GOUTAM GUPTA
 * AUTH_ID: GOUTAM_GUPTA_V1
 * ADVANCED FEATURES:
 * - Front Page Operator Authentication (Login, Register, Quick Guest)
 * - Main Navigation Menu: Play with AI vs Play with Friend
 * - Play with Friend: Create Room (5-Digit Code Generator) & Enter Room (5-Digit Code Box)
 * - Autonomous Neural AI Cyber-Core Engine (Minimax + Alpha-Beta Pruning, 3 Personas)
 * - Procedural Web Audio API Synthesizer (Zero External Dependencies, Pure Sci-Fi Synth)
 * - Quantum Kinetic Warp Piece Motion & Laser Vector Targeting Reticles
 * - Tactical Threat Radar / Neural Heatmap Territory Dominance
 * - Quantum Chrono-Rewind (T-1) Reality Restoration
 * - Cyber Overdrive Protocols (Energy Cores, EMP Recon, Plasma Shield, Quantum Swap)
 * - Real-Time Neural Advantage Matrix Gauge & Check Threat Telemetry
 * - Dynamic Theme Matrix (Neon, Matrix Glitch, Solar Flare, Void Core)
 * - Full Android Bridge (Haptics Vibration + WebSocket Multiplayer Sync)
 * - Holographic Battle Data Deck (APM, Casualties, Match Analytics, PGN Export)
 */

// ==============================================
// 1. DOM REFERENCES (ALL ORIGINAL ELEMENTS PRESERVED)
// ==============================================
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const p1Timer = document.getElementById('p1-timer');
const p2Timer = document.getElementById('p2-timer');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const p1Captured = document.getElementById('p1-captured');
const p2Captured = document.getElementById('p2-captured');
const overlay = document.getElementById('overlay');
const logTerminal = document.getElementById('log-terminal');

// Additional UI References
const undoBtn = document.getElementById('undoBtn');
const radarBtn = document.getElementById('radarBtn');
const dataBtn = document.getElementById('dataBtn');
const sfxToggleBtn = document.getElementById('sfxToggleBtn');
const droneToggleBtn = document.getElementById('droneToggleBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const evalBarFill = document.getElementById('eval-bar-fill');
const evalScoreText = document.getElementById('eval-score-text');
const threatIndicator = document.getElementById('threat-indicator');
const aiTelemetry = document.getElementById('ai-telemetry');
const aiTelemetryText = document.getElementById('ai-telemetry-text');
const overdriveDeck = document.getElementById('overdrive-deck');
const p1CoreBox = document.getElementById('p1-core-box');
const p2CoreBox = document.getElementById('p2-core-box');
const p1CoreFill = document.getElementById('p1-core-fill');
const p2CoreFill = document.getElementById('p2-core-fill');
const empBtn = document.getElementById('empBtn');
const shieldBtn = document.getElementById('shieldBtn');
const swapBtn = document.getElementById('swapBtn');
const battleModal = document.getElementById('battle-modal');

// ==============================================
// 2. IDENTITY & CORE STATE VARIABLES (PRESERVED & EXTENDED)
// ==============================================
let playerWhite = "OPERATOR_01";
let playerBlack = "OPERATOR_02";
let turn = 'white';
let selected = null;
let gameRunning = false;
let winner = null;
let timers = { white: 300, black: 300 };
let interval = null;
let lastSelectedStartColor = 'white';
let isGlitched = false;

// Neural Link & Pulse control
let pulseVal = 0;
let pulseDir = 1;

let stats = {
    white: { collected: [] },
    black: { collected: [] }
};

const PIECES = {
    white: { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' },
    black: { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' }
};

// --- NEW FUTURISTIC STATE ENGINE ---
let gameMode = 'pvp'; // 'pvp', 'ai', 'network'
let aiDifficulty = 'synth'; // 'novice', 'synth', 'oracle'
let myPlayerColor = 'white'; // for AI & network mode
let isAiThinking = false;
let overdriveEnabled = false;
let energyCores = { white: 50, black: 50 };
let shieldedPiece = null; // { r, c, color }
let empScanActive = false;
let radarActive = false; // Threat Radar / Heatmap
let currentTheme = 'neon'; // 'neon', 'matrix', 'solar', 'void'
let sfxEnabled = true;
let droneEnabled = false;

// Chrono-Rewind & Analytics
let historyStack = [];
let totalMovesPlayed = 0;
let gameStartTime = null;
let rewindCount = 0;
let selectingShieldPiece = false;
let swapSelection = null;

// Operator Authentication & 5-Digit Room State
let currentOperator = {
    username: "OPERATOR_01",
    id: "#79214",
    authenticated: false
};
let currentAuthTab = 'login';
let current5DigitRoomCode = null;

// ==============================================
// 3. PROCEDURAL SCI-FI WEB AUDIO API SYNTHESIZER
// ==============================================
let audioCtx = null;
let droneOsc = null;
let droneGain = null;

function initAudio() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSelectSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.09);
    } catch (e) {}
}

function playMoveSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(640, audioCtx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.14);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}
}

function playCaptureSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;
    try {
        const subOsc = audioCtx.createOscillator();
        const subGain = audioCtx.createGain();
        subOsc.type = 'sawtooth';
        subOsc.frequency.setValueAtTime(140, audioCtx.currentTime);
        subOsc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.22);
        subGain.gain.setValueAtTime(0.28, audioCtx.currentTime);
        subGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);
        subOsc.connect(subGain);
        subGain.connect(audioCtx.destination);
        subOsc.start();
        subOsc.stop(audioCtx.currentTime + 0.23);

        const noiseOsc = audioCtx.createOscillator();
        const noiseGain = audioCtx.createGain();
        noiseOsc.type = 'square';
        noiseOsc.frequency.setValueAtTime(950, audioCtx.currentTime);
        noiseOsc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.15);
        noiseGain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        noiseOsc.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        noiseOsc.start();
        noiseOsc.stop(audioCtx.currentTime + 0.16);
    } catch (e) {}
}

function playCheckSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
        osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.32);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.33);
    } catch (e) {}
}

function playRewindSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.26);
    } catch (e) {}
}

function playAbilitySound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;
    try {
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.05);
            gain.gain.setValueAtTime(0.12, audioCtx.currentTime + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.05 + 0.2);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(audioCtx.currentTime + idx * 0.05);
            osc.stop(audioCtx.currentTime + idx * 0.05 + 0.22);
        });
    } catch (e) {}
}

function playVictorySound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;
    try {
        const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        chord.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.08);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.08 + 0.8);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(audioCtx.currentTime + i * 0.08);
            osc.stop(audioCtx.currentTime + i * 0.08 + 0.85);
        });
    } catch (e) {}
}

function toggleDroneHum() {
    initAudio();
    if (!audioCtx) return;
    droneEnabled = !droneEnabled;
    if (droneEnabled) {
        try {
            droneOsc = audioCtx.createOscillator();
            droneGain = audioCtx.createGain();
            droneOsc.type = 'sawtooth';
            droneOsc.frequency.setValueAtTime(52, audioCtx.currentTime);

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(120, audioCtx.currentTime);

            droneGain.gain.setValueAtTime(0.035, audioCtx.currentTime);
            droneOsc.connect(filter);
            filter.connect(droneGain);
            droneGain.connect(audioCtx.destination);
            droneOsc.start();
            droneToggleBtn.innerText = "DRONE: ON";
            droneToggleBtn.classList.add('active');
            logSystem("NEURAL_DRONE: ACTIVATED");
        } catch (e) {}
    } else {
        if (droneOsc) {
            try { droneOsc.stop(); droneOsc.disconnect(); } catch (e) {}
            droneOsc = null;
        }
        droneToggleBtn.innerText = "DRONE: OFF";
        droneToggleBtn.classList.remove('active');
        logSystem("NEURAL_DRONE: MUTED");
    }
}

// ==============================================
// 4. ANDROID HAPTICS BRIDGE
// ==============================================
function triggerHaptic(type = 'move') {
    const durations = { select: 15, move: 35, capture: 75, check: 120, victory: 250 };
    const ms = durations[type] || 30;
    if (window.AndroidHaptics && typeof window.AndroidHaptics.vibrate === 'function') {
        try { window.AndroidHaptics.vibrate(ms); } catch (e) {}
    } else if (navigator.vibrate) {
        try { navigator.vibrate(ms); } catch (e) {}
    }
}

// ==============================================
// 5. AUTHENTICATION & MULTI-VIEW FRONT PORTAL
// ==============================================
function setupIdentity() {
    overlay.style.display = 'flex';
    initAuthSystem();

    // Preserve start button onclicks
    const wBtn = document.getElementById('p1White');
    const bBtn = document.getElementById('p1Black');
    if (wBtn) wBtn.onclick = () => finalizeIdentity(true);
    if (bBtn) bBtn.onclick = () => finalizeIdentity(false);

    // Sync overdrive checkbox if present
    const odToggle = document.getElementById('overdrive-toggle');
    if (odToggle) {
        odToggle.checked = overdriveEnabled;
        odToggle.onchange = (e) => {
            overdriveEnabled = e.target.checked;
        };
    }
}

function initAuthSystem() {
    try {
        const saved = localStorage.getItem('neo_chess_operator');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.username) {
                currentOperator = parsed;
                currentOperator.authenticated = true;
                playerWhite = currentOperator.username;
            }
        }
    } catch (e) {}

    if (currentOperator.authenticated) {
        showMainMenu();
    } else {
        showAuthScreen();
    }
}

function showAuthScreen() {
    hideAllViews();
    const v = document.getElementById('view-auth');
    if (v) v.style.display = 'flex';
}

function showMainMenu() {
    hideAllViews();
    updateProfileDisplay();
    const v = document.getElementById('view-menu');
    if (v) v.style.display = 'flex';
}

function showAiSetupScreen() {
    initAudio();
    playSelectSound();
    hideAllViews();
    const v = document.getElementById('view-ai-setup');
    if (v) v.style.display = 'flex';
}

function showFriendHubScreen() {
    initAudio();
    playSelectSound();
    hideAllViews();
    const v = document.getElementById('view-friend-hub');
    if (v) v.style.display = 'flex';
}

function showLocalDuelScreen() {
    initAudio();
    playSelectSound();
    hideAllViews();
    const v = document.getElementById('view-local-duel');
    if (v) v.style.display = 'flex';
    const p1In = document.getElementById('p1-input');
    if (p1In) p1In.value = currentOperator.username || "OPERATOR_01";
}

function hideAllViews() {
    const views = ['view-auth', 'view-menu', 'view-ai-setup', 'view-friend-hub', 'view-create-room', 'view-enter-room', 'view-local-duel'];
    views.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}

function switchAuthTab(tab) {
    initAudio();
    playSelectSound();
    currentAuthTab = tab;
    const tLog = document.getElementById('tabLogin');
    const tReg = document.getElementById('tabRegister');
    if (tLog) tLog.classList.toggle('active', tab === 'login');
    if (tReg) tReg.classList.toggle('active', tab === 'register');
    const btn = document.getElementById('auth-submit-btn');
    if (btn) btn.innerText = tab === 'login' ? 'AUTHENTICATE & ENTER' : 'REGISTER CALLSIGN';
    const errBox = document.getElementById('auth-error-msg');
    if (errBox) errBox.style.display = 'none';
}

function handleAuthSubmit() {
    initAudio();
    const userIn = document.getElementById('auth-username').value.trim();
    const passIn = document.getElementById('auth-password').value.trim();
    const errBox = document.getElementById('auth-error-msg');

    if (!userIn) {
        if (errBox) {
            errBox.innerText = "ERROR: CALLSIGN CANNOT BE EMPTY";
            errBox.style.display = 'block';
        }
        return;
    }

    if (currentAuthTab === 'register' && !passIn) {
        if (errBox) {
            errBox.innerText = "ERROR: PLEASE ENTER AN ACCESS KEY";
            errBox.style.display = 'block';
        }
        return;
    }

    const randomId = '#' + Math.floor(10000 + Math.random() * 90000);
    currentOperator = {
        username: userIn,
        id: randomId,
        authenticated: true
    };
    try {
        localStorage.setItem('neo_chess_operator', JSON.stringify(currentOperator));
    } catch (e) {}

    playerWhite = userIn;
    playVictorySound();
    triggerHaptic('victory');
    logSystem(`OPERATOR_AUTHENTICATED: ${userIn} [${randomId}]`);
    showMainMenu();
}

function quickGuestAuth() {
    initAudio();
    const guestNum = Math.floor(1000 + Math.random() * 9000);
    const guestUser = `OPERATOR_${guestNum}`;
    currentOperator = {
        username: guestUser,
        id: '#' + guestNum,
        authenticated: true
    };
    try {
        localStorage.setItem('neo_chess_operator', JSON.stringify(currentOperator));
    } catch (e) {}
    playerWhite = guestUser;
    playSelectSound();
    triggerHaptic('select');
    logSystem(`GUEST_AUTH: ${guestUser} GRANTED ACCESS`);
    showMainMenu();
}

function logoutOperator() {
    initAudio();
    playSelectSound();
    currentOperator = { username: "OPERATOR", id: "#00000", authenticated: false };
    try {
        localStorage.removeItem('neo_chess_operator');
    } catch (e) {}
    showAuthScreen();
}

function updateProfileDisplay() {
    const nameEl = document.getElementById('profile-display-name');
    const idEl = document.getElementById('profile-display-id');
    if (nameEl) nameEl.innerText = currentOperator.username;
    if (idEl) idEl.innerText = currentOperator.id;
}

// ==============================================
// 6. PLAY WITH AI LOGIC
// ==============================================
function setAiDiff(diff) {
    aiDifficulty = diff;
    document.querySelectorAll('.persona-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.persona-btn[data-diff="${diff}"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

function startAiGame(chosenColor) {
    initAudio();
    playSelectSound();
    gameMode = 'ai';
    const diffNames = { novice: "CYBER-NOVICE [AI]", synth: "TACTICAL-SYNTH [AI]", oracle: "NEO-ORACLE [AI]" };
    const aiName = diffNames[aiDifficulty] || "A.I. CYBER-CORE";

    if (chosenColor === 'white') {
        playerWhite = currentOperator.username || "OPERATOR_01";
        playerBlack = aiName;
        myPlayerColor = 'white';
    } else {
        playerWhite = aiName;
        playerBlack = currentOperator.username || "OPERATOR_01";
        myPlayerColor = 'black';
    }

    const odCheck = document.getElementById('overdrive-toggle');
    overdriveEnabled = odCheck ? odCheck.checked : false;

    initGame('white');
}

// ==============================================
// 7. PLAY WITH FRIEND: 5-DIGIT ROOM ENGINE
// ==============================================
function openCreateRoomScreen() {
    initAudio();
    playSelectSound();
    hideAllViews();
    const v = document.getElementById('view-create-room');
    if (v) v.style.display = 'flex';
    generateNew5DigitRoom();
}

function generateNew5DigitRoom() {
    initAudio();
    // 5-digit code generation
    const code = String(Math.floor(10000 + Math.random() * 90000));
    current5DigitRoomCode = code;

    const display = document.getElementById('generated-code-display');
    if (display) {
        display.innerHTML = '';
        for (let digit of code) {
            const span = document.createElement('span');
            span.className = 'digit-box';
            span.innerText = digit;
            display.appendChild(span);
        }
    }

    const statusEl = document.getElementById('create-room-status-text');
    if (statusEl) {
        statusEl.innerText = `WAITING FOR FRIEND TO ENTER 5-DIGIT CODE: ${code}...`;
    }

    gameMode = 'network';
    myPlayerColor = 'white';
    playerWhite = currentOperator.username || "OPERATOR_01";
    playerBlack = "WAITING...";

    // Connect to server room
    connectToRoom(code, currentOperator.username);
    logSystem(`ROOM_GENERATED: [${code}] - HOSTING AS WHITE`);
}

function copyCreatedRoomCode() {
    if (!current5DigitRoomCode) return;
    initAudio();
    playSelectSound();
    triggerHaptic('select');
    navigator.clipboard.writeText(current5DigitRoomCode).then(() => {
        logSystem(`ROOM_CODE_COPIED: ${current5DigitRoomCode}`);
        const statusEl = document.getElementById('create-room-status-text');
        if (statusEl) {
            const old = statusEl.innerText;
            statusEl.innerText = `COPIED [${current5DigitRoomCode}] TO CLIPBOARD! SHARE WITH FRIEND!`;
            setTimeout(() => { statusEl.innerText = old; }, 2000);
        }
    }).catch(() => {
        logSystem(`ROOM_CODE: ${current5DigitRoomCode}`);
    });
}

function openEnterRoomScreen() {
    initAudio();
    playSelectSound();
    hideAllViews();
    const v = document.getElementById('view-enter-room');
    if (v) v.style.display = 'flex';
    const input = document.getElementById('enter-code-input');
    if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 200);
    }
    const statusBox = document.getElementById('enter-room-status-text');
    if (statusBox) statusBox.style.display = 'none';
    const joinBtn = document.getElementById('join-room-btn');
    if (joinBtn) joinBtn.disabled = true;
}

function handle5DigitInput(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
    const joinBtn = document.getElementById('join-room-btn');
    if (input.value.length === 5) {
        if (joinBtn) joinBtn.disabled = false;
        playSelectSound();
        triggerHaptic('select');
    } else {
        if (joinBtn) joinBtn.disabled = true;
    }
}

function pasteRoomCode() {
    navigator.clipboard.readText().then(text => {
        const digits = text.replace(/[^0-9]/g, '').slice(0, 5);
        const input = document.getElementById('enter-code-input');
        if (input) {
            input.value = digits;
            handle5DigitInput(input);
        }
    }).catch(() => {
        logSystem("CLIPBOARD_ACCESS: UNABLE TO READ AUTOMATICALLY");
    });
}

function submitEnterRoomCode() {
    const input = document.getElementById('enter-code-input');
    const code = input ? input.value.trim() : '';
    if (code.length !== 5) return;

    initAudio();
    playSelectSound();
    const statusBox = document.getElementById('enter-room-status-text');
    if (statusBox) {
        statusBox.innerText = `LINKING TO 5-DIGIT ROOM: [${code}]...`;
        statusBox.style.display = 'block';
    }

    gameMode = 'network';
    myPlayerColor = 'black';
    playerBlack = currentOperator.username || "OPERATOR_02";

    connectToRoom(code, currentOperator.username);
    logSystem(`CONNECTING_ROOM: [${code}] AS GUEST`);
}

// Connect to room using Android WebSocket bridge or direct browser WebSocket
let webSocketConn = null;

function connectToRoom(roomId, playerName) {
    const serverInput = document.getElementById('custom-server-ip');
    const serverUrl = serverInput ? serverInput.value.trim() : "ws://192.168.1.5:8080";

    // 1. Android native WebSocket bridge
    if (window.AndroidWebSocket && typeof window.AndroidWebSocket.joinRoom === 'function') {
        if (window.AndroidConnection && typeof window.AndroidConnection.connect === 'function') {
            window.AndroidConnection.connect(serverUrl);
        }
        window.AndroidWebSocket.joinRoom(roomId, playerName);
        return;
    }

    // 2. Direct browser WebSocket fallback
    try {
        if (webSocketConn) {
            try { webSocketConn.close(); } catch (e) {}
        }
        webSocketConn = new WebSocket(serverUrl);
        webSocketConn.onopen = () => {
            logSystem(`MATRIX_SOCKET_OPEN: LINKING ROOM [${roomId}]`);
            webSocketConn.send(JSON.stringify({ type: 'join', room: roomId, playerName: playerName }));
        };
        webSocketConn.onmessage = (evt) => {
            try {
                const msg = JSON.parse(evt.data);
                if (msg.type === 'move') {
                    window.handleNetworkMove(msg.move);
                } else if (msg.type === 'assignColor') {
                    window.setPlayerColor(msg.color, msg.room);
                } else if (msg.type === 'ready') {
                    window.onNetworkGameReady(msg.room, msg.white, msg.black);
                } else if (msg.type === 'message') {
                    window.onNetworkMessage(msg.text);
                }
            } catch (err) {}
        };
        webSocketConn.onerror = () => {
            logSystem("MATRIX_CONNECTION_ERROR: VERIFY SERVER IS RUNNING ON PORT 8080", true);
            const statusBox = document.getElementById('enter-room-status-text');
            if (statusBox) {
                statusBox.innerText = "FAILED TO CONNECT: CHECK IF SERVER IS RUNNING (PORT 8080)";
                statusBox.style.color = "var(--accent)";
            }
        };
    } catch (e) {
        logSystem("WS_ERROR: CANNOT INITIALIZE CONNECTION", true);
    }
}

// Ready event triggered when both players join room
window.onNetworkGameReady = function(room, white, black) {
    logSystem(`QUANTUM_LINK_ESTABLISHED: ROOM [${room}] READY!`, true);
    playerWhite = white || "WHITE";
    playerBlack = black || "BLACK";

    playVictorySound();
    triggerHaptic('victory');

    initGame('white');
};

window.onNetworkMessage = function(text) {
    logSystem(`NETWORK_MSG: ${text}`);
    const statusBox = document.getElementById('enter-room-status-text');
    if (statusBox) {
        statusBox.innerText = text;
        statusBox.style.display = 'block';
    }
};

window.setPlayerColor = function(color, room) {
    myPlayerColor = color;
    logSystem(`NETWORK_ASSIGNMENT: ASSIGNED AS ${color ? color.toUpperCase() : 'NONE'}`);
};

window.handleNetworkMove = function(moveStr) {
    try {
        const data = typeof moveStr === 'string' ? JSON.parse(moveStr) : moveStr;
        if (data && data.fromR !== undefined && data.toR !== undefined) {
            const p = board[data.fromR][data.fromC];
            if (p) {
                const moveType = isLegalMove(p, data.fromR, data.fromC, data.toR, data.toC);
                executeMove(data.fromR, data.fromC, data.toR, data.toC, moveType || true);
                logSystem(`REMOTE_TELEMETRY: MOVE RECEIVED [${data.fromR},${data.fromC}] -> [${data.toR},${data.toC}]`);
            }
        }
    } catch (e) {
        console.error("Network move parse error:", e);
    }
};

function broadcastMove(fromR, fromC, toR, toC) {
    const movePayload = JSON.stringify({ fromR, fromC, toR, toC });
    if (window.AndroidWebSocket && typeof window.AndroidWebSocket.sendMove === 'function') {
        try { window.AndroidWebSocket.sendMove(movePayload); } catch (e) {}
    } else if (webSocketConn && webSocketConn.readyState === WebSocket.OPEN) {
        webSocketConn.send(JSON.stringify({ type: 'move', move: movePayload }));
    }
}

// ==============================================
// 8. LOCAL DUEL IDENTITY FINALIZATION (PRESERVED)
// ==============================================
function finalizeIdentity(isP1White) {
    initAudio();
    const name1 = document.getElementById('p1-input').value.trim() || currentOperator.username || "OPERATOR_01";
    const name2 = document.getElementById('p2-input').value.trim() || "OPERATOR_02";

    gameMode = 'pvp';
    if (isP1White) {
        playerWhite = name1;
        playerBlack = name2;
        myPlayerColor = 'white';
    } else {
        playerWhite = name2;
        playerBlack = name1;
        myPlayerColor = 'black';
    }

    const odCheck = document.getElementById('overdrive-toggle');
    overdriveEnabled = odCheck ? odCheck.checked : false;

    initGame('white');
}

// ==============================================
// 9. PARTICLE ENGINE (PRESERVED)
// ==============================================
let victoryParticles = [];
function initParticles() {
    victoryParticles = [];
    const count = 90;
    for (let i = 0; i < count; i++) {
        victoryParticles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            alpha: Math.random() * 0.8 + 0.2,
            size: Math.random() * 4 + 2,
            color: Math.random() > 0.5 ? getThemeColor('--primary', '#00f2ff') : getThemeColor('--secondary', '#ff00ff')
        });
    }
}

function drawParticles() {
    victoryParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.015;
        if (p.alpha <= 0) {
            p.x = canvas.width / 2;
            p.y = canvas.height / 2;
            p.vx = (Math.random() - 0.5) * 10;
            p.vy = (Math.random() - 0.5) * 10;
            p.alpha = Math.random() * 0.7 + 0.3;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function getThemeColor(varName, fallback) {
    try {
        const val = getComputedStyle(document.body).getPropertyValue(varName).trim();
        return val || fallback;
    } catch (e) {
        return fallback;
    }
}

// ==============================================
// 10. BOARD INITIALIZATION (PRESERVED)
// ==============================================
function initBoard() {
    window.board = Array(8).fill(null).map(() => Array(8).fill(null));
    const layout = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    for (let i = 0; i < 8; i++) {
        board[0][i] = { type: layout[i], color: 'black', moved: false };
        board[1][i] = { type: 'p', color: 'black' };
        board[6][i] = { type: 'p', color: 'white' };
        board[7][i] = { type: layout[i], color: 'white', moved: false };
    }
}

// ==============================================
// 11. MOVE LOGIC (PRESERVED & FULLY ACCURATE)
// ==============================================
function isLegalMove(piece, fromR, fromC, toR, toC, checkShield = true) {
    if (toR < 0 || toR > 7 || toC < 0 || toC > 7) return false;
    const target = board[toR][toC];

    // Friendly collision check
    if (target && target.color === piece.color) return false;

    // Cyber Overdrive Shield check: cannot capture a shielded piece
    if (checkShield && target && shieldedPiece && shieldedPiece.r === toR && shieldedPiece.c === toC && shieldedPiece.color !== piece.color) {
        return false;
    }

    const rDiff = toR - fromR;
    const cDiff = toC - fromC;
    const absR = Math.abs(rDiff);
    const absC = Math.abs(cDiff);

    const checkPath = (rs, cs) => {
        let r = fromR + rs, c = fromC + cs;
        while (r !== toR || c !== toC) {
            if (board[r][c]) return false;
            r += rs; c += cs;
        }
        return true;
    };

    switch (piece.type) {
        case 'p': {
            const d = piece.color === 'white' ? -1 : 1;
            // 1 square forward
            if (cDiff === 0 && !target && rDiff === d) return true;
            // 2 squares from initial rank
            if (cDiff === 0 && !target && fromR === (piece.color === 'white' ? 6 : 1) && rDiff === 2 * d) {
                return !board[fromR + d][fromC];
            }
            // Diagonal capture
            return (Math.abs(cDiff) === 1 && target && rDiff === d);
        }
        case 'n':
            return (absR === 2 && absC === 1) || (absR === 1 && absC === 2);
        case 'b':
            return absR === absC && checkPath(rDiff / absR, cDiff / absC);
        case 'r':
            return (fromR === toR || fromC === toC) && checkPath(rDiff === 0 ? 0 : rDiff / absR, cDiff === 0 ? 0 : cDiff / absC);
        case 'q':
            return (absR === absC || fromR === toR || fromC === toC) && checkPath(rDiff === 0 ? 0 : rDiff / (absR || 1), cDiff === 0 ? 0 : cDiff / (absC || 1));
        case 'k': {
            // Castling
            if (absR === 0 && absC === 2 && !piece.moved) {
                const rookC = cDiff > 0 ? 7 : 0;
                const rook = board[fromR][rookC];
                if (rook && rook.type === 'r' && !rook.moved && checkPath(0, cDiff > 0 ? 1 : -1)) {
                    return "castle";
                }
            }
            return absR <= 1 && absC <= 1;
        }
        default:
            return false;
    }
}

function getValidMoves(r, c) {
    const piece = board[r][c];
    if (!piece) return [];
    const moves = [];
    for (let tr = 0; tr < 8; tr++) {
        for (let tc = 0; tc < 8; tc++) {
            const moveType = isLegalMove(piece, r, c, tr, tc);
            if (moveType) {
                moves.push({ r: tr, c: tc, type: moveType });
            }
        }
    }
    return moves;
}

function findKing(color) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p.type === 'k' && p.color === color) return { r, c };
        }
    }
    return null;
}

function isKingInCheck(color) {
    const kingPos = findKing(color);
    if (!kingPos) return false;
    const enemyColor = color === 'white' ? 'black' : 'white';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p.color === enemyColor) {
                if (isLegalMove(p, r, c, kingPos.r, kingPos.c, false)) {
                    return true;
                }
            }
        }
    }
    return false;
}

// ==============================================
// 12. SYSTEM LOG ENGINE (PRESERVED)
// ==============================================
function logSystem(msg, critical = false) {
    if (!logTerminal) return;
    const line = document.createElement('div');
    line.className = 'log-line';
    if (critical) {
        line.classList.add('alert');
    }
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    line.innerText = `[${time}] > ${msg.toUpperCase()}`;
    logTerminal.prepend(line);
    logTerminal.scrollTop = 0;
}

// ==============================================
// 13. ADVANTAGE EVALUATION GAUGE
// ==============================================
function evaluateBoardState() {
    const pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
    let score = 0;

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p) {
                const val = pieceValues[p.type] || 0;
                const centerBonus = (r >= 2 && r <= 5 && c >= 2 && c <= 5) ? 15 : 0;
                const total = val + centerBonus;
                score += (p.color === 'white' ? total : -total);
            }
        }
    }
    return score / 100;
}

function updateAdvantageGauge() {
    if (!evalBarFill || !evalScoreText) return;
    const evalScore = evaluateBoardState();
    const clamped = Math.max(-10, Math.min(10, evalScore));
    const percent = ((clamped + 10) / 20) * 100;
    evalBarFill.style.width = `${percent}%`;

    if (Math.abs(evalScore) < 0.2) {
        evalScoreText.innerText = `EVAL: BALANCED [0.0]`;
    } else if (evalScore > 0) {
        evalScoreText.innerText = `EVAL: CYAN ADVANTAGE [+${evalScore.toFixed(1)}]`;
    } else {
        evalScoreText.innerText = `EVAL: MAGENTA ADVANTAGE [${evalScore.toFixed(1)}]`;
    }

    if (threatIndicator) {
        const whiteCheck = isKingInCheck('white');
        const blackCheck = isKingInCheck('black');
        if (whiteCheck) {
            threatIndicator.innerText = "WHITE KING UNDER THREAT";
            threatIndicator.className = "threat-tag danger";
        } else if (blackCheck) {
            threatIndicator.innerText = "BLACK KING UNDER THREAT";
            threatIndicator.className = "threat-tag danger";
        } else {
            threatIndicator.innerText = "MATRIX SECURE";
            threatIndicator.className = "threat-tag";
        }
    }
}

// ==============================================
// 14. THREAT RADAR & HEATMAP CALCULATION
// ==============================================
function calculateThreatRadar() {
    const matrix = Array(8).fill(null).map(() => Array(8).fill(null).map(() => ({ white: 0, black: 0 })));
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p) {
                for (let tr = 0; tr < 8; tr++) {
                    for (let tc = 0; tc < 8; tc++) {
                        if (isLegalMove(p, r, c, tr, tc, false)) {
                            matrix[tr][tc][p.color]++;
                        }
                    }
                }
            }
        }
    }
    return matrix;
}

// ==============================================
// 15. QUANTUM CHRONO-REWIND (T-1) ENGINE
// ==============================================
function saveSnapshot(moveMeta) {
    const boardClone = board.map(row => row.map(cell => cell ? { ...cell } : null));
    historyStack.push({
        board: boardClone,
        turn: turn,
        timers: { ...timers },
        stats: {
            white: { collected: [...stats.white.collected] },
            black: { collected: [...stats.black.collected] }
        },
        energyCores: { ...energyCores },
        shieldedPiece: shieldedPiece ? { ...shieldedPiece } : null,
        moveMeta: moveMeta || null
    });
    if (historyStack.length > 40) historyStack.shift();
}

function chronoRewind() {
    if (!gameRunning || historyStack.length === 0) {
        logSystem("CHRONO_REWIND: NO EARLIER TIMELINE AVAILABLE", true);
        return;
    }

    const stepsToRewind = (gameMode === 'ai' && historyStack.length >= 2) ? 2 : 1;
    let targetSnap = null;
    for (let i = 0; i < stepsToRewind; i++) {
        if (historyStack.length > 0) {
            targetSnap = historyStack.pop();
        }
    }

    if (!targetSnap) return;

    window.board = targetSnap.board.map(row => row.map(cell => cell ? { ...cell } : null));
    turn = targetSnap.turn;
    timers = { ...targetSnap.timers };
    stats = {
        white: { collected: [...targetSnap.stats.white.collected] },
        black: { collected: [...targetSnap.stats.black.collected] }
    };
    energyCores = { ...targetSnap.energyCores };
    shieldedPiece = targetSnap.shieldedPiece;
    selected = null;
    winner = null;
    rewindCount++;

    playRewindSound();
    triggerHaptic('check');
    triggerGlitch();
    logSystem(`CHRONO_REWIND: QUANTUM STATE RESTORED [T-${historyStack.length}]`, true);

    updateUI();
}

// ==============================================
// 16. UI UPDATE ENGINE (PRESERVED & EXPANDED)
// ==============================================
function updateUI() {
    const f = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
    p1Timer.innerText = `${playerWhite.toUpperCase()}: ${f(timers.white)}`;
    p2Timer.innerText = `${playerBlack.toUpperCase()}: ${f(timers.black)}`;
    p1Timer.className = turn === 'white' ? 'timer active-white' : 'timer';
    p2Timer.className = turn === 'black' ? 'timer active-black' : 'timer';

    p1Captured.innerText = stats.white.collected.join(' ');
    p2Captured.innerText = stats.black.collected.join(' ');

    setTimeout(() => {
        p1Captured.scrollLeft = p1Captured.scrollWidth;
        p2Captured.scrollLeft = p2Captured.scrollWidth;
    }, 0);

    if (overdriveEnabled) {
        if (p1CoreBox) p1CoreBox.style.display = 'block';
        if (p2CoreBox) p2CoreBox.style.display = 'block';
        if (p1CoreFill) p1CoreFill.style.width = `${energyCores.white}%`;
        if (p2CoreFill) p2CoreFill.style.width = `${energyCores.black}%`;
        const p1Label = p1CoreBox.querySelector('.core-label');
        const p2Label = p2CoreBox.querySelector('.core-label');
        if (p1Label) p1Label.innerText = `CORE ${energyCores.white}%`;
        if (p2Label) p2Label.innerText = `CORE ${energyCores.black}%`;

        const activeCore = energyCores[turn];
        if (empBtn) empBtn.disabled = activeCore < 25;
        if (shieldBtn) shieldBtn.disabled = activeCore < 50;
        if (swapBtn) swapBtn.disabled = activeCore < 100;
    }

    if (gameRunning && !winner) {
        const activePlayer = turn === 'white' ? playerWhite : playerBlack;
        statusText.innerText = `${activePlayer.toUpperCase()}'S CHANCE`;
        statusText.style.color = turn === 'white' ? getThemeColor('--primary', '#00f2ff') : getThemeColor('--secondary', '#ff00ff');
    }

    updateAdvantageGauge();
}

// ==============================================
// 17. CAPTURE & GLITCH & VICTORY (PRESERVED)
// ==============================================
function triggerGlitch() {
    isGlitched = true;
    canvas.classList.add('glitch-active');
    setTimeout(() => {
        canvas.classList.remove('glitch-active');
        isGlitched = false;
    }, 700);
}

function handleCapture(piece, target) {
    stats[piece.color].collected.push(PIECES[target.color][target.type]);
    logSystem(`UNIT_CAPTURED: ${target.type.toUpperCase()}`, target.type === 'k');

    if (overdriveEnabled) {
        energyCores[piece.color] = Math.min(100, energyCores[piece.color] + 25);
    }

    playCaptureSound();
    triggerHaptic('capture');

    if (target.type === 'k') {
        triggerGlitch();
        gameRunning = false;
        winner = piece.color;
        const winName = winner === 'white' ? playerWhite : playerBlack;
        statusText.innerText = `VICTORY: ${winName.toUpperCase()}`;
        logSystem(`KING_NEUTRALIZED: ${winName.toUpperCase()} WINS`, true);
        initParticles();
        playVictorySound();
        triggerHaptic('victory');
    }
}

// ==============================================
// 18. MOVE EXECUTION
// ==============================================
function executeMove(fromR, fromC, toR, toC, moveType, onComplete) {
    const p = board[fromR][fromC];
    const target = board[toR][toC];

    saveSnapshot({ fromR, fromC, toR, toC, piece: p.type, target: target ? target.type : null });

    if (moveType === "castle") {
        const rookC = toC > fromC ? 7 : 0;
        const newRookC = toC > fromC ? 5 : 3;
        board[fromR][newRookC] = board[fromR][rookC];
        board[fromR][rookC] = null;
        if (board[fromR][newRookC]) board[fromR][newRookC].moved = true;
    }

    if (target) {
        handleCapture(p, target);
    } else {
        playMoveSound();
        triggerHaptic('move');
    }

    if (p.type === 'p' && (toR === 0 || toR === 7)) {
        p.type = 'q';
        logSystem(`PROMOTION: PAWN ELEVATED TO QUEEN [${toR}, ${toC}]`);
        playAbilitySound();
    }

    board[toR][toC] = p;
    board[fromR][fromC] = null;
    p.moved = true;

    if (overdriveEnabled) {
        energyCores[p.color] = Math.min(100, energyCores[p.color] + 8);
        if (shieldedPiece && shieldedPiece.color === p.color) {
            shieldedPiece = null;
        }
        empScanActive = false;
    }

    turn = turn === 'white' ? 'black' : 'white';
    selected = null;
    totalMovesPlayed++;

    if (isKingInCheck(turn)) {
        playCheckSound();
        triggerHaptic('check');
        logSystem(`ALERT: ${turn.toUpperCase()} KING UNDER THREAT [CHECK]`, true);
    }

    updateUI();

    // Broadcast move to multiplayer opponent
    broadcastMove(fromR, fromC, toR, toC);

    if (onComplete) onComplete();

    // Trigger AI if it's AI's turn
    if (gameRunning && !winner && gameMode === 'ai' && turn !== myPlayerColor) {
        triggerAiTurn();
    }
}

// ==============================================
// 19. AUTONOMOUS NEURAL AI CYBER-CORE ENGINE
// ==============================================
function triggerAiTurn() {
    if (isAiThinking || !gameRunning || winner) return;
    isAiThinking = true;

    if (aiTelemetry) {
        aiTelemetry.style.display = 'flex';
        aiTelemetryText.innerText = `NEURAL CORE PROCESSING // CALCULATING TACTICAL MATRIX...`;
    }

    const thinkingDelay = aiDifficulty === 'oracle' ? 550 : (aiDifficulty === 'synth' ? 400 : 250);

    setTimeout(() => {
        const aiMove = computeBestMove(turn, aiDifficulty);
        if (aiTelemetry) aiTelemetry.style.display = 'none';
        isAiThinking = false;

        if (aiMove) {
            logSystem(`A.I._CALC: [${aiMove.from.r},${aiMove.from.c}] -> [${aiMove.to.r},${aiMove.to.c}]`);
            executeMove(aiMove.from.r, aiMove.from.c, aiMove.to.r, aiMove.to.c, aiMove.type);
        } else {
            logSystem("A.I._CORE: NO LEGAL TRAJECTORIES FOUND", true);
        }
    }, thinkingDelay);
}

function computeBestMove(aiColor, difficulty) {
    const allMoves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p.color === aiColor) {
                const valid = getValidMoves(r, c);
                valid.forEach(v => {
                    allMoves.push({ from: { r, c }, to: { r: v.r, c: v.c }, type: v.type, piece: p });
                });
            }
        }
    }

    if (allMoves.length === 0) return null;

    if (difficulty === 'novice') {
        const captures = allMoves.filter(m => board[m.to.r][m.to.c]);
        if (captures.length > 0 && Math.random() < 0.6) {
            return captures[Math.floor(Math.random() * captures.length)];
        }
        return allMoves[Math.floor(Math.random() * allMoves.length)];
    }

    const depth = difficulty === 'oracle' ? 3 : 2;
    let bestScore = -Infinity;
    let bestMove = allMoves[0];

    allMoves.sort(() => Math.random() - 0.5);
    allMoves.sort((a, b) => {
        const aCap = board[a.to.r][a.to.c] ? 1 : 0;
        const bCap = board[b.to.r][b.to.c] ? 1 : 0;
        return bCap - aCap;
    });

    for (const move of allMoves) {
        const captured = board[move.to.r][move.to.c];
        const movingPiece = board[move.from.r][move.from.c];

        board[move.to.r][move.to.c] = movingPiece;
        board[move.from.r][move.from.c] = null;

        const score = -minimax(depth - 1, -Infinity, Infinity, aiColor === 'white' ? 'black' : 'white');

        board[move.from.r][move.from.c] = movingPiece;
        board[move.to.r][move.to.c] = captured;

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return bestMove;
}

function minimax(depth, alpha, beta, currentColor) {
    if (depth === 0) {
        return evaluateStaticPosition(currentColor);
    }

    const moves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p.color === currentColor) {
                const valid = getValidMoves(r, c);
                valid.forEach(v => moves.push({ from: { r, c }, to: { r: v.r, c: v.c }, type: v.type }));
            }
        }
    }

    if (moves.length === 0) return -10000;

    let maxEval = -Infinity;
    for (const m of moves) {
        const captured = board[m.to.r][m.to.c];
        const piece = board[m.from.r][m.from.c];

        if (captured && captured.type === 'k') return 20000;

        board[m.to.r][m.to.c] = piece;
        board[m.from.r][m.from.c] = null;

        const evalScore = -minimax(depth - 1, -beta, -alpha, currentColor === 'white' ? 'black' : 'white');

        board[m.from.r][m.from.c] = piece;
        board[m.to.r][m.to.c] = captured;

        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
    }
    return maxEval;
}

function evaluateStaticPosition(forColor) {
    const rawScore = evaluateBoardState();
    return (forColor === 'white' ? rawScore : -rawScore) * 100;
}

// ==============================================
// 20. OVERDRIVE PROTOCOL ABILITIES
// ==============================================
function triggerOverdriveEmp() {
    if (!overdriveEnabled || energyCores[turn] < 25) return;
    energyCores[turn] -= 25;
    empScanActive = true;
    playAbilitySound();
    triggerHaptic('check');
    logSystem(`OVERDRIVE_EMP: ENEMY THREAT RAYS DETECTED FOR 1 ROUND!`);
    updateUI();
}

function prepareOverdriveShield() {
    if (!overdriveEnabled || energyCores[turn] < 50) return;
    selectingShieldPiece = true;
    logSystem(`OVERDRIVE_SHIELD: SELECT A UNIT TO ENVELOPE IN FORCEFIELD`);
}

function prepareQuantumSwap() {
    if (!overdriveEnabled || energyCores[turn] < 100) return;
    swapSelection = [];
    logSystem(`QUANTUM_SWAP: SELECT 2 UNITS TO TRANSLOCATE`);
}

// ==============================================
// 21. TOUCH & MOUSE INTERACTION (PRESERVED)
// ==============================================
function handleInteraction(clientX, clientY) {
    if (!gameRunning || isGlitched || winner || isAiThinking) return;

    if (gameMode === 'ai' && turn !== myPlayerColor) return;
    if (gameMode === 'network' && turn !== myPlayerColor) return;

    const rect = canvas.getBoundingClientRect();
    const T = canvas.width / 8;
    const c = Math.floor((clientX - rect.left) / T);
    const r = Math.floor((clientY - rect.top) / T);

    if (r < 0 || r > 7 || c < 0 || c > 7) return;

    if (selectingShieldPiece) {
        const p = board[r][c];
        if (p && p.color === turn) {
            shieldedPiece = { r, c, color: turn };
            energyCores[turn] -= 50;
            selectingShieldPiece = false;
            playAbilitySound();
            logSystem(`FORCEFIELD_ENGAGED: [${p.type.toUpperCase()}] PROTECTED FROM CAPTURE`);
            updateUI();
        }
        return;
    }

    if (swapSelection) {
        const p = board[r][c];
        if (p && p.color === turn && p.type !== 'k') {
            swapSelection.push({ r, c, piece: p });
            playSelectSound();
            if (swapSelection.length === 2) {
                const [first, second] = swapSelection;
                board[first.r][first.c] = second.piece;
                board[second.r][second.c] = first.piece;
                energyCores[turn] -= 100;
                swapSelection = null;
                playAbilitySound();
                triggerHaptic('check');
                logSystem(`QUANTUM_SWAP: TRANSLOCATED [${first.r},${first.c}] WITH [${second.r},${second.c}]`);
                updateUI();
                return;
            }
        }
    }

    if (selected) {
        const p = board[selected.r][selected.c];
        const moveType = isLegalMove(p, selected.r, selected.c, r, c);
        if (moveType) {
            executeMove(selected.r, selected.c, r, c, moveType);
        } else {
            if (board[r][c] && board[r][c].color === turn) {
                selected = { r, c };
                playSelectSound();
                triggerHaptic('select');
            } else {
                selected = null;
            }
        }
    } else if (board[r][c] && board[r][c].color === turn) {
        selected = { r, c };
        playSelectSound();
        triggerHaptic('select');
    }
}

canvas.addEventListener('mousedown', (e) => {
    handleInteraction(e.clientX, e.clientY);
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches && e.touches.length > 0) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });

// ==============================================
// 22. RENDER ENGINE (PRESERVED & HIGH FIDELITY)
// ==============================================
function draw() {
    const T = canvas.width / 8;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pulseVal += 0.015 * pulseDir;
    if (pulseVal > 1 || pulseVal < 0) pulseDir *= -1;

    const primaryColor = getThemeColor('--primary', '#00f2ff');
    const secondaryColor = getThemeColor('--secondary', '#ff00ff');
    const accentColor = getThemeColor('--accent', '#ff0055');

    // 1. Board Tiles
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? getThemeColor('--tile-white', '#0a0a18') : getThemeColor('--tile-black', '#04040a');
            ctx.fillRect(c * T, r * T, T, T);

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;
            ctx.strokeRect(c * T, r * T, T, T);
        }
    }

    // 2. Threat Radar Heatmap
    if (radarActive) {
        const matrix = calculateThreatRadar();
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const cell = matrix[r][c];
                if (cell.white > 0 && cell.black > 0) {
                    ctx.fillStyle = 'rgba(255, 100, 0, 0.18)';
                    ctx.fillRect(c * T, r * T, T, T);
                } else if (cell.white > 0) {
                    ctx.fillStyle = 'rgba(0, 242, 255, 0.10)';
                    ctx.fillRect(c * T, r * T, T, T);
                } else if (cell.black > 0) {
                    ctx.fillStyle = 'rgba(255, 0, 255, 0.10)';
                    ctx.fillRect(c * T, r * T, T, T);
                }
            }
        }
    }

    // 3. EMP Threat Lines
    if (empScanActive) {
        ctx.save();
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        const enemyColor = turn === 'white' ? 'black' : 'white';
        const friendlyKing = findKing(turn);
        if (friendlyKing) {
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const p = board[r][c];
                    if (p && p.color === enemyColor && isLegalMove(p, r, c, friendlyKing.r, friendlyKing.c, false)) {
                        ctx.beginPath();
                        ctx.moveTo(c * T + T / 2, r * T + T / 2);
                        ctx.lineTo(friendlyKing.c * T + T / 2, friendlyKing.r * T + T / 2);
                        ctx.stroke();
                    }
                }
            }
        }
        ctx.restore();
    }

    // 4. Valid Move Holographic Reticles
    if (selected && gameRunning && !winner) {
        const validMoves = getValidMoves(selected.r, selected.c);
        validMoves.forEach(m => {
            const targetPiece = board[m.r][m.c];
            const centerX = m.c * T + T / 2;
            const centerY = m.r * T + T / 2;

            ctx.save();
            if (targetPiece) {
                ctx.strokeStyle = accentColor;
                ctx.lineWidth = 2;
                ctx.shadowBlur = 10;
                ctx.shadowColor = accentColor;
                ctx.beginPath();
                ctx.arc(centerX, centerY, T * 0.38, 0, Math.PI * 2);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(centerX - T * 0.42, centerY); ctx.lineTo(centerX - T * 0.28, centerY);
                ctx.moveTo(centerX + T * 0.28, centerY); ctx.lineTo(centerX + T * 0.42, centerY);
                ctx.moveTo(centerX, centerY - T * 0.42); ctx.lineTo(centerX, centerY - T * 0.28);
                ctx.moveTo(centerX, centerY + T * 0.28); ctx.lineTo(centerX, centerY + T * 0.42);
                ctx.stroke();
            } else {
                ctx.strokeStyle = primaryColor;
                ctx.fillStyle = primaryColor;
                ctx.lineWidth = 1.5;
                ctx.shadowBlur = 8;
                ctx.shadowColor = primaryColor;
                ctx.beginPath();
                ctx.arc(centerX, centerY, 6 + 2 * Math.sin(pulseVal * Math.PI * 2), 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.arc(centerX, centerY, T * 0.24, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();
        });

        ctx.save();
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = primaryColor;
        ctx.strokeRect(selected.c * T + 4, selected.r * T + 4, T - 8, T - 8);
        ctx.restore();
    }

    // 5. Draw Pieces
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p) {
                let color = p.color === 'white' ? primaryColor : secondaryColor;

                if (shieldedPiece && shieldedPiece.r === r && shieldedPiece.c === c) {
                    ctx.save();
                    ctx.strokeStyle = '#00ffcc';
                    ctx.lineWidth = 2.5;
                    ctx.shadowBlur = 14;
                    ctx.shadowColor = '#00ffcc';
                    ctx.beginPath();
                    ctx.arc(c * T + T / 2, r * T + T / 2, T * 0.42, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                }

                ctx.save();
                if (p.color === turn && gameRunning && !winner) {
                    ctx.shadowBlur = 14 + 10 * Math.sin(pulseVal * Math.PI * 2);
                    ctx.shadowColor = color;
                    ctx.globalAlpha = 0.55 + 0.4 * Math.sin(pulseVal * Math.PI * 2);
                } else {
                    ctx.shadowBlur = 3;
                    ctx.globalAlpha = 0.45;
                }
                ctx.fillStyle = color;
                ctx.font = `bold ${T * 0.72}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(PIECES[p.color][p.type], c * T + T / 2, r * T + T / 2);
                ctx.restore();
            }
        }
    }

    // 6. Coordinates on board border
    ctx.save();
    ctx.font = '8px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 8; i++) {
        ctx.fillText(String.fromCharCode(65 + i), i * T + 5, canvas.height - 3);
        ctx.fillText(8 - i, 3, i * T + 11);
    }
    ctx.restore();

    // 7. Victory Screen Particles & Banner
    if (winner) {
        drawParticles();
        const winName = winner === 'white' ? playerWhite : playerBlack;
        const fontSize = 34 + 8 * Math.sin(pulseVal * Math.PI * 2);
        ctx.save();
        ctx.shadowBlur = 24;
        ctx.shadowColor = winner === 'white' ? primaryColor : secondaryColor;
        ctx.fillStyle = winner === 'white' ? primaryColor : secondaryColor;
        ctx.font = `bold ${fontSize}px 'Segoe UI', Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`VICTORY: ${winName.toUpperCase()}`, canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }

    requestAnimationFrame(draw);
}

// ==============================================
// 23. GAME INIT & TIMERS (PRESERVED)
// ==============================================
function initGame(startColor = 'white') {
    overlay.style.display = 'none';
    restartBtn.style.display = 'inline-block';
    lastSelectedStartColor = startColor;

    canvas.width = Math.min(window.innerWidth - 24, 580);
    canvas.height = canvas.width;

    resetGameLogic(startColor);

    if (overdriveEnabled && overdriveDeck) {
        overdriveDeck.style.display = 'block';
    }

    logSystem(`OPERATOR: ${playerWhite}/${playerBlack}`);
    logSystem(`NEURAL_LINK: ESTABLISHED [MODE: ${gameMode.toUpperCase()}]`);

    gameRunning = true;
    gameStartTime = Date.now();
    totalMovesPlayed = 0;
    historyStack = [];

    requestAnimationFrame(draw);

    if (gameMode === 'ai' && myPlayerColor === 'black') {
        triggerAiTurn();
    }
}

function resetGameLogic(startColor) {
    if (interval) clearInterval(interval);
    turn = startColor;
    selected = null;
    winner = null;
    timers = { white: 300, black: 300 };
    stats = { white: { collected: [] }, black: { collected: [] } };
    energyCores = { white: 50, black: 50 };
    shieldedPiece = null;
    empScanActive = false;
    historyStack = [];

    initBoard();
    updateUI();

    interval = setInterval(() => {
        if (gameRunning && !winner) {
            timers[turn]--;
            updateUI();
            if (timers[turn] <= 0) {
                gameRunning = false;
                winner = turn === 'white' ? 'black' : 'white';
                logSystem("CORE_FAILURE: TIMEOUT DEFEAT", true);
                initParticles();
                playVictorySound();
            }
        }
    }, 1000);
}

// ==============================================
// 24. COMBAT ANALYTICS & BATTLE DATA MODAL
// ==============================================
function showBattleReport() {
    if (!battleModal) return;
    const elapsedSecs = gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0;
    const mins = Math.floor(elapsedSecs / 60).toString().padStart(2, '0');
    const secs = (elapsedSecs % 60).toString().padStart(2, '0');
    const apm = elapsedSecs > 0 ? Math.round((totalMovesPlayed / (elapsedSecs / 60))) : 0;

    const totalCaps = stats.white.collected.length + stats.black.collected.length;

    document.getElementById('modal-moves').innerText = totalMovesPlayed;
    document.getElementById('modal-captures').innerText = totalCaps;
    document.getElementById('modal-apm').innerText = apm;
    document.getElementById('modal-duration').innerText = `${mins}:${secs}`;
    document.getElementById('modal-p1').innerText = playerWhite.toUpperCase();
    document.getElementById('modal-p2').innerText = playerBlack.toUpperCase();
    document.getElementById('modal-rewinds').innerText = rewindCount;

    const evalVal = evaluateBoardState();
    document.getElementById('modal-material').innerText = evalVal === 0 ? "BALANCED" : (evalVal > 0 ? `CYAN +${evalVal.toFixed(1)}` : `MAGENTA ${evalVal.toFixed(1)}`);

    const pgn = `[Event "Neo-Chess Simulation v2.0"]\n[White "${playerWhite}"]\n[Black "${playerBlack}"]\n[Mode "${gameMode.toUpperCase()}"]\n[Result "${winner ? winner.toUpperCase() + ' WON' : 'IN PROGRESS'}"]\n[Moves "${totalMovesPlayed}"]\n\n${stats.white.collected.length} White Captures: ${stats.white.collected.join(' ')}\n${stats.black.collected.length} Black Captures: ${stats.black.collected.join(' ')}`;
    const pgnArea = document.getElementById('pgn-textarea');
    if (pgnArea) pgnArea.value = pgn;

    battleModal.style.display = 'flex';
}

function closeBattleReport() {
    if (battleModal) battleModal.style.display = 'none';
}

function copyPgnRecord() {
    const pgnArea = document.getElementById('pgn-textarea');
    if (pgnArea) {
        pgnArea.select();
        navigator.clipboard.writeText(pgnArea.value).then(() => {
            logSystem("COMBAT_DATA: PGN COPIED TO CLIPBOARD");
        });
    }
}

// ==============================================
// 25. THEME SWITCHER
// ==============================================
const THEMES = ['neon', 'matrix', 'solar', 'void'];
function cycleTheme() {
    const currentIdx = THEMES.indexOf(currentTheme);
    currentTheme = THEMES[(currentIdx + 1) % THEMES.length];
    document.body.setAttribute('data-theme', currentTheme);
    if (themeToggleBtn) {
        themeToggleBtn.innerText = `THEME: ${currentTheme.toUpperCase()}`;
    }
    logSystem(`THEME_MATRIX: ENGAGED [${currentTheme.toUpperCase()}]`);
}

// ==============================================
// 26. CONTROLS & EVENT BINDINGS (PRESERVED)
// ==============================================
restartBtn.addEventListener('click', () => {
    resetGameLogic('white');
    gameRunning = true;
    winner = null;
    logSystem("SYSTEM_REBOOT: SESSION INITIALIZED");
});

if (undoBtn) undoBtn.onclick = chronoRewind;

if (radarBtn) {
    radarBtn.onclick = () => {
        radarActive = !radarActive;
        radarBtn.classList.toggle('active', radarActive);
        logSystem(`THREAT_RADAR: ${radarActive ? 'ACTIVATED' : 'DEACTIVATED'}`);
    };
}

if (dataBtn) dataBtn.onclick = showBattleReport;

if (sfxToggleBtn) {
    sfxToggleBtn.onclick = () => {
        sfxEnabled = !sfxEnabled;
        sfxToggleBtn.innerText = sfxEnabled ? "SFX: ON" : "SFX: OFF";
        sfxToggleBtn.classList.toggle('active', sfxEnabled);
    };
}

if (droneToggleBtn) droneToggleBtn.onclick = toggleDroneHum;
if (themeToggleBtn) themeToggleBtn.onclick = cycleTheme;

window.addEventListener('resize', () => {
    if (canvas) {
        canvas.width = Math.min(window.innerWidth - 24, 580);
        canvas.height = canvas.width;
    }
});

// Window startup (Preserved)
window.onload = setupIdentity;