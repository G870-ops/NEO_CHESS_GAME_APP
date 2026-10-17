/**
 * NEO-CHESS Multiplayer Server
 * Author: Goutam Gupta
 * Version: 2.0 (5-Digit Room Code Matrix)
 */

const WebSocket = require('ws');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log(`===============================================`);
console.log(`NEO-CHESS SERVER RUNNING ON PORT ${PORT}...`);
console.log(`5-DIGIT ROOM CODE QUANTUM MATRIX ACTIVE`);
console.log(`===============================================`);

const rooms = {}; // { roomId: [player1, player2] }

wss.on('connection', (ws) => {

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            // Player joining a 5-digit room
            if (data.type === 'join') {
                const roomId = String(data.room).trim();
                ws.roomId = roomId;
                ws.playerName = data.playerName || 'OPERATOR';

                if (!rooms[roomId]) rooms[roomId] = [];
                const players = rooms[roomId];

                if (players.length < 2) {
                    players.push(ws);
                    ws.playerColor = players.length === 1 ? 'white' : 'black';
                    ws.send(JSON.stringify({ 
                        type: 'assignColor', 
                        color: ws.playerColor, 
                        room: roomId,
                        totalInRoom: players.length
                    }));
                    console.log(`[ROOM ${roomId}] Player joined: "${ws.playerName}" as ${ws.playerColor.toUpperCase()} (${players.length}/2)`);

                    // When 2nd player joins, start game on both devices!
                    if (players.length === 2) {
                        const p1 = players[0];
                        const p2 = players[1];
                        console.log(`[ROOM ${roomId}] Both players ready! Match initializing...`);

                        const readyPayload = JSON.stringify({
                            type: 'ready',
                            room: roomId,
                            white: p1.playerName || 'WHITE',
                            black: p2.playerName || 'BLACK'
                        });

                        p1.send(readyPayload);
                        p2.send(readyPayload);
                    }
                } else {
                    ws.send(JSON.stringify({ type: 'assignColor', color: null, room: roomId }));
                    ws.send(JSON.stringify({ type: 'message', text: 'Room is full! Maximum 2 players.' }));
                    console.log(`[ROOM ${roomId}] Rejected join attempt: Room Full!`);
                }
            }

            // Broadcast moves to opponent
            if (data.type === 'move' && ws.roomId) {
                const roomPlayers = rooms[ws.roomId] || [];
                roomPlayers.forEach(p => {
                    if (p !== ws && p.readyState === WebSocket.OPEN) {
                        p.send(JSON.stringify({ type: 'move', move: data.move }));
                    }
                });
            }

        } catch (err) {
            console.error("Invalid message received:", message);
        }
    });

    ws.on('close', () => {
        if (ws.roomId && rooms[ws.roomId]) {
            rooms[ws.roomId] = rooms[ws.roomId].filter(p => p !== ws);
            console.log(`Player disconnected from room ${ws.roomId}. Remaining: ${rooms[ws.roomId].length}`);

            // Notify other player that opponent disconnected
            rooms[ws.roomId].forEach(p => {
                if (p.readyState === WebSocket.OPEN) {
                    p.send(JSON.stringify({ type: 'message', text: 'Opponent disconnected from room!' }));
                }
            });

            if (rooms[ws.roomId].length === 0) {
                delete rooms[ws.roomId];
                console.log(`Room ${ws.roomId} purged from matrix.`);
            }
        }
    });

});