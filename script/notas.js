import {
    obtenerSimbolos,
    crearEstructuraEvaluacion,
    porcentajeTotal,
    logicaErroresNotas,
    logicaErroresPorcentajes,
    logicaErroresGenerico,
    formularioValido,
    logicaEliminarConcreto,
    avanzarInput,
} from "./index.js";

let zonaNotas;

//Nota máxima y mínima
let inputNotaMaxima;
let inputNotaMinima;
let notaMaxima;
let notaMinima;
let notaMaximaVacia;

//Agregar y eliminar
let cantEvaluacion;
let simboloAgregar;
let botonAgregar;

//Calcular
let botonCalcular;
let resultado;

function inicializarNotas() {
    zonaNotas = document.getElementById("inputs-notas");

    //Inicializar nota máxima y mínima
    inputNotaMaxima = document.getElementById("nota-maxima");
    inputNotaMinima = document.getElementById("nota-minima");
    notaMaximaVacia = true;

    inputNotaMaxima.addEventListener("input", (event) => {
        if (!logicaErroresGenerico(event.target)) {
            notaMaximaVacia = true;
        } else {
            notaMaximaVacia = false;
            notaMaxima = event.target.value;
            console.log("Nota Maxima: " + notaMaxima);
        }
    });

    inputNotaMaxima.addEventListener("keydown", (event) => {
        avanzarInput(event, logicaBotonCalcular);
    });

    inputNotaMinima.addEventListener("input", (event) => {
        if (logicaErroresNotas(event.target, notaMaximaVacia, notaMaxima)) {
            notaMinima = event.target.value;
            console.log("Nota Minima: " + notaMinima);
        }
    });

    inputNotaMinima.addEventListener("keydown", (event) => {
        avanzarInput(event, logicaBotonCalcular);
    });

    //Inicializar agregar y eliminar
    cantEvaluacion = 0;
    simboloAgregar = obtenerSimbolos("agregar");
    botonAgregar = document.getElementById("agregar");
    botonAgregar.innerHTML = simboloAgregar;

    botonAgregar.addEventListener("click", () => {
        logicaAgregar();
    });

    for (let i = 1; i < 4; i++) {
        agregarEvaluacion();
    }

    //Inicializar Calcular
    botonCalcular = document.getElementById("calcular-nota");
    resultado = document.getElementById("resultado-nota");

    botonCalcular.addEventListener("click", () => {
        logicaBotonCalcular();
    });
}
window.inicializarNotas = inicializarNotas;

function crearEstructuraResultado(
    notaFinal,
    notaRedondeada,
    aprobadoFinal,
    aprobadoRedondeado
) {
    let resultado;
    if (notaRedondeada === null) {
        resultado = `<h3 id="nota-final">Tu nota es <b>${notaFinal}</b></h3>`;
    } else {
        resultado = `<h3 id="nota-final">Tu nota es <b>${notaFinal}</b> que redondeado sería <b>${notaRedondeada}</b></h3>`;
    }
    if (aprobadoFinal && aprobadoRedondeado) {
        resultado += `<h3 class="texto-aprobado">HAS APROBADO</h3>`;
    } else if (!aprobadoFinal && !aprobadoRedondeado) {
        resultado += `<h3 class="texto-reprobado">HAS REPROBADO</h3>`;
    } else if (!aprobadoFinal && aprobadoRedondeado) {
        resultado += `<h3 class="texto-aprobado">SI LA NOTA SE REDONDEA HAS APROBADO</h3>
        <h3 class="texto-reprobado">SI LA NOTA NO SE REDONDEA HAS REPROBADO</h3>`;
    } else if (aprobadoFinal && !aprobadoRedondeado) {
        resultado += `<h3 class="texto-aprobado">SI LA NOTA NO SE REDONDEA HAS APROBADO</h3>
        <h3 class="texto-reprobado">SI LA NOTA SE REDONDEA HAS REPROBADO</h3>`;
    }
    return resultado;
}

function agregarEvaluacion() {
    cantEvaluacion++;
    const nuevaEvaluacion = crearEstructuraEvaluacion(cantEvaluacion);
    zonaNotas.insertAdjacentHTML("beforeend", nuevaEvaluacion);

    const botonEliminar = document.getElementById(`eliminar-${cantEvaluacion}`);
    botonEliminar.addEventListener("click", (event) => {
        logicaEliminar(event);
    });

    const porcentaje = document.getElementById(`porcentaje-${cantEvaluacion}`);
    porcentaje.addEventListener("input", (event) => {
        logicaErroresPorcentajes(event.target);
    });

    porcentaje.addEventListener("keydown", (event) => {
        avanzarInput(event, logicaBotonCalcular);
    });

    const nota = document.getElementById(`nota-${cantEvaluacion}`);
    nota.addEventListener("input", (event) => {
        logicaErroresNotas(event.target, notaMaximaVacia, notaMaxima);
    });

    nota.addEventListener("keydown", (event) => {
        avanzarInput(event, logicaBotonCalcular);
    });
}

function logicaEliminar(event) {
    if (cantEvaluacion <= 2) {
        alert("Debe haber al menos dos evaluaciones.");
    } else {
        const evaluacion = event.target.closest(".evaluacion");
        zonaNotas.removeChild(evaluacion);
        cantEvaluacion--;
        const evaluacionesRestantes = document.querySelectorAll(".evaluacion");
        evaluacionesRestantes.forEach((evaluacion, index) => {
            logicaEliminarConcreto(evaluacion, index);
        });
    }
}

function logicaAgregar() {
    const cantidad = porcentajeTotal();
    console.log("Porcentaje por ahora: " + cantidad);
    if (cantidad === 100) {
        alert(
            "Los porcentajes que has ingresado ya suman el 100%, no puedes agregar más evaluaciones."
        );
    } else if (cantidad > 100) {
        alert(
            "Los porcentajes que has ingresado ya suman mas del 100%, no puedes agregar más evaluaciones y no vas a poder calcular el resultado final a menos que lo arregles."
        );
    } else {
        agregarEvaluacion();
    }
}

function logicaBotonCalcular() {
    resultado.innerHTML = "";
    const esValido = formularioValido(
        inputNotaMaxima,
        inputNotaMinima,
        notaMaximaVacia,
        notaMaxima
    );
    console.log(esValido);
    if (esValido) {
        calcularNotaFinal();
        resultado.scrollIntoView({ behavior: "smooth" });
    }
}

function calcularNotaFinal() {
    const porcentajes = document.querySelectorAll(".porcentaje");
    const notas = document.querySelectorAll(".nota-conseguida");
    let notaFinal = 0;
    for (let i = 0; i < cantEvaluacion; i++) {
        const porcentaje = parseFloat(porcentajes[i].value);
        const nota = parseFloat(notas[i].value);
        if (!isNaN(porcentaje) && !isNaN(nota)) {
            notaFinal += (porcentaje / 100) * nota;
        }
    }
    notaFinal = parseFloat(notaFinal.toFixed(2));
    let notaRedondeada = Math.round(notaFinal);
    const aprobadoFinal = notaFinal >= parseFloat(notaMinima);
    const aprobadoRedondeado = notaRedondeada >= parseFloat(notaMinima);

    if (notaFinal === notaRedondeada) {
        notaRedondeada = null;
    }

    resultado.innerHTML = crearEstructuraResultado(
        notaFinal,
        notaRedondeada,
        aprobadoFinal,
        aprobadoRedondeado
    );
}
