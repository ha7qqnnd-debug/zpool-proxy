const WebSocket = require('ws');
const net = require('net');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
    // الاتصال بسيرفر ZPool
    const stratum = net.connect(7019, 'minotaurx.na.mine.zpool.ca', () => {});

    ws.on('message', (msg) => {
        try {
            stratum.write(msg + '\n');
        } catch (e) {}
    });

    stratum.on('data', (data) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(data.toString());
        }
    });

    ws.on('close', () => stratum.destroy());
    stratum.on('close', () => ws.close());
    stratum.on('error', () => ws.close());
});

console.log('Proxy running on port ' + PORT);
