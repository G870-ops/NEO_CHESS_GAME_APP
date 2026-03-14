const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const p1Timer = document.getElementById('p1-timer');
const p2Timer = document.getElementById('p2-timer');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const p1Captured = document.getElementById('p1-captured');
const p2Captured = document.getElementById('p2-captured');

let turn = 'white';
let selected = null;
let gameRunning = false;
let timers = { white: 300, black: 300 };
let interval = null;
let pulseOpacity = 0;
let pulseDirection = 1;
let winner = null;
let lastSelectedStartColor = 'white'; // Remembers who started for reboots

let stats = {
    white: { collected: [], lost: 0 },
    black: { collected: [], lost: 0 }
};

const PIECES = {
    white: { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' },
    black: { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' }
};

function initBoard() {
    window.board = Array(8).fill(null).map(() => Array(8).fill(null));
    const layout = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    for (let i = 0; i < 8; i++) {
        board[0][i] = { type: layout[i], color: 'black' };
        board[1][i] = { type: 'p', color: 'black' };
        board[6][i] = { type: 'p', color: 'white' };
        board[7][i] = { type: layout[i], color: 'white' };
    }
}

function isLegalMove(piece, fromR, fromC, toR, toC) {
    const target = board[toR][toC];
    if (target && target.color === piece.color) return false;
    const rowDiff = toR - fromR;
    const colDiff = Math.abs(toC - fromC);

    if (piece.type === 'p') {
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        if (colDiff === 0 && !target && rowDiff === direction) return true;
        if (colDiff === 0 && !target && fromR === startRow && rowDiff === 2 * direction) {
            return !board[fromR + direction][fromC];
        }
        if (colDiff === 1 && target && rowDiff === direction) return true;
        return false;
    }
    return true;
}

function logSystem(message, isCritical = false) {
    const terminal = document.getElementById('log-terminal');
    if (!terminal) return;
    const newLine = document.createElement('div');
    newLine.className = 'log-line';
    if (isCritical) newLine.style.color = "#ff0055";
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    newLine.innerText = `[${timeStr}] ${message.toUpperCase()}`;
    terminal.prepend(newLine);
}

function showBattleReport() {
    const report = `
        --- NEURAL BATTLE REPORT ---
        WINNER: ${winner ? winner.toUpperCase() : "UNDEFINED"}

        WHITE COLLECTED: ${stats.white.collected.length}
        BLACK COLLECTED: ${stats.black.collected.length}
        ---------------------------
    `;
    alert(report);
}

function startChanceTimer() {
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
        if (!gameRunning) return;
        timers[turn]--;
        updateUI();
        if (timers[turn] <= 0) endGame(turn === 'white' ? 'black' : 'white', "TIMEOUT");
    }, 1000);
}

function updateUI() {
    const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
    p1Timer.innerHTML = `WHITE: ${fmt(timers.white)} ${winner === 'white' ? '🏆' : ''}`;
    p2Timer.innerHTML = `BLACK: ${fmt(timers.black)} ${winner === 'black' ? '🏆' : ''}`;

    p1Captured.innerHTML = stats.white.collected.join(' ');
    p2Captured.innerHTML = stats.black.collected.join(' ');

    p1Timer.className = turn === 'white' ? 'timer active-white' : 'timer';
    p2Timer.className = turn === 'black' ? 'timer active-black' : 'timer';

    if (gameRunning) {
        statusText.innerText = `${turn.toUpperCase()}'S CHANCE`;
        statusText.style.color = turn === 'white' ? '#00f2ff' : '#ff00ff';
    }
}

function endGame(winSide, reason) {
    gameRunning = false;
    winner = winSide;
    clearInterval(interval);
    statusText.innerText = `VICTORY: ${winner.toUpperCase()}`;
    logSystem(`SYSTEM: ${reason}`, true);
    updateUI();
    setTimeout(showBattleReport, 1000);
}

