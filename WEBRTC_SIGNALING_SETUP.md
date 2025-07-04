# Servidor de Señalización WebRTC para Streaming P2P

## Implementación Necesaria

Para que el componente `WebRTCVideoPlayer` funcione correctamente, necesitas implementar un servidor de señalización. Aquí tienes las opciones:

### Opción 1: Servidor Simple con Socket.IO

```javascript
// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map(); // hash -> Set de socket IDs

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Anunciar interés en un archivo
  socket.on('announce', (data) => {
    const { hash, peerId } = data;
    
    if (!rooms.has(hash)) {
      rooms.set(hash, new Set());
    }
    
    rooms.get(hash).add(socket.id);
    socket.join(hash);
    
    // Enviar lista de peers existentes
    const peers = Array.from(rooms.get(hash)).filter(id => id !== socket.id);
    socket.emit('peer-list', { peers });
    
    // Notificar a otros peers sobre el nuevo peer
    socket.to(hash).emit('new-peer', { peerId: socket.id });
  });

  // Reenviar offers
  socket.on('offer', (data) => {
    socket.to(data.targetPeer).emit('offer', {
      ...data,
      fromPeer: socket.id
    });
  });

  // Reenviar answers
  socket.on('answer', (data) => {
    socket.to(data.targetPeer).emit('answer', {
      ...data,
      fromPeer: socket.id
    });
  });

  // Reenviar candidatos ICE
  socket.on('ice-candidate', (data) => {
    socket.to(data.targetPeer).emit('ice-candidate', {
      ...data,
      fromPeer: socket.id
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    // Limpiar de todas las rooms
    rooms.forEach((peers, hash) => {
      if (peers.has(socket.id)) {
        peers.delete(socket.id);
        if (peers.size === 0) {
          rooms.delete(hash);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor de señalización ejecutándose en puerto ${PORT}`);
});
```

### Opción 2: Usar Servicios Existentes

#### PeerJS (Recomendado para desarrollo)
```javascript
// Usar el servidor público de PeerJS
const SIGNALING_CONFIG = {
  host: 'peerjs-server.herokuapp.com',
  port: 443,
  path: '/myapp',
  secure: true
};
```

#### Socket.IO como servicio
```javascript
// Usar servicios como Railway, Heroku, etc.
const SIGNALING_URL = 'wss://tu-servidor-signaling.railway.app';
```

### Opción 3: WebSocket Nativo

```javascript
// signaling-server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const rooms = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'announce':
          handleAnnounce(ws, message);
          break;
        case 'offer':
        case 'answer':
        case 'ice-candidate':
          relayMessage(ws, message);
          break;
      }
    } catch (error) {
      console.error('Error procesando mensaje:', error);
    }
  });

  ws.on('close', () => {
    // Limpiar conexión
    cleanupConnection(ws);
  });
});

function handleAnnounce(ws, message) {
  const { hash } = message;
  
  if (!rooms.has(hash)) {
    rooms.set(hash, new Set());
  }
  
  ws.hash = hash;
  rooms.get(hash).add(ws);
  
  // Enviar peers existentes
  const peers = Array.from(rooms.get(hash))
    .filter(peer => peer !== ws)
    .map(peer => peer.id || Math.random().toString(36));
    
  ws.send(JSON.stringify({
    type: 'peer-list',
    peers
  }));
}

function relayMessage(ws, message) {
  const room = rooms.get(ws.hash);
  if (!room) return;
  
  room.forEach(peer => {
    if (peer !== ws && peer.readyState === WebSocket.OPEN) {
      peer.send(JSON.stringify({
        ...message,
        fromPeer: ws.id || Math.random().toString(36)
      }));
    }
  });
}

function cleanupConnection(ws) {
  if (ws.hash && rooms.has(ws.hash)) {
    rooms.get(ws.hash).delete(ws);
    if (rooms.get(ws.hash).size === 0) {
      rooms.delete(ws.hash);
    }
  }
}

console.log('Servidor WebSocket ejecutándose en puerto 8080');
```

## Configuración en el Cliente

Actualiza la configuración del cliente:

```typescript
// En WebRTCVideoPlayer.tsx
const SIGNALING_CONFIG = {
  // Para desarrollo local
  url: 'ws://localhost:8080',
  
  // Para producción
  // url: 'wss://tu-servidor.herokuapp.com',
  
  // Timeout de conexión
  timeout: 10000,
  
  // Reintentos automáticos
  retries: 3
};
```

## Limitaciones Actuales

### 1. **Servidor de Señalización Requerido**
- El componente actual asume un servidor de señalización en `wss://signaling-server.example.com`
- Necesitas implementar uno de los servidores anteriores

### 2. **Descubrimiento de Peers**
- La implementación actual es básica
- En producción necesitarías DHT o trackers

### 3. **Manejo de Chunks**
- La lógica de chunks está simplificada
- Falta validación de integridad y reordenamiento

## Pasos para Implementar

1. **Implementar el servidor de señalización**
2. **Configurar la URL del servidor en el cliente**
3. **Probar con múltiples pestañas del navegador**
4. **Añadir manejo de errores robusto**
5. **Implementar caché de chunks para mejor performance**

## Ventajas sobre WebTorrent

- ✅ Control total sobre el protocolo
- ✅ Mejor performance (sin overhead de WebTorrent)
- ✅ Streaming más eficiente
- ✅ Menos dependencias

## Desventajas

- ❌ Requiere servidor de señalización
- ❌ Más código para mantener
- ❌ Menos peers disponibles inicialmente
- ❌ Implementación más compleja
