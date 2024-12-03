const express = require('express');
const fs = require('fs');
const router = express.Router();
const filePath = './src/data/products.json';

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
    console.log('Archivo products.json creado');
}

const readProducts = () => JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const writeProducts = (products) => fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

router.get('/', (req, res) => {
    try {
        const products = readProducts();
        res.json(products);
    } catch (error) {
        console.error('Error al leer productos:', error);
        res.status(500).json({ message: 'Error al leer los productos' });
    }
});

router.get('/:pid', (req, res) => {
    try {
        const products = readProducts();
        const product = products.find(p => p.id === parseInt(req.params.pid));
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        console.error('Error al leer producto:', error);
        res.status(500).json({ message: 'Error al leer el producto' });
    }
});

router.post('/', (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !price || !stock || !category) {
            return res.status(400).json({ message: 'Todos los campos obligatorios deben estar presentes' });
        }

        const products = readProducts();
        const newProduct = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            title,
            description: description || '',
            code: code || '',
            price,
            stock,
            category,
            thumbnails: thumbnails || [],
            status: true,
        };

        products.push(newProduct);
        writeProducts(products);

        req.io.emit('updateProducts', products);

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
});

router.delete('/:pid', (req, res) => {
    try {
        const products = readProducts();
        const filteredProducts = products.filter(p => p.id !== parseInt(req.params.pid));

        if (products.length === filteredProducts.length) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        writeProducts(filteredProducts);

        req.io.emit('updateProducts', filteredProducts);

        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});

module.exports = router;