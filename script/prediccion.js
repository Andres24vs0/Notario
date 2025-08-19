import {
    obtenerSimbolos,
    crearEstructuraEvaluacion,
    porcentajeTotal,
    logicaErroresNotas,
    logicaErroresPorcentajes,
    logicaErroresGenerico,
    formularioValido,
    logicaEliminarConcreto,
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
let resultadoPrediccion;

class ResultadoDos {
    constructor(porcentaje1, nota1, porcentaje2, nota2, notaFinal) {
        this.porcentaje1 = parseInt(porcentaje1);
        this.porcentaje2 = parseInt(porcentaje2);
        this.nota1 = parseInt(nota1);
        this.nota2 = parseInt(nota2);
        this.notaFinal = parseFloat(notaFinal.toFixed(2));
        this.notaRedondeada = Math.round(parseFloat(notaFinal));
    }
}

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
    resultadoPrediccion = document.getElementById("resultado-prediccion");

    botonCalcular.addEventListener("click", () => {
        reiniciarResultados();
        if (
            formularioValido(
                inputNotaMaxima,
                inputNotaMinima,
                notaMaximaVacia,
                notaMaxima
            )
        ) {
            if (seleccionActual == 1) {
                logicaCalcularUnaNotaFutura();
            } else if (seleccionActual == 2) {
                logicaCalcularDosNotasFuturas();
            } else {
                alert(
                    "Por favor, seleccione una cantidad válida de evaluaciones futuras."
                );
            }
            resultadoPrediccion.scrollIntoView({ behavior: "smooth" });
        }
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
            logicaEliminarConcreto(evaluacion, index);
        });
        console.log("Evaluaciones Realizadas: " + cantEvaluacionesRealizadas);
    }
}

function logicaCalcularNotaActual() {
    let notaActual = 0;
    for (let i = 0; i < cantEvaluacionesRealizadas; i++) {
        const porcentaje = parseFloat(
            document.getElementById(`porcentaje-${i + 1}`).value
        );
        const nota = parseFloat(document.getElementById(`nota-${i + 1}`).value);
        if (isNaN(porcentaje) || isNaN(nota)) {
            continue;
        }
        notaActual += (porcentaje / 100) * nota;
    }
    return parseFloat(notaActual.toFixed(2));
}

