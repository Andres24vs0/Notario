/*
            <h2 id="texto-resultado">La nota <b>MÍNIMA</b> que debes de sacar en la evaluación<br>para aprobar la materia es <b>15</b><br>Y tu nota final sería <b>10.1</b> que redondeado seria <b>10</b><br><em class="imposible">Si no se redondea la nota final DESAPRUEBAS</em></h2>
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
let notaMinima;

// Evaluaciones realizadas
let zonaRealizadas;
let cantEvaluacionesRealizadas;

// Evaluaciones futuras
let zonaFuturas;
let selectFuturas;
let seleccionActual;

//Agregar y eliminar evaluaciones realizadas
let botonAgregar;

//resultados
let variosResultados;
let textoResultado;
let botonCalcular;

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

    //Inicializacion resultados
    textoResultado = document.getElementById("texto-resultado");
    variosResultados = document.getElementById("varios-resultados");
    botonCalcular = document.getElementById("calcular-nota");

    botonCalcular.addEventListener("click", () => {
        reiniciarResultados();
        logicaCalcularUnaNotaFutura();
    });

    reiniciarResultados();
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
    if (cantEvaluacionesRealizadas <= 1) {
        alert("Debe haber al menos una evaluacion.");
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

function logicaCalcularNotaActual() {}

function logicaCalcularUnaNotaFutura() {
    notaMinima = parseFloat(inputNotaMinima.value);
    let notaActual = 10;
    notaActual = parseFloat(notaActual.toFixed(2));
    let diferencia = notaMinima - notaActual;
    let texto;
    if (diferencia <= 0) {
        let notaRedondeada = Math.round(parseFloat(notaActual));
        texto = CrearEstructuraYaAprobado(notaActual, notaRedondeada);
    } else {
        const porcentaje =
            parseInt(document.getElementById("porcentaje-futuro-1").value) /
            100;
        let notaFutura = diferencia / porcentaje;
        notaFutura = Math.round(parseFloat(notaFutura));
        if (notaFutura > notaMaxima) {
            texto = CrearEstructuraDesaprobar();
            if (!textoResultado.classList.contains("imposible")) {
                textoResultado.classList.add("imposible");
            }
        } else {
            let equivalencia = parseFloat((notaFutura * porcentaje).toFixed(2));
            let notaFinal = notaActual + equivalencia;
            if (notaFinal < notaMinima) {
                notaFutura++;
                equivalencia = parseFloat((notaFutura * porcentaje).toFixed(2));
                notaFinal = notaActual + equivalencia;
            }
            let notaRedondeada = Math.round(parseFloat(notaFinal));
            texto = crearEstructuraUnicoResultado(
                parseFloat(notaFinal.toFixed(2)),
                notaRedondeada,
                notaFutura
            );
        }
    }
    textoResultado.innerHTML = texto;
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

function crearEstructuraUnicoResultado(
    notaFinal,
    notaRedondeada,
    notaFutura
) {
    let texto;
    if (notaFinal == notaRedondeada) {
        texto = `
        La nota <b>MÍNIMA</b> que debes de sacar en la evaluación<br>para aprobar la materia es <b>${notaFutura}</b><br>Y tu nota final sería <b>${notaFinal}</b>`;
    } else {
        texto = `
        La nota <b>MÍNIMA</b> que debes de sacar en la evaluación<br>para aprobar la materia es <b>${notaFutura}</b><br>Y tu nota final sería <b>${notaFinal}</b> que redondeado seria <b>${notaRedondeada}</b></em>`;
    }

    return texto;
}

function CrearEstructuraDesaprobar() {
    let texto = `Ya <em>NO</em> existe forma de que apruebes la materia`;
    return texto;
}

function CrearEstructuraYaAprobado(notaFinal, notaRedondeada) {
    let texto;
    if (notaFinal == notaRedondeada) {
        texto = `
        Ya tienes la materia <b>APROBADA</b> con una calificación de <b>${notaFinal}</b>`;
    } else {
        texto = `
        Ya tienes la materia <b>APROBADA</b> con una calificación de <b>${notaFinal}</b> que redondeado seria <b>${notaRedondeada}</b>`;
    }
    return texto;
}

function AunNoSeCalcula() {
    let texto = `
    Aún no se ha calculado <b>NINGUNA</b> predicción, <br> Ingrese los datos y presione <b>CALCULAR</b>`;
    textoResultado.innerHTML = texto;
}

function reiniciarResultados() {
    if (!variosResultados.classList.contains("inactivo")) {
        variosResultados.classList.add("inactivo");
    }
    if (textoResultado.classList.contains("inactivo")) {
        textoResultado.classList.remove("inactivo");
    }
    if (textoResultado.classList.contains("imposible")) {
        textoResultado.classList.remove("imposible");
    }
    AunNoSeCalcula();
}
