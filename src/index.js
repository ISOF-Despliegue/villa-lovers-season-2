require('dotenv').config();

const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

function validarNumeros(num1, num2) {
    const numero1 = parseFloat(num1);
    const numero2 = parseFloat(num2);

    if (isNaN(numero1) || isNaN(numero2)) {
        return { error: 'Los valores deben ser números' };
    }

    return { numero1, numero2 };
}

// SUMA
app.get('/suma', (req, res) => {
    const { numero1, numero2, error } = validarNumeros(req.query.num1, req.query.num2);

    if (error) return res.status(400).json({ error });

    res.json({ resultado: numero1 + numero2 });
});

// RESTA
app.get('/resta', (req, res) => {
    const { numero1, numero2, error } = validarNumeros(req.query.num1, req.query.num2);

    if (error) return res.status(400).json({ error });

    res.json({ resultado: numero1 - numero2 });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});