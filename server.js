const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const Message = require('./models/Message');

// Nueva cadena de conexión de MongoDB Atlas
mongoose.connect('mongodb+srv://Yoka:5hC4O5y9vh9zEJZ9@yoka.ss9m9.mongodb.net/chat?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => {
    console.error('Error conectando a MongoDB Atlas:', err);
    process.exit(1);
});

// Manejo de errores de conexión
mongoose.connection.on('error', err => {
    console.error('Error de MongoDB:', err);
});

app.use(express.static('public'));

io.on('connection', async (socket) => {
    console.log('Un usuario se ha conectado');

    try {
        // Enviar mensajes anteriores cuando un usuario se conecta
        const mensajesAnteriores = await Message.find().sort({ timestamp: -1 }).limit(50);
        socket.emit('mensajes anteriores', mensajesAnteriores.reverse());
    } catch (error) {
        console.error('Error al obtener mensajes anteriores:', error);
        socket.emit('error', { message: 'Error al cargar mensajes' });
    }

    socket.on('chat message', async (data) => {
        try {
            const mensaje = new Message({
                mensaje: data.mensaje,
                usuario: data.usuario,
                hora: new Date().toLocaleTimeString()
            });

            await mensaje.save();
            io.emit('chat message', mensaje);
        } catch (error) {
            console.error('Error al guardar mensaje:', error);
            socket.emit('error', { message: 'Error al enviar mensaje' });
        }
    });

    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});