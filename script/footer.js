import { obtenerSimbolos } from "./index.js";

const linkGithub = "https://github.com/Andres24vs0";
const linkInstagram = "https://www.instagram.com/andres24vs/";
const github = document.getElementById("github");
const instagram = document.getElementById("instagram");
const simboloGithub = obtenerSimbolos("github");
const simboloInstagram = obtenerSimbolos("instagram");

const copyright = document.getElementById("copyright");
const fecha = new Date();
const año = fecha.getFullYear();

github.target = "_blank";
github.rel = "noopener noreferrer";

instagram.target = "_blank";
instagram.rel = "noopener noreferrer";

github.href = linkGithub;
instagram.href = linkInstagram;

github.innerHTML = simboloGithub;
instagram.innerHTML = simboloInstagram;

copyright.innerHTML = "© " + año + copyright.innerHTML;
