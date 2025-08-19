const codigosSimbolos = [
    { codigo: "&#xf0c9;", descripcion: "menu" },
    { codigo: "&#xf00d;", descripcion: "cancelar" },
    { codigo: "&#xf060;", descripcion: "regresar" },
    { codigo: "&#xf09b;", descripcion: "github" },
    { codigo: "&#xf055;", descripcion: "agregar" },
    { codigo: "&#xf1f8;", descripcion: "eliminar" },
    { codigo: "&#xf16d;", descripcion: "instagram" },
];

export function obtenerSimbolos(descripcion) {
    return codigosSimbolos.find((item) => item.descripcion === descripcion)
        .codigo;
}

const simboloEliminar = obtenerSimbolos("eliminar");

export function crearEstructuraEvaluacion(numero) {
    let evaluacion = `<div class="evaluacion" id="evaluacion-${numero}">
            <div class="titulo-evaluacion">
                <h6>Evaluacion #${numero}</h6>
                <i class="fa eliminar" id="eliminar-${numero}">${simboloEliminar}</i>
            </div>
            <div class="inputs-evaluacion">
                <div class="input-porcentaje">
                    <div class="label-input">
                        <label for="porcentaje-${numero}">Porcentaje:</label>
                        <input type="number" id="porcentaje-${numero}" name="porcentaje-${numero}" class="porcentaje" placeholder="20" min="1" max="99" required>
                    </div>
                    <p class="porcentaje-texto">%</p>
                </div>
                
                <div class="label-input">
                    <label for="nota-${numero}">Nota Conseguida:</label>
                    <input type="number" id="nota-${numero}" name="nota-${numero}" class="nota-conseguida" placeholder="15" min="0" max="100" step="any" required>
                </div>
            </div>
        </div>`;
    return evaluacion;
}

export function porcentajeTotal() {
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

export function logicaErroresGenerico(input) {
    let esValido = true;
    if (!input.checkValidity()) {
        input.classList.add("invalido");
        input.reportValidity();
        esValido = false;
    }
    if (esValido) {
        input.classList.remove("invalido");
    }
    return esValido;
}

export function logicaErroresPorcentajes(input) {
    let esValido = true;
    let cantidad = porcentajeTotal();
    console.log("Porcentaje por ahora: " + cantidad);
    if (cantidad > 100) {
        input.setCustomValidity("Con este valor el porcentaje supera el 100%");
        input.classList.add("invalido");
        input.reportValidity();
        esValido = false;
    } else {
        input.setCustomValidity("");
        input.classList.remove("invalido");
        esValido = logicaErroresGenerico(input);
    }
    return esValido;
}

export function logicaErroresNotas(input, notaMaximaVacia, notaMaxima) {
    let esValido = true;
    if (!notaMaximaVacia) {
        if (parseFloat(input.value) > notaMaxima) {
            input.setCustomValidity(
                "El número debe de ser menor o igual a la nota máxima"
            );
            input.classList.add("invalido");
            input.reportValidity();
            esValido = false;
        } else {
            input.setCustomValidity("");
            input.classList.remove("invalido");
            esValido = logicaErroresGenerico(input);
        }
    } else {
        esValido = logicaErroresGenerico(input);
    }
    return esValido;
}

export function logicaEliminarConcreto(evaluacion, index) {
    evaluacion.id = `evaluacion-${index + 1}`;
    const titulo = evaluacion.querySelector(".titulo-evaluacion h6");
    titulo.innerHTML = `Evaluacion #${index + 1}`;
    const botonEliminar = evaluacion.querySelector(
        ".titulo-evaluacion .eliminar"
    );
    botonEliminar.id = `eliminar-${index + 1}`;
    const nota = evaluacion.querySelector(".label-input .nota-conseguida");
    nota.id = `nota-${index + 1}`;
    nota.setAttribute("name", `nota-${index + 1}`);
    const labelsNota = evaluacion.querySelectorAll(".label-input label");
    if (labelsNota.length > 1) {
        labelsNota[1].setAttribute("for", `nota-${index + 1}`);
    }
    const porcentaje = evaluacion.querySelector(
        ".input-porcentaje .label-input .porcentaje"
    );
    porcentaje.id = `porcentaje-${index + 1}`;
    porcentaje.setAttribute("name", `porcentaje-${index + 1}`);
    const labelPorcentaje = evaluacion.querySelector(
        ".input-porcentaje .label-input label"
    );
    labelPorcentaje.setAttribute("for", `porcentaje-${index + 1}`);
}

export function formularioValido(
    inputNotaMaxima,
    inputNotaMinima,
    notaMaximaVacia,
    notaMaxima
) {
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

function cargarHTML(id, archivo) {
    return fetch("pages/" + archivo + ".html")
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    "Error al cargar el archivo: " + response.status
                );
            } else {
                return response.text();
            }
        })
        .then((html) => {
            document.getElementById(id).innerHTML = html;
        });
}

function cargarJS(id, archivo) {
    const antiguo = document.getElementById(id + "-script");
    if (antiguo) {
        antiguo.remove();
    }
    const script = document.createElement("script");
    script.src = "script/" + archivo + ".js";
    script.id = id + "-script";
    script.type = "module";
    script.onload = () => {
        console.log(`Script ${archivo} cargado correctamente.`);
        if (
            window[
                "inicializar" +
                    archivo.charAt(0).toUpperCase() +
                    archivo.slice(1)
            ]
        ) {
            window[
                "inicializar" +
                    archivo.charAt(0).toUpperCase() +
                    archivo.slice(1)
            ]();
            console.log(`Inicialización de ${archivo} completada.`);
        }
    };
    script.onerror = () => {
        console.error(`Error al cargar el script ${archivo}.`);
    };
    document.head.appendChild(script);
}

function cargarCSS(id, archivo) {
    const antiguo = document.getElementById(id + "-style");
    if (antiguo) {
        antiguo.remove();
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "styles/" + archivo + ".css";
    link.id = id + "-style";
    link.onload = () => {
        console.log(`Estilo ${archivo} cargado correctamente.`);
    };
    link.onerror = () => {
        console.error(`Error al cargar el estilo ${archivo}.`);
    };
    document.head.appendChild(link);
}

export function cargarContenido(id, archivo) {
    cargarHTML(id, archivo).then(() => {
        cargarJS(id, archivo);
        cargarCSS(id, archivo);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    cargarContenido("navbar", "navbar");
    cargarContenido("contenido", "prediccion");
    cargarContenido("footer", "footer");
});
