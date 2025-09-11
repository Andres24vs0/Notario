import {
    obtenerSimbolos,
    logicaErroresGenerico,
    avanzarInput,
} from "./index.js";

let zonaPeriodos;

//Codigos simbolos
const simboloAgregar = obtenerSimbolos("agregar");
const simboloEliminar = obtenerSimbolos("eliminar");

//Manejo de la cantidad de periodos
let cantPeriodos;
let inputCantPeriodos;

//Manejo de la cantidad de Materias
let cantidadMaterias = [];

//Manejo de resultados
let zonaResultado;
let zonaResultadosPeriodos;
let botonCalcular;

function inicializarPromedio() {
    zonaPeriodos = document.getElementById("zona-periodos");

    //Inicializar cantidad de periodos
    cantPeriodos = 0;
    inputCantPeriodos = document.getElementById("cantidad-periodo");
    inputCantPeriodos.addEventListener("input", (event) => {
        if (logicaErroresGenerico(event.target)) {
            let nuevaCantidad = parseInt(event.target.value);
            let diferencia = nuevaCantidad - cantPeriodos;
            if (diferencia > 0) {
                logicaAgregarPeriodos(diferencia);
            } else {
                logicaEliminarPeriodos(diferencia * -1);
            }
        }
    });

    inputCantPeriodos.addEventListener("keydown", (event) => {
        avanzarInput(event, logicaBotonCalcular);
    });

    //Inicializar cantidad de materias
    cantidadMaterias = [];

    //Inicializar zonas de resultados
    zonaResultado = document.getElementById("resultado-promedio");
    zonaResultadosPeriodos = document.getElementById("varios-resultados");
    desactivarVariosResultados();

    botonCalcular = document.getElementById("calcular-promedio");
    botonCalcular.addEventListener("click", () => {
        logicaBotonCalcular();
    });
}

window.inicializarPromedio = inicializarPromedio;

function logicaAgregarPeriodos(diferencia) {
    for (let i = cantPeriodos + 1; i <= cantPeriodos + diferencia; i++) {
        zonaPeriodos.insertAdjacentHTML("beforeend", crearEstructuraPeriodo(i));
        cantidadMaterias.push(0);
        for (let j = 0; j < 3; j++) {
            logicaAgregarMateria(i);
        }
        const agregar = document.getElementById(`agregar-${i}`);
        agregar.addEventListener("click", (event) => {
            let numeroPeriodo = parseInt(event.target.id.split("-")[1]);
            logicaAgregarMateria(numeroPeriodo);
        });
    }
    cantPeriodos += diferencia;
}

function logicaEliminarPeriodos(diferencia) {
    for (let i = 0; i < diferencia; i++) {
        const periodoAEliminar = document.getElementById(
            `periodo-${cantPeriodos - i}`
        );
        zonaPeriodos.removeChild(periodoAEliminar);
    }
    cantPeriodos -= diferencia;
}

function logicaAgregarMateria(numeroPeriodo) {
    const inputsMaterias = document.getElementById(
        `inputs-materias-${numeroPeriodo}`
    );
    const numeroMateria = inputsMaterias.childElementCount + 1;
    inputsMaterias.insertAdjacentHTML(
        "beforeend",
        crearEstructuraMateria(numeroPeriodo, numeroMateria)
    );

    cantidadMaterias[numeroPeriodo - 1]++;
    console.log(
        "Cantidad materias de periodo " +
            numeroPeriodo +
            ": " +
            cantidadMaterias[numeroPeriodo - 1]
    );

    const input = document.getElementById(
        `nota-${numeroPeriodo}-${numeroMateria}`
    );
    input.addEventListener("input", (event) => {
        logicaErroresGenerico(event.target);
    });

    input.addEventListener("keydown", (event) => {
        avanzarInput(event, logicaBotonCalcular);
    });

    const eliminar = document.getElementById(
        `eliminar-${numeroPeriodo}-${numeroMateria}`
    );
    eliminar.addEventListener("click", (event) => {
        logicaEliminarMateria(event);
    });
}

function logicaEliminarMateria(event) {
    let numeroPeriodo = parseInt(event.target.id.split("-")[1]);
    if (cantidadMaterias[numeroPeriodo - 1] <= 1) {
        alert("Cada periodo debe tener al menos 1 materia.");
    } else {
        const materia = event.target.closest(".materia");
        const inputsMaterias = document.getElementById(
            `inputs-materias-${numeroPeriodo}`
        );
        inputsMaterias.removeChild(materia);
        cantidadMaterias[numeroPeriodo - 1]--;
        const evaluacionesRestantes = document.querySelectorAll(
            `#inputs-materias-${numeroPeriodo} .materia`
        );
        evaluacionesRestantes.forEach((materia, index) => {
            logicaEliminarConcretoMateria(numeroPeriodo, materia, index);
        });
        console.log(
            "Cantidad materias de periodo " +
                numeroPeriodo +
                ": " +
                cantidadMaterias[numeroPeriodo - 1]
        );
    }
}

function logicaEliminarConcretoMateria(numeroPeriodo, materia, index) {
    materia.id = `materia-${numeroPeriodo}-${index + 1}`;
    const titulo = materia.querySelector(".titulo-materia h6");
    titulo.innerHTML = `Materia #${numeroPeriodo}-${index + 1}`;
    const botonEliminar = materia.querySelector(".titulo-materia .eliminar");
    botonEliminar.id = `eliminar-${numeroPeriodo}-${index + 1}`;
    const nota = materia.querySelector(".label-input .nota-conseguida");
    nota.id = `nota-${numeroPeriodo}-${index + 1}`;
    nota.setAttribute("name", `nota-${numeroPeriodo}-${index + 1}`);
    const labelsNota = materia.querySelectorAll(".label-input label");
    labelsNota[0].setAttribute("for", `nota-${numeroPeriodo}-${index + 1}`);
}

