const socket = io();
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message');
const usernameInput = document.getElementById('username');

function enviarMensaje() {
    const mensaje = messageInput.value.trim();
    const usuario = usernameInput.value.trim() || 'Anónimo';
    
    if (mensaje) {
        socket.emit('chat message', { mensaje, usuario });
        messageInput.value = '';
    }
}

function mostrarMensaje(data) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    
    messageElement.innerHTML = `
        <div class="info">
            <strong>${data.usuario}</strong> - ${data.hora}
        </div>
        <div class="content">
            ${data.mensaje}
        </div>
    `;
    
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        enviarMensaje();
    }
});

// Recibir mensajes anteriores
socket.on('mensajes anteriores', (mensajes) => {
    mensajes.forEach(mensaje => mostrarMensaje(mensaje));
});

// Recibir nuevos mensajes
socket.on('chat message', (data) => {
    mostrarMensaje(data);
});