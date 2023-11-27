Sources:
https://stackoverflow.com/questions/73035945/infinite-grid-zoom-symmetrical-zoom-in-and-out

https://codesandbox.io/s/infinite-grid-2ocxcg?file=/src/index.js

https://codesandbox.io/s/infinite-grid-independent-axis-0epmto

https://codesandbox.io/u/Swoorup

--------

Stackoverflow Question

--------

**Infinite grid zoom : symmetrical zoom in and out**

0

I'm building an infinite grid zoom in vanilla javascript for learning purposes. So far so good but I have an issue though:

When I zoom in, the values on the axis as well as the gridlines update themselves when the smallest cell size is 2 times larger than its original size. This way I get an infinite zoom. Which is fine.

To get the effect to work when I zoom out, I need the gridlines and the values on the axis to update when the actual cell size is 2 times smaller than its minimum size.

This works very well as in the preview here below. But this implies that the zoom in and zoom out effects are not symmetrical.

I would like the grid lines and values to update at the exact same time/spot regardless of the direction of the zoom (in/out). See it like this: I would like the zoom out as if it was a simple rewind of the zoom in. Which it is not.

The reason I want it like that is that when I zoom in, I am assured that the minimum distance between two values will be of 100 pixels and I would like it to be the case when I zoom out too. But when I zoom out, the minimum distance between two axis values falls to 50px.

Here is what I do for the zoom in update in the "draw()" function of the Grid class:

```js
if (this.cellSize >= 2 * minCellSize) {}
```

Here is what I do for the zoom out

```js
 else if (this.cellSize < minCellSize / 2) {}
```

Those are periodic events and they trigger an update of the lines and values every now and then.

To get what I want for the zoom out, in theory, I should do the exact opposite of the zoom in instruction:

```js
else if (this.cellSize < 2 * minCellSize) {}
```

But in practice, this is always the case when I zoom out since the actual cell size is always smaller than 2 times its minimum value because of the zoom in condition, so the "else if" triggers the event all the time while zooming out, not periodically.

So I don't really know how to do this.

Any help would be appreciated.

