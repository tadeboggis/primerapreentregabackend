const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const { create } = require('express-handlebars');
const productsRouter = require('./src/routes/products');
const cartsRouter = require('./src/routes/carts');
const path = require('path');
const fs = require('fs');

const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

const exphbs = create({});
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('updateProducts', (products) => {
        io.emit('updateProducts', products);
    });
});

app.use(express.static(path.join(__dirname, 'src/public')));

app.use('/api/products', (req, res, next) => {
    req.io = io;
    next();
}, productsRouter);

app.use('/api/carts', cartsRouter);

app.get('/home', (req, res) => {
    const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf-8'));
    res.render('home', { title: 'Inicio - Productos', products });
});

app.get('/realtimeproducts', (req, res) => {
    const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf-8'));
    res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
});

app.get('/', (req, res) => {
    res.render('home', { title: 'Inicio', message: '¡Servidor funcionando!' });
});

server.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080');
});