import "./styles.css";

import { Grid } from "./Grid";
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d", { alpha: false });

let grid: Grid;
let mouseStartX;
let mouseStartY;

let mousePosX = 0;
let mousePosY = 0;

///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////

// Fonctions

function init() {
  // Déterminer la résolution d'affichage

  const stdCanvasW = document.body.clientWidth - 2 * canvas.offsetLeft;
  const stdCanvasH = stdCanvasW / 2;
  const optCanvasW = stdCanvasW * window.devicePixelRatio;
  const optCanvasH = stdCanvasH * window.devicePixelRatio;

  if (window.devicePixelRatio > 1) {
    canvas.width = optCanvasW;
    canvas.height = optCanvasH;
    context.scale(window.devicePixelRatio, window.devicePixelRatio);
  } else {
    canvas.width = stdCanvasW;
    canvas.height = stdCanvasH;
  }

  canvas.style.width = stdCanvasW + "px";
  canvas.style.height = stdCanvasH + "px";

  // Créer et afficher la grille
  grid = new Grid({
    stdCanvasH,
    stdCanvasW,
    canvas,
    context,
    minCellSize: 20
  });
  grid.draw();
}

///////////////////////////////////////////////////////////////////////////////////////////

// Démarrage de la webapp

init();

///////////////////////////////////////////////////////////////////////////////////////////

// Evenements

window.addEventListener("resize", init);

// Zoomer le canvas avec la roulette
canvas.addEventListener("wheel", function (e) {
  e.preventDefault();
  e.stopPropagation();

  const zoom = e.wheelDelta / 120;
  grid.setZoom(zoom, mousePosX, mousePosY);
});

// Pan canvas on drag

canvas.addEventListener("mousedown", function (e) {
  e.preventDefault();
  e.stopPropagation();

  mouseStartX = parseInt(e.clientX) - canvas.offsetLeft;
  mouseStartY = parseInt(e.clientY) - canvas.offsetTop;

  canvas.onmousemove = function (e) {
    e.preventDefault();
    e.stopPropagation();

    grid.setPan(mouseStartX, mouseStartY, mousePosX, mousePosY);
  };
});

//  Récupérer les coordonnées de la souris en mouvement.
canvas.addEventListener("mousemove", function (e) {
  e.preventDefault();
  e.stopPropagation();

  mousePosX = parseInt(e.clientX) - canvas.offsetLeft;
  mousePosY = parseInt(e.clientY) - canvas.offsetTop;
});

canvas.addEventListener("mouseup", function (e) {
  e.preventDefault();
  e.stopPropagation();

  canvas.onmousemove = null;
  canvas.onmousewheel = null;

  // Get last (0;0) coordinates
  grid.lastAxisPosX = grid.axisPosX;
  grid.lastAxisPosY = grid.axisPosY;
});

canvas.addEventListener("mouseout", function (e) {
  e.preventDefault();
  e.stopPropagation();

  canvas.onmousemove = null;
  canvas.onmousewheel = null;

  // Get last (0;0) coordinates
  grid.lastAxisPosX = grid.axisPosX;
  grid.lastAxisPosY = grid.axisPosY;
});

//////////////////////////////////////////////////////////