```js
///////////////////////////////////////////////////////////////////////////////////////////

// Constantes

const canvas      = document.getElementById('canvas');
const context     = canvas.getContext('2d', { alpha: false });
const canvasColor = '#282c34';
const axisColor   = "#ffffff";
const minCellSize = 20;


///////////////////////////////////////////////////////////////////////////////////////////

// Variables

let mousePosX  = 0;
let mousePosY  = 0;
let zoom       = 1;
let zoomMin    = 0;
let zoomMax    = 0;
let opacity    = 0;
let opacityMin = 0;
let opacityMax = 0;
let gen        = 1;
let ratio      = 4;


///////////////////////////////////////////////////////////////////////////////////////////

// Classes

class Grid {

    constructor() {

        this.width    = stdCanvasW,
        this.height   = stdCanvasH,
        this.axisPosX = stdCanvasW / 2,
        this.axisPosY = stdCanvasH / 2,
        this.cellSize = minCellSize
        
    }

    draw() {

        // Grille au zoom infini

        // Déterminer le loop des cellules et le multiplicateur/diviseur à utiliser pour les nombres selon
        // le nombre de zoom /dézoom faits.

        if (this.cellSize >= 2 * minCellSize) {

            if      (Math.abs(Math.log2(gen)) % 3 == 0) {
                this.cellSize = 20;
                gen = gen * 2;
                ratio = ratio * 2;
            }
            else if (Math.abs(Math.log2(gen)) % 3 == 1) {
                this.cellSize = 16;
                gen = gen * 2;
                if (gen > 1) { ratio = ratio * 2.5; }
                else         { ratio = ratio * 2; }
            }
            else if (Math.abs(Math.log2(gen)) % 3 == 2) {
                this.cellSize = 20;
                gen = gen * 2;
                if (gen > 1) { ratio = ratio * 2; }
                else         { ratio = ratio * 2.5; }
            }

        }

        else if (this.cellSize < minCellSize / 2) {

            if      (Math.abs(Math.log2(gen)) % 3 == 0) {

                ratio = ratio / 2;
                this.cellSize = 20;
                gen = gen / 2

            }
            else if (Math.abs(Math.log2(gen)) % 3 == 1) {

                if (gen < 1) {ratio = ratio / 2.5;}
                else         {ratio = ratio / 2;}

                this.cellSize = 16;
                gen = gen / 2;

            }
            else if (Math.abs(Math.log2(gen)) % 3 == 2) {

                if (gen < 1) {ratio = ratio / 2;}
                else         {ratio = ratio / 2.5;}

                this.cellSize = 20;
                gen = gen / 2;

            }

        }


        // Afficher la couleur de fond du canevas

        context.fillStyle = canvasColor;
        context.fillRect(0, 0, this.width, this.height);

        // Afficher les lignes

        const minDivY  = -Math.ceil(this.axisPosY / this.cellSize);
        const minDivX  = -Math.ceil(this.axisPosX / this.cellSize);
        const maxDivY  =  Math.ceil((this.height - this.axisPosY) / this.cellSize);
        const maxDivX  =  Math.ceil((this.width  - this.axisPosX) / this.cellSize);

        for (let lineV = minDivY; lineV <= maxDivY; lineV++) {
          this.setGridLines('v', lineV); this.setGridValues('v', lineV);
        }
        
        for (let lineH = minDivX; lineH <= maxDivX; lineH++) {
          this.setGridLines('h', lineH); this.setGridValues('h', lineH);
        }

        // Afficher les axes

        this.setAxis();

    }

    setLineStyle(line) {

        if (line == 'axis') {
            
            // Les axes
            context.lineWidth   = 1;
            context.strokeStyle = axisColor;

        }
        else {

            context.lineWidth = 0.5;

            if      (line % 8 == 0) {
                if      (zoom > 0) {context.strokeStyle = 'rgba(250,250,250,0.9)';}
                else if (zoom < 0) {context.strokeStyle = 'rgba(250,250,250,' + this.setOpacity((this.cellSize / minCellSize), 0.9, 0.6) + ')';}
            }
            else if (line % 4 == 0) {
                if      (zoom > 0) {context.strokeStyle = 'rgba(250,250,250,' + this.setOpacity((this.cellSize / minCellSize), 0.6, 0.9) + ')';}
                else if (zoom < 0) {context.strokeStyle = 'rgba(250,250,250,' + this.setOpacity((this.cellSize / minCellSize), 0.6, 0.2) + ')';}
            }
             else {
                if      (zoom > 0) {context.strokeStyle = 'rgba(250,250,250,' + this.setOpacity((this.cellSize / minCellSize), 0, 0.14) + ')'; }
                else if (zoom < 0) {context.strokeStyle = 'rgba(250,250,250,' + this.setOpacity((this.cellSize / minCellSize), 0.05, 0) + ')'; }
            }

        }

    }

    setGridLines(direction, line) {

        // Styler
        this.setLineStyle(line);

        if      (direction == 'v') {

            // Tracer
            const y = (this.axisPosY + this.cellSize * line);
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(this.width, y);

        }
        else if (direction == 'h') {

            // Tracer
            const x = (this.axisPosX + this.cellSize * line);
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, this.height);

        }

        context.stroke();
        context.closePath();

    }

    setGridValues(direction, line) {

        // Styler
        context.font      = '12px Arial';
        context.fillStyle = '#aaaaaa';

        // Tracer
        context.beginPath();

        if      (direction == 'v' && line % 4 == 0 && line != 0) {
        
            let value         = -line / ratio;
            let valueOffset   = context.measureText(value).width + 15
            context.textAlign = 'right'

            if      (this.axisPosX >= this.width) {
                context.fillText(value, this.width - 15, this.axisPosY - line * (-this.cellSize) + 3)
            }
            else if (this.axisPosX <= valueOffset + 15) {
                context.fillText(value, valueOffset, this.axisPosY - line * (-this.cellSize) + 3)
            }
            else {
                context.fillText(value, this.axisPosX - 15, this.axisPosY + line * this.cellSize + 3)
            }
            
        }

        else if (direction == 'h' && line % 4 == 0 && line != 0) {
            
            let value         = line / ratio;
            context.textAlign = 'center'

            if      (this.axisPosY >= this.height - canvas.offsetTop) {

                context.fillText(value, this.axisPosX + line * this.cellSize, this.height - 20)

            }
            else if (this.axisPosY <= 0) {
                context.fillText(value, this.axisPosX + line * this.cellSize, 20)
            }
            else {
                context.fillText(value, this.axisPosX + line * this.cellSize, this.axisPosY + 20)
            }

        }

        context.closePath();

    }

    setAxis() {

        // Styler
        this.setLineStyle('axis');

        //Tracer 
        context.beginPath();

        // Tracer l'horizontale
        context.moveTo(0, this.axisPosY);
        context.lineTo(this.width, this.axisPosY);
        // Tracer la verticale
        context.moveTo(this.axisPosX, 0);
        context.lineTo(this.axisPosX, this.height);

        context.stroke();
        context.closePath();

        // Numéroter le point 0
        context.font      = '12px arial';
        context.fillStyle = '#aaaaaa';
        context.textAlign = 'center'
        context.beginPath();
        context.fillText(0, this.axisPosX - 15, this.axisPosY + 20)
        context.closePath();

    }

    setPan() {

        // As long as we pan, the (0;0) coordinate is not updated yet

        const beforeX  = mouseStartX / this.cellSize;
        const beforeY  = mouseStartY / this.cellSize;

        const afterX   = mousePosX / this.cellSize;
        const afterY   = mousePosY / this.cellSize;

        const deltaX   = afterX - beforeX;
        const deltaY   = afterY - beforeY;

        this.axisPosX  = lastAxisPosX;
        this.axisPosY  = lastAxisPosY;

        this.axisPosX += deltaX * this.cellSize;
        this.axisPosY += deltaY * this.cellSize;

        this.draw();

    }

    setZoom() {

        // Calculate the mouse position before applying the zoom
        // in the coordinate system of the grid
        const beforeX  = (mousePosX - this.axisPosX) / this.cellSize;
        const beforeY  = (mousePosY - this.axisPosY) / this.cellSize;

        this.cellSize  = this.cellSize + zoom;

        // After zoom, you'll see the coordinates changed
        const afterX   = (mousePosX - this.axisPosX) / this.cellSize;
        const afterY   = (mousePosY - this.axisPosY) / this.cellSize;

        // Calculate the shift
        const deltaX   = afterX - beforeX;
        const deltaY   = afterY - beforeY;

        // "Undo" the shift by shifting the coordinate system's center
        this.axisPosX += deltaX * this.cellSize;
        this.axisPosY += deltaY * this.cellSize;

        this.draw();

    }

    setOpacity(zoomLevel, val1, val2) {

        if      (zoom > 0) {
            opacityMin = val1; opacityMax = val2; zoomMin = 1  ; zoomMax = 2;
        }
        else if (zoom < 0) {
            opacityMin = val2; opacityMax = val1; zoomMin = 0.5; zoomMax = 1;
        }

        const zoomRange        = (zoomMax - zoomMin);
        const opacityRange     = (opacityMax - opacityMin);
        const zoomLevelPercent = (zoomLevel - zoomMin) / zoomRange;
        const opacityLevel     = (opacityRange * zoomLevelPercent) + opacityMin;
        return opacityLevel;

    }

}

///////////////////////////////////////////////////////////////////////////////////////////

// Fonctions

function init() {

    // Déterminer la résolution d'affichage

    stdCanvasW = document.body.clientWidth - 2 * (canvas.offsetLeft);
    stdCanvasH = stdCanvasW / 2;
    optCanvasW = stdCanvasW * window.devicePixelRatio;
    optCanvasH = stdCanvasH * window.devicePixelRatio;

    if (window.devicePixelRatio > 1) {

        canvas.width  = optCanvasW;
        canvas.height = optCanvasH;
        context.scale(window.devicePixelRatio, window.devicePixelRatio);

    }
    else {

        canvas.width  = stdCanvasW;
        canvas.height = stdCanvasH;

    }

    canvas.style.width  = stdCanvasW + "px";
    canvas.style.height = stdCanvasH + "px";

    lastAxisPosX = stdCanvasW / 2
    lastAxisPosY = stdCanvasH / 2

    // Créer et afficher la grille
    grid = new Grid();
    grid.draw();

}

///////////////////////////////////////////////////////////////////////////////////////////

// Démarrage de la webapp

init();

///////////////////////////////////////////////////////////////////////////////////////////

// Evenements

window.addEventListener("resize", init);

// Zoomer le canvas avec la roulette
canvas.addEventListener('wheel', function (e) {

    e.preventDefault();
    e.stopPropagation();

    zoom = e.wheelDelta / 120;
    grid.setZoom();

    // Get last (0;0) coordinates
    lastAxisPosX = grid.axisPosX;
    lastAxisPosY = grid.axisPosY;

})

// Pan canvas on drag 

canvas.addEventListener('mousedown', function (e) {

    e.preventDefault();
    e.stopPropagation();

    mouseStartX = parseInt(e.clientX) - canvas.offsetLeft;
    mouseStartY = parseInt(e.clientY) - canvas.offsetTop;

    canvas.onmousemove = function (e) {

        e.preventDefault();
        e.stopPropagation();

        grid.setPan();

    }

})

//  Récupérer les coordonnées de la souris en mouvement.
canvas.addEventListener('mousemove', function (e) {

    e.preventDefault();
    e.stopPropagation();

    mousePosX = parseInt(e.clientX) - canvas.offsetLeft;
    mousePosY = parseInt(e.clientY) - canvas.offsetTop;

})

canvas.addEventListener('mouseup', function (e) {

    e.preventDefault();
    e.stopPropagation();

    canvas.onmousemove  = null;
    canvas.onmousewheel = null;

    // Get last (0;0) coordinates
    lastAxisPosX = grid.axisPosX;
    lastAxisPosY = grid.axisPosY;

})

canvas.addEventListener('mouseout', function (e) {

    e.preventDefault();
    e.stopPropagation();

    canvas.onmousemove  = null;
    canvas.onmousewheel = null;

    // Get last (0;0) coordinates
    lastAxisPosX = grid.axisPosX;
    lastAxisPosY = grid.axisPosY;

})

///////////////////////////////////////////////////////////////////////////////////////////
```

```html
html, body
{
    background:#21252b;
    width:100%;
    height:100%;
    margin:0px;
    padding:0px;
    overflow: hidden;
}

#canvas{
    margin:20px;
    border: 1px solid white;
}

<canvas id="canvas"></canvas>
```

I think the grid will be more readable if you set the snippet screen to full size.

If I need to make some changes to make the whole thing more readable, just ask. But know that the part that is related to my problem is the first few lines of the draw() function within the Grid class (line 51 and 73).

Thanks

--------

Awser

--------

I fixed your code. Basically I had to ensure the shift calculation also accounts for ratio too and is shifted back after the zoom calculations.

https://codesandbox.io/s/infinite-grid-2ocxcg?file=/src/index.js

--------

Thanks ! I need a little time so that I can look at your code and mine before I get back to you (it's been a while since I haven't worked on this script as I gave up trying to find a solution, so I need to study it again to remember what I did and how you solved it). I really appreciate your help and I am grateful if it meets all my requirements because this was important to me. – 
Bachir Messaouri
 Apr 20 at 8:16
