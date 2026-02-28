const API_URL = 'http://localhost:3000'; // URL del backend

//operaciones GET (Suma, Resta, Multiplicación, División)
async function operacionBasica(ruta) {
    const num1 = document.getElementById('n1').value;
    const num2 = document.getElementById('n2').value;

    const respuesta = await fetch(`${API_URL}/${ruta}?num1=${num1}&num2=${num2}`);
    const datos = await respuesta.json();
    mostrarEnPantalla(datos);
}

// operaciones de Lista POST (Sumar lista y Promedio)
async function operacionLista(ruta) {
    const input = document.getElementById('listaNumeros').value;
    // Convierte el texto "10, 20, 30" en un arreglo de números real [10, 20, 30]
    const numeros = input.split(',').map(n => n.trim()).filter(n => n !== "");

    const respuesta = await fetch(`${API_URL}/${ruta}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeros }) // Se envía el arreglo en el cuerpo de la petición
    });
    const datos = await respuesta.json();
    mostrarEnPantalla(datos);
}

// gestionar la Memoria (PUT, PATCH, DELETE)
async function gestionarMemoria(metodo) {
    const valor = document.getElementById('inputEstado').value;
    let cuerpoPeticion = null;

    if (metodo === 'PUT') cuerpoPeticion = { nuevoValor: valor };
    if (metodo === 'PATCH') cuerpoPeticion = { incremento: valor };

    const respuesta = await fetch(`${API_URL}/memoria`, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: cuerpoPeticion ? JSON.stringify(cuerpoPeticion) : null
    });

    const datos = await respuesta.json();
    document.getElementById('valMemoria').innerText = datos.valorEnMemoria !== undefined ? datos.valorEnMemoria : datos.valorActual;
    mostrarEnPantalla(datos);
}

// gestionar el Multiplicador (PUT, PATCH, DELETE)
async function gestionarMultiplicador(metodo) {
    const valor = document.getElementById('inputEstado').value;
    let cuerpoPeticion = null;

    if (metodo === 'PUT') cuerpoPeticion = { valor };
    if (metodo === 'PATCH') cuerpoPeticion = { incremento: valor };
    
    const respuesta = await fetch(`${API_URL}/multiplicador`, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: cuerpoPeticion ? JSON.stringify(cuerpoPeticion) : null
    });

    const datos = await respuesta.json();
    // Actualiza el indicador visual del multiplicador
    document.getElementById('valMulti').innerText = datos.multiplicadorActual;
    mostrarEnPantalla(datos);
}

// consultar el Multiplicador (GET manual)
async function consultarMultiplicador() {
    const respuesta = await fetch(`${API_URL}/multiplicador`, {
        method: 'GET'
    });

    const datos = await respuesta.json();
    document.getElementById('valMulti').innerText = datos.multiplicadorActual;
    mostrarEnPantalla({ resultado: datos.multiplicadorActual });
}

// mostrar los resultados en el HTML
function mostrarEnPantalla(datos) {
    const spanResultado = document.getElementById('resultado');
    
    if (datos.error) {
        alert("Error del servidor: " + datos.error);
        spanResultado.innerText = "Error";
    } else {
        // Prioriza mostrar 'resultado' o 'promedio', de lo contrario muestra un mensaje de éxito
        spanResultado.innerText = datos.resultado !== undefined ? datos.resultado : 
                                 datos.promedio !== undefined ? datos.promedio : "OK";
    }
}

// consulta el estado actual al abrir la página
window.onload = async () => {
    try {
        const resMem = await fetch(`${API_URL}/memoria`);
        const dataMem = await resMem.json();
        document.getElementById('valMemoria').innerText = dataMem.valorEnMemoria;

        const resMult = await fetch(`${API_URL}/multiplicador`);
        const dataMult = await resMult.json();
        document.getElementById('valMulti').innerText = dataMult.multiplicadorActual;
    } catch (err) {
        console.log("Error al conectar con el servidor:", err);
    }
};

async function calcularRaiz() {
    const num = document.getElementById('numRaiz').value;
    const respuesta = await fetch(`${API_URL}/raiz?numero=${num}`);
    const datos = await respuesta.json();
    mostrarEnPantalla(datos);
}

async function calcularPotencia() {
    const base = document.getElementById('numBase').value;
    const exponente = document.getElementById('numExp').value;
    
    const respuesta = await fetch(`${API_URL}/potencia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base: base, exponente: exponente })
    });
    const datos = await respuesta.json();
    mostrarEnPantalla(datos);
}

async function gestionarConstante(metodo) {
    const valorInput = document.getElementById('inputConstante').value;
    let cuerpoPeticion = null;

    if (metodo === 'PUT') cuerpoPeticion = { valor: valorInput };
    if (metodo === 'PATCH') cuerpoPeticion = { incremento: valorInput };
    
    const respuesta = await fetch(`${API_URL}/constante`, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: cuerpoPeticion ? JSON.stringify(cuerpoPeticion) : null
    });

    const datos = await respuesta.json();
    
    if (!datos.error) {
        document.getElementById('valConstante').innerText = datos.valorConstante;
    }
    
    const spanResultado = document.getElementById('resultado');
    if (datos.error) {
        alert("Error del servidor: " + datos.error);
        spanResultado.innerText = "Error";
    } else {
        spanResultado.innerText = datos.mensaje || datos.valorConstante;
    }
}