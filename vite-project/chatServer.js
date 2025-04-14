import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
console.log('WebSocket server initialized on port 8080');

const clients = new Set();

wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.add(ws);

  ws.on('message', (message) => {
    console.log('Received message:', message);
    try {
      const parsedMessage = JSON.parse(message);
      // Broadcast to all clients
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          console.log('Sending message to client');
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log('WebSocket server running on ws://localhost:8080');
