const express = require('express');
const fs = require('fs');
const router = express.Router();
const filePath = './src/data/products.json';

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
    console.log('Archivo products.json creado');
}

router.get('/', (req, res) => {
    console.log('GET /api/products solicitado');
    try {
        const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const limit = parseInt(req.query.limit) || products.length;
        res.json(products.slice(0, limit));
    } catch (error) {
        console.error('Error al leer productos:', error);
        res.status(500).json({ message: 'Error al leer los productos' });
    }
});

router.get('/:pid', (req, res) => {
    console.log(`GET /api/products/${req.params.pid} solicitado`);
    try {
        const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const product = products.find(p => p.id === parseInt(req.params.pid));
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        console.error('Error al leer producto:', error);
        res.status(500).json({ message: 'Error al leer el producto' });
    }
});

router.post('/', (req, res) => {
    console.log('POST /api/products solicitado');
    try {
        const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const newProduct = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            ...req.body,
            status: true,
        };
        products.push(newProduct);
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
});

router.put('/:pid', (req, res) => {
    console.log(`PUT /api/products/${req.params.pid} solicitado`);
    try {
        const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const productIndex = products.findIndex(p => p.id === parseInt(req.params.pid));
        if (productIndex === -1) return res.status(404).json({ message: 'Producto no encontrado' });
        products[productIndex] = { ...products[productIndex], ...req.body };
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
        res.json(products[productIndex]);
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', (req, res) => {
    console.log(`DELETE /api/products/${req.params.pid} solicitado`);
    try {
        const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const filteredProducts = products.filter(p => p.id !== parseInt(req.params.pid));
        if (products.length === filteredProducts.length) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        fs.writeFileSync(filePath, JSON.stringify(filteredProducts, null, 2));
        res.status(204).end();
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});

module.exports = router;