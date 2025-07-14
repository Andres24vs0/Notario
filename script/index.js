function cargarHTML(id, archivo) {
    fetch("pages/" + archivo + ".html")
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

function cargarJS(archivo) {
    const antiguo = document.getElementById("contenido-script");
    if (antiguo) {
        antiguo.remove();
    }
    const script = document.createElement("script");
    script.src = "script/" + archivo + ".js";
    script.id = "contenido-script";
    script.onload = () => {
        console.log(`Script ${archivo} cargado correctamente.`);
    };
    script.onerror = () => {
        console.error(`Error al cargar el script ${archivo}.`);
    };
    document.head.appendChild(script);
}

function cargarCSS(archivo) {
    const antiguo = document.getElementById("contenido-style");
    if (antiguo) {
        antiguo.remove();
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "styles/" + archivo + ".css";
    link.id = "contenido-style";
    link.onload = () => {
        console.log(`Estilo ${archivo} cargado correctamente.`);
    };
    link.onerror = () => {
        console.error(`Error al cargar el estilo ${archivo}.`);
    };
    document.head.appendChild(link);
}

export default function cargarContenido(archivo) {
    cargarHTML("contenido", archivo);
    cargarJS(archivo);
    cargarCSS(archivo);
}

document.addEventListener("DOMContentLoaded", () => {
    cargarHTML("navbar", "navbar");
    cargarContenido("notas");
    cargarHTML("footer", "footer");
});