function draw() {
    const TILE = canvas.width / 8;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pulseOpacity += 0.02 * pulseDirection;
    if (pulseOpacity > 1 || pulseOpacity < 0.4) pulseDirection *= -1;

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#050508' : '#0a0a15';
            ctx.fillRect(c * TILE, r * TILE, TILE, TILE);
            const p = board[r][c];
            if (p) {
                const color = p.color === 'white' ? '#00f2ff' : '#ff00ff';
                const isActive = (p.color === turn && gameRunning);
                ctx.save();
                ctx.shadowBlur = isActive ? 25 * pulseOpacity : 15;
                ctx.shadowColor = color;
                ctx.fillStyle = color;
                ctx.font = `bold ${TILE * 0.75}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.globalAlpha = isActive ? 0.8 : 0.6;
                ctx.fillText(PIECES[p.color][p.type], c * TILE + TILE / 2, r * TILE + TILE / 2);
                ctx.restore();
            }
            if (selected && selected.r === r && selected.c === c) {
                ctx.strokeStyle = '#00f2ff';
                ctx.lineWidth = 3;
                ctx.strokeRect(c * TILE + 5, r * TILE + 5, TILE - 10, TILE - 10);
            }
        }
    }
    requestAnimationFrame(draw);
}

canvas.addEventListener('mousedown', (e) => {
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    const TILE = canvas.width / 8;
    const c = Math.floor((e.clientX - rect.left) / TILE);
    const r = Math.floor((e.clientY - rect.top) / TILE);

    if (selected) {
        const piece = board[selected.r][selected.c];
        if (isLegalMove(piece, selected.r, selected.c, r, c)) {
            const target = board[r][c];
            if (target) {
                stats[piece.color].collected.push(PIECES[target.color][target.type]);
                stats[target.color].lost++;
                logSystem(`CAPTURED: ${target.type.toUpperCase()}`);
                if (target.type === 'k') {
                    board[r][c] = piece;
                    board[selected.r][selected.c] = null;
                    endGame(piece.color, "KING ELIMINATED");
                    return;
                }
            }
            board[r][c] = piece;
            board[selected.r][selected.c] = null;
            turn = turn === 'white' ? 'black' : 'white';
            selected = null;
            updateUI();
        } else if (board[r][c] && board[r][c].color === turn) {
            selected = { r, c };
        }
    } else if (board[r][c] && board[r][c].color === turn) {
        selected = { r, c };
    }
});

function initGame(startColor = 'white') {
    document.getElementById('overlay').style.display = 'none';
    restartBtn.style.display = 'inline-block';
    lastSelectedStartColor = startColor;

    if(!document.getElementById('statsBtn')){
        const btn = document.createElement('button');
        btn.id = 'statsBtn';
        btn.innerText = 'VIEW DATA';
        btn.onclick = showBattleReport;
        btn.style = "background:transparent; border:1px solid #00f2ff; color:#00f2ff; font-family:monospace; margin-left:10px; cursor:pointer; font-size:10px; padding:5px;";
        restartBtn.parentNode.appendChild(btn);
    }
    canvas.width = Math.min(window.innerWidth - 30, 600);
    canvas.height = canvas.width;
    resetGameLogic(startColor);
    logSystem("AUTH: GOUTAM GUPTA");
    logSystem(`INIT: ${startColor.toUpperCase()} START`);
    gameRunning = true;
    requestAnimationFrame(draw);
}

function resetGame() {
    logSystem("SYSTEM REBOOT...");
    resetGameLogic(lastSelectedStartColor);
    gameRunning = true;
}

function resetGameLogic(startColor = 'white') {
    if (interval) clearInterval(interval);
    turn = startColor;
    selected = null;
    winner = null;
    timers = { white: 300, black: 300 };
    stats = { white: { collected: [], lost: 0 }, black: { collected: [], lost: 0 } };
    initBoard();
    startChanceTimer();
    updateUI();
}