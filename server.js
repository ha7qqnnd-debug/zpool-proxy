const WebSocket = require('ws');
const net = require('net');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

const WALLET = "DRXavkypCRMbk4cZA9qLSdMZvxPqF52YVu";
const WORKER = "yoy";

wss.on('connection', (ws) => {
    const stratum = net.connect(7019, 'minotaurx.na.mine.zpool.ca', () => {
        const sub = JSON.stringify({ id: 1, method: "mining.subscribe", params: ["yoy-agent"] }) + '\n';
        const auth = JSON.stringify({ id: 2, method: "mining.authorize", params: [WALLET + "." + WORKER, "c=DOGE"] }) + '\n';
        
        stratum.write(sub);
        stratum.write(auth);
    });

    ws.on('message', (msg) => stratum.write(msg + '\n'));
    stratum.on('data', (data) => {
        if (ws.readyState === WebSocket.OPEN) ws.send(data.toString());
    });

    ws.on('close', () => stratum.destroy());
    stratum.on('close', () => ws.close());
    stratum.on('error', () => ws.close());
});

console.log('Proxy running on port ' + PORT);
