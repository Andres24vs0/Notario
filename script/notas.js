import {
    obtenerSimbolos,
    crearEstructuraEvaluacion,
    porcentajeTotal,
    logicaErroresNotas,
    logicaErroresPorcentajes,
    logicaErroresGenerico,
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

    inputNotaMinima.addEventListener("input", (event) => {
        if (logicaErroresNotas(event.target, notaMaximaVacia, notaMaxima)) {
            notaMinima = event.target.value;
            console.log("Nota Minima: " + notaMinima);
        }
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
        resultado.innerHTML = "";
        const esValido = formularioValido();
        console.log(esValido);
        if (esValido) {
            calcularNotaFinal();
        }
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

    const nota = document.getElementById(`nota-${cantEvaluacion}`);
    nota.addEventListener("input", (event) => {
        logicaErroresNotas(event.target, notaMaximaVacia, notaMaxima);
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
            evaluacion.id = `evaluacion-${index + 1}`;
            const titulo = evaluacion.querySelector(".titulo-evaluacion h6");
            titulo.innerHTML = `Evaluacion #${index + 1}`;
            const botonEliminar = evaluacion.querySelector(
                ".titulo-evaluacion .eliminar"
            );
            botonEliminar.id = `eliminar-${index + 1}`;
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

function formularioValido() {
    let esValido = true;
    let esValidoNotaMaxima = logicaErroresGenerico(inputNotaMaxima);
    let esValidoNotaMinima = logicaErroresNotas(
        inputNotaMinima,
        notaMaximaVacia,
        notaMaxima
    );
    const porcentajes = document.querySelectorAll(".porcentaje");
    let esValidoPorcentajes = true;
    porcentajes.forEach((porcentaje) => {
        let temp = logicaErroresPorcentajes(porcentaje);
        if (!temp) {
            esValidoPorcentajes = false;
        }
    });
    if (esValidoPorcentajes) {
        if (porcentajeTotal() < 100) {
            porcentajes[0].setCustomValidity("Los porcentajes no suman 100%");
            porcentajes[0].reportValidity();
            esValidoPorcentajes = false;
        }
    }
    const notas = document.querySelectorAll(".nota-conseguida");
    let esValidoNotas = true;
    notas.forEach((nota) => {
        let temp = logicaErroresNotas(nota, notaMaximaVacia, notaMaxima);
        if (!temp) {
            esValidoNotas = false;
        }
    });
    if (
        !esValidoNotaMaxima ||
        !esValidoNotaMinima ||
        !esValidoPorcentajes ||
        !esValidoNotas
    ) {
        esValido = false;
    }
    return esValido;
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
