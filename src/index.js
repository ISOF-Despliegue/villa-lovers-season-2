require('dotenv').config();
const express = require('express');

const app = express();

// Detectar entorno
const isDev = process.env.NODE_ENV === 'development';

// Seleccionar puerto según entorno
const port = isDev
    ? process.env.DEV_PORT || 4000
    : process.env.PORT || 3000;

// Función para validar números
function validarNumeros(query) {
    const keys = Object.keys(query);

    if (keys.length !== 2) {
        return { error: 'La operación permite exactamente 2 números (num1 y num2)' };
    }

    if (!query.num1 || !query.num2) {
        return { error: 'Debes proporcionar num1 y num2' };
    }

    const numero1 = parseFloat(query.num1);
    const numero2 = parseFloat(query.num2);

    if (isNaN(numero1) || isNaN(numero2)) {
        return { error: 'Los valores proporcionados deben ser números' };
    }

    return { numero1, numero2 };
}

// SUMA
app.get('/suma', (req, res) => {
    const { numero1, numero2, error } = validarNumeros(req.query);
    if (error) return res.status(400).json({ error });

    res.json({ resultado: numero1 + numero2 });
});

// RESTA
app.get('/resta', (req, res) => {
    const { numero1, numero2, error } = validarNumeros(req.query);
    if (error) return res.status(400).json({ error });

    res.json({ resultado: numero1 - numero2 });
});

// MULTIPLICACIÓN
app.get('/multiplicacion', (req, res) => {
    const { numero1, numero2, error } = validarNumeros(req.query);
    if (error) return res.status(400).json({ error });

    res.json({ resultado: numero1 * numero2 });
});

// DIVISIÓN
app.get('/division', (req, res) => {
    const { numero1, numero2, error } = validarNumeros(req.query);
    if (error) return res.status(400).json({ error });

    if (numero2 === 0) {
        return res.status(400).json({ error: 'No se puede dividir entre 0' });
    }

    res.json({ resultado: numero1 / numero2 });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});