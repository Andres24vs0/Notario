import { obtenerSimbolos, logicaErroresGenerico } from "./index.js";

let zonaPeriodos;

//Codigos simbolos
const simboloAgregar = obtenerSimbolos("agregar");
const simboloEliminar = obtenerSimbolos("eliminar");

//Manejo de la cantidad de periodos
let cantPeriodos;
let inputCantPeriodos;

//Manejo de la cantidad de Materias
let cantidadMaterias = [];

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

    //Inicializar cantidad de materias
    cantidadMaterias = [];
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

export function logicaEliminarConcretoMateria(numeroPeriodo, materia, index) {
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
