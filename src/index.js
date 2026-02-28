require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let memoria = 0;
let multiplicador = 1;

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

/**
 * POST /sumar-lista
 * Sirve para: Enviar un conjunto de datos para ser sumados.
 */
app.post('/sumar-lista', (req, res) => {
    const { numeros } = req.body;

    if (!Array.isArray(numeros)) {
        return res.status(400).json({ error: 'Debes enviar un arreglo de números bajo la clave "numeros"' });
    }

    const sumaTotal = numeros.reduce((acc, n) => acc + (parseFloat(n) || 0), 0);

    res.status(201).json({ 
        mensaje: "Operación de creación de suma realizada",
        resultado: sumaTotal 
    });
});

/**
 * PUT /memoria
 * Sirve para: Reemplazar o establecer un valor específico en un recurso existente.
 * En este caso, actualizamos el valor de la "memoria" global del servidor.
 */
app.put('/memoria', (req, res) => {
    const { nuevoValor } = req.body;

    if (nuevoValor === undefined || isNaN(parseFloat(nuevoValor))) {
        return res.status(400).json({ error: 'Debes proporcionar un "nuevoValor" numérico' });
    }

    memoria = parseFloat(nuevoValor);

    res.json({ 
        mensaje: "Memoria actualizada correctamente",
        valorEnMemoria: memoria 
    });
});

/**
 * GET /memoria (para verificar el PUT)
 */
app.get('/memoria', (req, res) => {
    res.json({ valorEnMemoria: memoria });
});

/**
 * POST /promedio
 * Sirve para: Calcular el promedio de un array de números.
 */
app.post('/promedio', (req, res) => {
    const { numeros } = req.body;

    if (!Array.isArray(numeros) || numeros.length === 0) {
        return res.status(400).json({ error: 'Debes enviar un arreglo no vacío de números bajo la clave "numeros"' });
    }

    const sumaTotal = numeros.reduce((acc, n) => acc + (parseFloat(n) || 0), 0);
    const promedio = sumaTotal / numeros.length;

    res.status(201).json({ 
        mensaje: "Promedio calculado correctamente",
        promedio: promedio,
        total: sumaTotal,
        cantidad: numeros.length
    });
});

/**
 * PUT /multiplicador
 * Sirve para: Establecer un valor multiplicador que afecta los resultados.
 */
app.put('/multiplicador', (req, res) => {
    const { valor } = req.body;

    if (valor === undefined || isNaN(parseFloat(valor))) {
        return res.status(400).json({ error: 'Debes proporcionar un "valor" numérico' });
    }

    multiplicador = parseFloat(valor);

    res.json({ 
        mensaje: "Multiplicador actualizado correctamente",
        multiplicadorActual: multiplicador 
    });
});

/**
 * GET /multiplicador (para verificar el PUT)
 */
app.get('/multiplicador', (req, res) => {
    res.json({ multiplicadorActual: multiplicador });
});

/**
 * PATCH /multiplicador
 * Sirve para: Hacer una actualización parcial del multiplicador.
 * En este ejemplo, sumamos un incremento al valor actual.
 */
app.patch('/multiplicador', (req, res) => {
    const { incremento } = req.body;

    if (incremento === undefined || isNaN(parseFloat(incremento))) {
        return res.status(400).json({ error: 'Debes proporcionar un incremento numérico' });
    }

    multiplicador += parseFloat(incremento);

    res.json({ 
        mensaje: "Multiplicador actualizado parcialmente",
        multiplicadorActual: multiplicador 
    });
});

/**
 * PATCH /memoria
 * Sumamos un valor a la memoria existente en lugar de reemplazarla
 */
app.patch('/memoria', (req, res) => {
    const { incremento } = req.body;

    if (incremento === undefined || isNaN(parseFloat(incremento))) {
        return res.status(400).json({ error: 'Debes proporcionar un incremento numérico' });
    }

    memoria += parseFloat(incremento);

    res.json({ 
        mensaje: "Memoria incrementada correctamente",
        valorActual: memoria 
    });
});

/**
 * DELETE /memoria
 */
app.delete('/memoria', (req, res) => {
    memoria = 0;
    res.json({ 
        mensaje: "Memoria limpiada correctamente",
        valorEnMemoria: memoria 
    });
});

/**
 * DELETE /multiplicador
 * Sí corresponde para este recurso: restablece el multiplicador a su valor original (1).
 */
app.delete('/multiplicador', (req, res) => {
    multiplicador = 1;
    res.json({ 
        mensaje: "Multiplicador restablecido a 1",
        multiplicadorActual: multiplicador 
    });
});

let miConstante = 0; 

// GET: Raíz Cuadrada
app.get('/raiz', (req, res) => {
    const numero = parseFloat(req.query.numero);
    if (isNaN(numero) || numero < 0) {
        return res.status(400).json({ error: 'Proporciona un número válido mayor o igual a 0' });
    }
    res.json({ resultado: Math.sqrt(numero) });
});

// POST: Potencia
app.post('/potencia', (req, res) => {
    const { base, exponente } = req.body;
    if (base === undefined || exponente === undefined || isNaN(base) || isNaN(exponente)) {
        return res.status(400).json({ error: 'Proporciona base y exponente numéricos' });
    }
    res.status(201).json({ 
        mensaje: "Potencia calculada correctamente",
        resultado: Math.pow(parseFloat(base), parseFloat(exponente)) 
    });
});

// PUT: Actualizar Constante Completa
app.put('/constante', (req, res) => {
    const { valor } = req.body;
    if (valor === undefined || isNaN(parseFloat(valor))) {
        return res.status(400).json({ error: 'Proporciona un "valor" numérico' });
    }
    miConstante = parseFloat(valor);
    res.json({ 
        mensaje: "Constante guardada (PUT) correctamente",
        valorConstante: miConstante 
    });
});

// PATCH: Modificar Constante Parcialmente (Sumar)
app.patch('/constante', (req, res) => {
    const { incremento } = req.body;
    if (incremento === undefined || isNaN(parseFloat(incremento))) {
        return res.status(400).json({ error: 'Proporciona un "incremento" numérico' });
    }
    miConstante += parseFloat(incremento);
    res.json({ 
        mensaje: "Constante incrementada (PATCH) correctamente",
        valorConstante: miConstante 
    });
});

// DELETE: Borrar Constante
app.delete('/constante', (req, res) => {
    miConstante = 0;
    res.json({ 
        mensaje: "Constante limpiada (regresada a 0)",
        valorConstante: miConstante 
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});