function logicaCalcularPromedio() {
    const promedioFinal = calcularPromedioFinal();
    const promedioFinalRedondeado = Math.round(promedioFinal);
    zonaResultado.innerHTML = crearEstructuraPromedioFinal(
        promedioFinal,
        promedioFinalRedondeado
    );
    if (cantPeriodos > 1) {
        const promediosPeriodos = [];
        for (let i = 1; i <= cantPeriodos; i++) {
            promediosPeriodos.push(calcularPromedioPeriodo(i));
        }
        activarVariosResultados();
        zonaResultadosPeriodos.innerHTML = crearEstructuraPromediosPeriodo(
            promediosPeriodos,
            promedioFinal
        );
    }
}

function logicaBotonCalcular() {
    if (formularioPromedioValido() && cantPeriodos > 0) {
        logicaCalcularPromedio();
        zonaResultado.scrollIntoView({ behavior: "smooth" });
    } else {
        desactivarVariosResultados();
        zonaResultado.innerHTML = "";
    }
}

function calcularPromedioFinal() {
    const notas = document.querySelectorAll(".nota-conseguida");
    let sumaNotas = 0;
    notas.forEach((nota) => {
        sumaNotas += parseFloat(nota.value);
    });
    let promedio = parseFloat((sumaNotas / notas.length).toFixed(2));
    return promedio;
}

function calcularPromedioPeriodo(numeroPeriodo) {
    let sumaNotas = 0;
    for (let i = 1; i <= cantidadMaterias[numeroPeriodo - 1]; i++) {
        const input = document.getElementById(`nota-${numeroPeriodo}-${i}`);
        sumaNotas += parseFloat(input.value);
    }
    let promedio = parseFloat(
        (sumaNotas / cantidadMaterias[numeroPeriodo - 1]).toFixed(2)
    );
    console.log(promedio);
    return promedio;
}

function formularioPromedioValido() {
    const inputs = document.querySelectorAll("input");
    let esValido = true;
    inputs.forEach((input) => {
        let temp = logicaErroresGenerico(input);
        if (!temp) {
            esValido = false;
        }
    });
    return esValido;
}

function crearEstructuraPeriodo(numeroPeriodo) {
    let nuevoPeriodo = `
        <div class="periodo" id="periodo-${numeroPeriodo}">
            <div class="titulo-periodo">
                <h6>Periodo #${numeroPeriodo}</h6>
            </div>
            <section class="zona-materias">
                <div class="inputs-materias" id="inputs-materias-${numeroPeriodo}">
                </div>
                <div class="boton-agregar">
                    <i class="fa agregar" id="agregar-${numeroPeriodo}">${simboloAgregar}</i>
                </div>
                
            </section>
        </div>`;
    return nuevoPeriodo;
}

function crearEstructuraMateria(numeroPeriodo, numeroMateria) {
    let nuevaMateria = `
    <div class="materia" id="materia-${numeroPeriodo}-${numeroMateria}">
        <div class="titulo-materia">
                <h6>Materia #${numeroPeriodo}-${numeroMateria}</h6>
                <i class="fa eliminar" id="eliminar-${numeroPeriodo}-${numeroMateria}">${simboloEliminar}</i>
        </div>
        <div class="inputs-materia">
            <div class="label-input">
                <label for="nota-${numeroPeriodo}-${numeroMateria}">Nota Conseguida:</label>
                <input type="number" id="nota-${numeroPeriodo}-${numeroMateria}" name="nota-${numeroPeriodo}-${numeroMateria}" class="nota-conseguida" placeholder="15" min="0" max="100" step="any" required>
            </div>
        </div>
    </div>`;
    return nuevaMateria;
}

function crearEstructuraPromedioFinal(promedio, promedioRedondeado) {
    let texto = `<h3 id="nota-final">Tu promedio es <b>${promedio}</b>`;
    if (promedio != promedioRedondeado) {
        texto += ` que redondeado sería <b>${promedioRedondeado}</b>`;
    }
    texto += `</h3>`;
    return texto;
}

function crearEstructuraPromediosPeriodo(promedios, promedioFinal) {
    let texto = `
        <h2 id="titulo-resultado">
            Promedios por Periodo
        </h2>
        <section id="resultados-periodos">`;
    for (let i = 0; i < promedios.length; i++) {
        texto += `
            <div class="resultado-periodo">
                <h6 class="nombre-resultado">Periodo #${i + 1}</h3>
                <div class="promedio-periodo">${promedios[i]}</div>
            </div>`;
    }
    texto += `
        <div class="resultado-periodo">
                <h6 class="nombre-resultado">Final</h3>
                <div class="promedio-periodo">${promedioFinal}</div>
            </div>
        </section>`;
    return texto;
}

function desactivarVariosResultados() {
    if (!zonaResultadosPeriodos.classList.contains("inactivo")) {
        zonaResultadosPeriodos.classList.add("inactivo");
    }
}

function activarVariosResultados() {
    if (zonaResultadosPeriodos.classList.contains("inactivo")) {
        zonaResultadosPeriodos.classList.remove("inactivo");
    }
}
