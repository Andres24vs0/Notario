import { obtenerSimbolos } from "./index.js";

let cantEvaluacion = 0;

const zonaNotas = document.getElementById("inputs-notas");

const simboloAgregar = obtenerSimbolos("agregar");
const simboloEliminar = obtenerSimbolos("eliminar");
const botonAgregar = document.getElementById("agregar");

botonAgregar.innerHTML = simboloAgregar;
botonAgregar.addEventListener("click", () => {
    logicaAgregar();
});

for (let i = 1; i < 4; i++) {
    agregarEvaluacion();
}

function crearEstructuraEvaluacion(numero) {
    let evaluacion = `<div class="evaluacion" id="evaluacion-${numero}">
            <div class="titulo-evaluacion">
                <h6>Evaluacion #${numero}</h6>
                <i class="fa eliminar" id="eliminar-${numero}">${simboloEliminar}</i>
            </div>
            <div class="inputs-evaluacion">
                <div class="input-porcentaje">
                    <div class="label-input">
                        <label for="porcentaje-${numero}">Porcentaje:</label>
                        <input type="number" id="porcentaje-${numero}" name="porcentaje-${numero}" class="porcentaje" placeholder="20" min="1" max="100" required>
                    </div>
                    <p class="porcentaje-texto">%</p>
                </div>
                
                <div class="label-input">
                    <label for="nota-${numero}">Nota Conseguida:</label>
                    <input type="number" id="nota-${numero}" name="nota-${numero}" class="nota-conseguida" placeholder="15" min="1" max="100" required>
                </div>
            </div>
        </div>`;
    return evaluacion;
}

function agregarEvaluacion() {
    cantEvaluacion++;
    const nuevaEvaluacion = crearEstructuraEvaluacion(cantEvaluacion);
    zonaNotas.insertAdjacentHTML("beforeend", nuevaEvaluacion);

    const botonEliminar = document.getElementById(`eliminar-${cantEvaluacion}`);
    botonEliminar.addEventListener("click", (event) => {
        logicaEliminar(event);
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

function porcentajeTotal() {
    const porcentajes = Array.from(document.querySelectorAll(".porcentaje"));
    return porcentajes.reduce((acumulador, input) => {
        let numero;
        const valor = input.value;
        if (valor === "") {
            numero = 0;
        } else {
            numero = parseFloat(valor);
        }
        return acumulador + numero;
    }, 0);
}
