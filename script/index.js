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

const simboloEliminar =obtenerSimbolos("eliminar");

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
                    <input type="number" id="nota-${numero}" name="nota-${numero}" class="nota-conseguida" placeholder="15" min="1" max="100" required>
                </div>
            </div>
        </div>`;
    return evaluacion;
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
