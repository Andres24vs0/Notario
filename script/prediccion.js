/*
            <h2 class="texto-resultado">Aún no se ha calculado <b>NINGUNA</b> predicción, <br> Ingrese los datos y presione <b>CALCULAR</b></h2>
            <h2 class="texto-resultado imposible">Ya <em>NO</em> existe forma de que apruebes la materia</h2>
            <h2 class="texto-resultado">La nota <b>MÍNIMA</b> que debes de sacar en la evaluación<br>para aprobar la materia es <b>15</b><br>Y tu nota final sería <b>10.1</b> que redondeado seria <b>10</b></h2>
*/
import {
    obtenerSimbolos,
    crearEstructuraEvaluacion,
    porcentajeTotal,
    logicaErroresNotas,
    logicaErroresPorcentajes,
    logicaErroresGenerico,
} from "./index.js";

//Nota Maxima
let notaMaximaVacia;
let notaMaxima;
let inputNotaMaxima;
let inputNotaMinima;

// Evaluaciones realizadas
let zonaRealizadas;
let cantEvaluacionesRealizadas;

// Evaluaciones futuras
let zonaFuturas;
let selectFuturas;
let seleccionActual;

//Agregar y eliminar evaluaciones realizadas
let botonAgregar;

function inicializarPrediccion() {
    //nota maxima y minima
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

    //Inicializacion evaluaciones realizadas
    zonaRealizadas = document.getElementById("zona-realizadas");
    cantEvaluacionesRealizadas = 0;

    for (let i = 0; i < 3; i++) {
        agregarEvaluacion();
    }

    //Inicializacion evaluaciones futuras
    zonaFuturas = document.getElementById("zona-futuras");
    selectFuturas = document.getElementById("numero-evaluaciones");
    seleccionActual = 0;
    logicaEvaluacionFutura();
    selectFuturas.addEventListener("change", () => {
        logicaEvaluacionFutura();
    });

    //Inicializacion de agregar y eliminar
    botonAgregar = document.getElementById("agregar");
    botonAgregar.innerHTML = obtenerSimbolos("agregar");

    botonAgregar.addEventListener("click", () => {
        logicaAgregar();
    });
}
window.inicializarPrediccion = inicializarPrediccion;

function agregarEvaluacion() {
    cantEvaluacionesRealizadas++;
    const evaluacion = crearEstructuraEvaluacion(cantEvaluacionesRealizadas);
    zonaRealizadas.insertAdjacentHTML("beforeend", evaluacion);

    const botonEliminar = document.getElementById(
        `eliminar-${cantEvaluacionesRealizadas}`
    );
    botonEliminar.addEventListener("click", (event) => {
        logicaEliminar(event);
    });

    const porcentaje = document.getElementById(
        `porcentaje-${cantEvaluacionesRealizadas}`
    );
    porcentaje.addEventListener("input", (event) => {
        logicaErroresPorcentajes(event.target);
    });

    const nota = document.getElementById(`nota-${cantEvaluacionesRealizadas}`);
    nota.addEventListener("input", (event) => {
        logicaErroresNotas(event.target, notaMaximaVacia, notaMaxima);
    });
}

function agregarEvaluacionFutura(numero) {
    const evaluacion = CrearEstructuraEvaluacionFutura(numero);
    zonaFuturas.insertAdjacentHTML("beforeend", evaluacion);

    const porcentaje = document.getElementById(`porcentaje-futuro-${numero}`);
    porcentaje.addEventListener("input", (event) => {
        logicaErroresPorcentajes(event.target);
    });
}

function eliminarEvaluacionFutura(numero) {
    const evaluacionAEliminar = document.getElementById(
        "evaluacion-futura-" + numero
    );
    if (evaluacionAEliminar) {
        evaluacionAEliminar.remove();
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

function logicaEvaluacionFutura() {
    let valorReal = selectFuturas.value;
    let diferencia = valorReal - seleccionActual;

    if (diferencia > 0) {
        for (let i = parseInt(seleccionActual); i < valorReal; i++) {
            agregarEvaluacionFutura(i + 1);
        }
    }
    if (diferencia < 0) {
        for (let i = parseInt(seleccionActual); i > valorReal; i--) {
            eliminarEvaluacionFutura(i);
        }
    }
    seleccionActual = valorReal;
    console.log("Cantidad de evaluaciones futuras: " + seleccionActual);
}

function logicaEliminar(event) {
    if (cantEvaluacionesRealizadas <= 2) {
        alert("Debe haber al menos dos evaluaciones.");
    } else {
        const evaluacion = event.target.closest(".evaluacion");
        zonaRealizadas.removeChild(evaluacion);
        cantEvaluacionesRealizadas--;
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

function CrearEstructuraEvaluacionFutura(numero) {
    let evaluacion = `
                    <div class="evaluacion-futura" id="evaluacion-futura-${numero}">
                        <div class="titulo-evaluacion">
                            <h6>Evaluacion Futura #${numero}</h6>
                        </div>
                        <div class="inputs-futuro">
                            <div class="input-porcentaje">
                                <div class="label-input">
                                    <label for="porcentaje-futuro-${numero}">Porcentaje:</label>
                                    <input type="number" id="porcentaje-futuro-${numero}" name="porcentaje-futuro-${numero}" class="porcentaje" placeholder="20" min="1" max="99" required>
                                </div>
                                <p class="porcentaje-texto">%</p>
                            </div>
                        </div>
                    </div>`;
    return evaluacion;
}
