const WebSocket = require('ws');
const net = require('net');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
    const stratum = net.connect(7019, 'minotaurx.na.mine.zpool.ca', () => {});

    ws.on('message', (msg) => stratum.write(msg + '\n'));
    stratum.on('data', (data) => ws.send(data.toString()));

    ws.on('close', () => stratum.destroy());
    stratum.on('close', () => ws.close());
    stratum.on('error', () => ws.close());
});

console.log('Proxy running on port ' + PORT);