function logicaCalcularUnaNotaFutura() {
    notaMinima = parseFloat(inputNotaMinima.value);
    let notaActual = logicaCalcularNotaActual();
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
            desaprobar();
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

function logicaCalcularDosNotasFuturas() {
    notaMinima = parseFloat(inputNotaMinima.value);
    let notaActual = logicaCalcularNotaActual();
    let diferencia = parseFloat((notaMinima - notaActual).toFixed(2));
    console.log("Nota Actual: " + notaActual);
    console.log("Diferencia: " + diferencia);
    const porcentaje1 =
        parseInt(document.getElementById("porcentaje-futuro-1").value) / 100;
    const porcentaje2 =
        parseInt(document.getElementById("porcentaje-futuro-2").value) / 100;
    if (diferencia <= 0) {
        let notaRedondeada = Math.round(parseFloat(notaActual));
        textoResultado.innerHTML = CrearEstructuraYaAprobado(
            notaActual,
            notaRedondeada
        );
    } else if (dosNotasImposible(porcentaje1, porcentaje2, diferencia)) {
        desaprobar();
    } else {
        let resultados = [];
        for (let nota1 = 0; nota1 <= notaMaxima; nota1++) {
            let nota2 = Math.round(
                (diferencia - porcentaje1 * nota1) / porcentaje2
            );
            if (nota2 < 0) {
                if (resultados.length > 0) {
                    if (resultados[resultados.length - 1].nota2 != 0) {
                        nota2 = 0;
                        nota1 = Math.round(
                            (diferencia - porcentaje2 * nota2) / porcentaje1
                        );
                        let calculoFuturo = parseFloat(
                            (nota1 * porcentaje1 + nota2 * porcentaje2).toFixed(
                                2
                            )
                        );
                        if (diferencia <= calculoFuturo) {
                            let notaFinal = parseFloat(
                                (notaActual + calculoFuturo).toFixed(2)
                            );
                            resultados.push(
                                new ResultadoDos(
                                    porcentaje1 * 100,
                                    nota1,
                                    porcentaje2 * 100,
                                    nota2,
                                    notaFinal
                                )
                            );
                            console.log(resultados[resultados.length - 1]);
                            break;
                        }
                    }
                }
                console.log(`Nota 2 alcanzó su menor valor, acabando...`);
                break;
            }
            if (nota2 > notaMaxima) {
                continue;
            }
            let calculoFuturo = parseFloat(
                (nota1 * porcentaje1 + nota2 * porcentaje2).toFixed(2)
            );
            if (diferencia > calculoFuturo) {
                nota2++;
                if (nota2 > notaMaxima) {
                    continue;
                }
                calculoFuturo = parseFloat(
                    (nota1 * porcentaje1 + nota2 * porcentaje2).toFixed(2)
                );
            }
            if (resultados.length > 0) {
                if (resultados[resultados.length - 1].nota2 == nota2) {
                    console.log(`Nota 2 ${nota2} ya existe, saltando...`);
                    continue;
                }
            }
            let notaFinal = parseFloat((notaActual + calculoFuturo).toFixed(2));
            resultados.push(
                new ResultadoDos(
                    porcentaje1 * 100,
                    nota1,
                    porcentaje2 * 100,
                    nota2,
                    notaFinal
                )
            );
            console.log(resultados[resultados.length - 1]);
        }
        if (resultados.length === 0) {
            desaprobar();
        } else {
            habilitarVariosResultados();
            switch (resultados.length) {
                case 1:
                    agregarDivisor();
                    variosResultados.innerHTML += crearEstructuraDosResultados(
                        1,
                        2,
                        resultados[0]
                    );
                    agregarDivisor();
                    break;
                case 2:
                    variosResultados.innerHTML += crearEstructuraDosResultados(
                        1,
                        1,
                        resultados[0]
                    );
                    agregarDivisor();
                    variosResultados.innerHTML += crearEstructuraDosResultados(
                        2,
                        3,
                        resultados[1]
                    );
                    break;
                default:
                    variosResultados.innerHTML += crearEstructuraDosResultados(
                        1,
                        1,
                        resultados[0]
                    );
                    agregarDivisor();
                    variosResultados.innerHTML += crearEstructuraDosResultados(
                        2,
                        2,
                        resultados[Math.round(resultados.length / 2) - 1]
                    );
                    agregarDivisor();
                    variosResultados.innerHTML += crearEstructuraDosResultados(
                        3,
                        3,
                        resultados[resultados.length - 1]
                    );
                    break;
            }
        }
    }
}

function dosNotasImposible(porcentaje1, porcentaje2, diferencia) {
    let primeraOpcion = Math.round(
        (diferencia - porcentaje1 * 0) / porcentaje2
    );
    let ultimaOpcion = (diferencia - porcentaje1 * notaMaxima) / porcentaje2;
    console.log(
        `Primera Opción: ${primeraOpcion}, Última Opción: ${ultimaOpcion}`
    );
    if (
        (primeraOpcion < 0 && ultimaOpcion < 0) ||
        (primeraOpcion > notaMaxima && ultimaOpcion > notaMaxima)
    ) {
        return true;
    }
    return false;
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

function crearEstructuraUnicoResultado(notaFinal, notaRedondeada, notaFutura) {
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

function crearEstructuraDosResultados(numero, opcion, resultado) {
    let texto = `
                <div class="resultado" id="resultado-${numero}">
                    <div class="titulo-resultado">`;
    switch (opcion) {
        case 1:
            texto += `<h3>Menor posible nota en<br>Evaluación Futura #1</h3>`;
            break;
        case 2:
            texto += `<h3>Notas medias en<br>ambas evaluaciones</h3>`;
            break;
        case 3:
            texto += `<h3>Menor posible nota en<br>Evaluación Futura #2</h3>`;
            break;
        default:
            texto += `<h3>Predicción de nota</h3>`;
    }
    texto += `
                    </div>
                    <div class="evaluacion-resultado">
                        <div class="titulo-evaluacion-resultado">
                            <h6>Evaluación Futura #1</h6>
                            <p>${resultado.porcentaje1}%</p>
                        </div>
                        <h3 class="nota-necesaria">La nota necesaria es ${resultado.nota1}</h3>
                    </div>
                    <div class="evaluacion-resultado">
                        <div class="titulo-evaluacion-resultado">
                            <h6>Evaluación Futura #2</h6>
                            <p>${resultado.porcentaje2}%</p>
                        </div>
                        <h3 class="nota-necesaria">La nota necesaria es ${resultado.nota2}</h3>
                    </div>
                    <div class="final">
                        <h3 class="nota-final">La nota final sería <b>${resultado.notaFinal}</b>`;
    if (resultado.notaFinal == resultado.notaRedondeada) {
        texto += `</h3>`;
    } else {
        texto += ` <br>que redondeado seria <b>${resultado.notaRedondeada}</b></h3>`;
    }
    texto += `
                    </div>
                </div>`;
    return texto;
}

function agregarDivisor() {
    const zona = document.getElementById("varios-resultados");
    zona.innerHTML += `
    <div class="divisor"></div> `;
}

function desaprobar() {
    textoResultado.innerHTML = CrearEstructuraDesaprobar();
    if (!textoResultado.classList.contains("imposible")) {
        textoResultado.classList.add("imposible");
    }
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

function habilitarVariosResultados() {
    variosResultados.innerHTML = "";
    if (variosResultados.classList.contains("inactivo")) {
        variosResultados.classList.remove("inactivo");
    }
    if (!textoResultado.classList.contains("inactivo")) {
        textoResultado.classList.add("inactivo");
    }
}
