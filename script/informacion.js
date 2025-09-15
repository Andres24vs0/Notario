import { obtenerSimbolos } from "./index.js";

//abrir y cerrar
const simboloAbrir = obtenerSimbolos("abrir");
const simboloCerrar = obtenerSimbolos("cerrar");
let botonesDesplegar;
let botonInformacion;
let abiertos = [];

function inicializarInformacion() {
    botonesDesplegar = document.querySelectorAll(".desplegar");
    botonesDesplegar.forEach((boton, index) => {
        abiertos.push(false);
        boton.innerHTML = simboloAbrir;
    });

    botonInformacion = document.querySelectorAll(".titulo");
    botonInformacion.forEach((boton) => {
        boton.addEventListener("click", (event) => {
            const id = obtenerId(event);
            if (abiertos[id]) {
                cerrar(id);
            } else {
                abrir(id);
            }
        });
    });
}

window.inicializarInformacion = inicializarInformacion;

function abrir(id) {
    const detalle = document.getElementById("detalle-" + id);
    detalle.classList.remove("inactivo");
    botonesDesplegar[id].innerHTML = simboloCerrar;
    abiertos[id] = true;
}

function cerrar(id) {
    const detalle = document.getElementById("detalle-" + id);
    detalle.classList.add("inactivo");
    botonesDesplegar[id].innerHTML = simboloAbrir;
    abiertos[id] = false;
}

function obtenerId(event) {
    return event.currentTarget.id.split("-")[1];
}
