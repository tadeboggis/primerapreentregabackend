const express = require('express');
const fs = require('fs');
const router = express.Router();
const cartsFilePath = './src/data/carts.json';
const productsFilePath = './src/data/products.json';

if (!fs.existsSync(cartsFilePath)) {
    fs.writeFileSync(cartsFilePath, JSON.stringify([]));
    console.log('Archivo carts.json creado');
}

router.post('/', (req, res) => {
    try {
        const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
        const newCart = {
            id: carts.length ? carts[carts.length - 1].id + 1 : 1,
            products: []
        };
        carts.push(newCart);
        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).json({ message: 'Error al crear el carrito' });
    }
});

router.get('/:cid', (req, res) => {
    try {
        const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
        const cart = carts.find(c => c.id === parseInt(req.params.cid));
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
        res.json(cart.products);
    } catch (error) {
        console.error('Error al leer carrito:', error);
        res.status(500).json({ message: 'Error al leer el carrito' });
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    try {
        const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
        const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        const cart = carts.find(c => c.id === parseInt(req.params.cid));
        const product = products.find(p => p.id === parseInt(req.params.pid));

        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        const existingProduct = cart.products.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ id: product.id, quantity: 1 });
        }

        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error al agregar producto al carrito' });
    }
});

module.exports = router;