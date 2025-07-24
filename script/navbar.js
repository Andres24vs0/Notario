import { obtenerSimbolos, cargarContenido } from "./index.js";

const iconoMenu = document.getElementById("menu-navbar");
const iconoAtras = document.getElementById("atras-aside");
const opcion1 = document.getElementsByClassName("opcion-1");
const opcion2 = document.getElementsByClassName("opcion-2");
const opcion3 = document.getElementsByClassName("opcion-3");
const opcion4 = document.getElementsByClassName("opcion-4");
const aside = document.getElementById("aside-navbar");
let asideActivo = false;
const codigoMenu = obtenerSimbolos("menu");
const codigoAtras = obtenerSimbolos("regresar");
const codigoCancelar = obtenerSimbolos("cancelar");

opcion1[0].classList.add("active");

function desactivarOpciones() {
    for (let i = 0; i < opcion1.length; i++) {
        opcion1[i].classList.remove("active");
        opcion2[i].classList.remove("active");
        opcion3[i].classList.remove("active");
        opcion4[i].classList.remove("active");
    }
}

function cerrarAside() {
    aside.style.display = "none";
    iconoMenu.innerHTML = codigoMenu;
    asideActivo = false;
}

iconoMenu.addEventListener("click", () => {
    if (!asideActivo) {
        aside.style.display = "block";
        iconoMenu.innerHTML = codigoCancelar;
        asideActivo = true;
    } else {
        cerrarAside();
    }
});

iconoAtras.addEventListener("click", () => {
    cerrarAside();
});

for (let i = 0; i < opcion1.length; i++) {
    opcion1[i].addEventListener("click", () => {
        cargarContenido("contenido", "notas");
        desactivarOpciones();
        opcion1[0].classList.add("active");
        cerrarAside();
    });
    opcion2[i].addEventListener("click", () => {
        cargarContenido("contenido", "prediccion");
        desactivarOpciones();
        opcion2[0].classList.add("active");
        cerrarAside();
    });
    opcion3[i].addEventListener("click", () => {
        cargarContenido("contenido", "promedio");
        desactivarOpciones();
        opcion3[0].classList.add("active");
        cerrarAside();
    });
    opcion4[i].addEventListener("click", () => {
        cargarContenido("contenido", "informacion");
        desactivarOpciones();
        opcion4[0].classList.add("active");
        cerrarAside();
    });
}

iconoMenu.innerHTML = codigoMenu;

iconoAtras.innerHTML = codigoAtras;

window.addEventListener("resize", () => {
    if (window.innerWidth > 560) {
        cerrarAside();
    }
});
