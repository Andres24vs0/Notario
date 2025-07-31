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
    cargarContenido("contenido", "notas");
    cargarContenido("footer", "footer");
});
