const express = require('express');
const app = express();
const productsRouter = require('./src/routes/products');
const cartsRouter = require('./src/routes/carts');

app.use(express.json());
console.log('Registrando ruta /api/products');
app.use('/api/products', productsRouter);

console.log('Registrando ruta /api/carts');
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    res.send('¡Servidor funcionando!');
});

app.listen(8080, () => {
    console.log('Servidor escuchando en el puerto 8080');
});