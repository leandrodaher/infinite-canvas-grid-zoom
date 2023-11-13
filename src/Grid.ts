const canvasColor = "#282c34";
const axisColor = "#ffffff";

export type GridParams = {
  stdCanvasW: number;
  stdCanvasH: number;
  minCellSize: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
};

export class Grid {
  width: number;
  height: number;
  axisPosX: number;
  axisPosY: number;
  cellSize: number;

  lastAxisPosX: number;
  lastAxisPosY: number;

  private readonly minCellSize: number = 20;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  private zoom: number = 1;
  private zoomMin: number = 0;
  private zoomMax: number = 0;
  private opacityMin: number = 0;
  private opacityMax: number = 0;

  private gen = 1;
  private ratio = 4;

  constructor({
    stdCanvasH,
    stdCanvasW,
    minCellSize,
    context,
    canvas
  }: GridParams) {
    this.width = stdCanvasW;
    this.height = stdCanvasH;
    this.axisPosX = stdCanvasW / 2;
    this.axisPosY = stdCanvasH / 2;
    this.cellSize = minCellSize;
    this.context = context;
    this.canvas = canvas;

    this.lastAxisPosX = stdCanvasW / 2;
    this.lastAxisPosY = stdCanvasH / 2;

    this.minCellSize = minCellSize;
  }

  draw() {
    this.context.fillStyle = canvasColor;
    this.context.fillRect(0, 0, this.width, this.height);

    const minDivY = -Math.ceil(this.axisPosY / this.cellSize);
    const minDivX = -Math.ceil(this.axisPosX / this.cellSize);
    const maxDivY = Math.ceil((this.height - this.axisPosY) / this.cellSize);
    const maxDivX = Math.ceil((this.width - this.axisPosX) / this.cellSize);

    for (let lineV = minDivY; lineV <= maxDivY; lineV++) {
      this.setGridLines("v", lineV);
      this.setGridValues("v", lineV);
    }

    for (let lineH = minDivX; lineH <= maxDivX; lineH++) {
      this.setGridLines("h", lineH);
      this.setGridValues("h", lineH);
    }

    this.setAxis();
  }

  setLineStyle(line) {
    if (line == "axis") {
      // Les axes
      this.context.lineWidth = 1;
      this.context.strokeStyle = axisColor;
    } else {
      this.context.lineWidth = 0.5;

      if (line % 8 === 0) {
        if (this.zoom > 0) {
          this.context.strokeStyle = "rgba(250,250,250,0.9)";
        } else if (this.zoom < 0) {
          this.context.strokeStyle =
            "rgba(250,250,250," +
            this.setOpacity(this.cellSize / this.minCellSize, 0.9, 0.6) +
            ")";
        }
      } else if (line % 4 === 0) {
        if (this.zoom > 0) {
          this.context.strokeStyle =
            "rgba(250,250,250," +
            this.setOpacity(this.cellSize / this.minCellSize, 0.6, 0.9) +
            ")";
        } else if (this.zoom < 0) {
          this.context.strokeStyle =
            "rgba(250,250,250," +
            this.setOpacity(this.cellSize / this.minCellSize, 0.6, 0.2) +
            ")";
        }
      } else {
        if (this.zoom > 0) {
          this.context.strokeStyle =
            "rgba(250,250,250," +
            this.setOpacity(this.cellSize / this.minCellSize, 0, 0.14) +
            ")";
        } else if (this.zoom < 0) {
          this.context.strokeStyle =
            "rgba(250,250,250," +
            this.setOpacity(this.cellSize / this.minCellSize, 0.05, 0) +
            ")";
        }
      }
    }
  }

  setGridLines(direction: "v" | "h", line) {
    // Styler
    this.setLineStyle(line);

    if (direction === "v") {
      // Tracer
      const y = this.axisPosY + this.cellSize * line;
      this.context.beginPath();
      this.context.moveTo(0, y);
      this.context.lineTo(this.width, y);
    } else if (direction === "h") {
      // Tracer
      const x = this.axisPosX + this.cellSize * line;
      this.context.beginPath();
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.height);
    }

    this.context.stroke();
    this.context.closePath();
  }

  setGridValues(direction, line) {
    // Styler
    this.context.font = "12px Arial";
    this.context.fillStyle = "#aaaaaa";

    // Tracer
    this.context.beginPath();

    if (direction === "v" && line % 4 === 0 && line !== 0) {
      let value = String(-line / this.ratio);
      let valueOffset = this.context.measureText(value).width + 15;
      this.context.textAlign = "right";

      if (this.axisPosX >= this.width) {
        this.context.fillText(
          value,
          this.width - 15,
          this.axisPosY - line * -this.cellSize + 3
        );
      } else if (this.axisPosX <= valueOffset + 15) {
        this.context.fillText(
          value,
          valueOffset,
          this.axisPosY - line * -this.cellSize + 3
        );
      } else {
        this.context.fillText(
          value,
          this.axisPosX - 15,
          this.axisPosY + line * this.cellSize + 3
        );
      }
    } else if (direction === "h" && line % 4 === 0 && line !== 0) {
      let value = String(line / this.ratio);
      this.context.textAlign = "center";

      if (this.axisPosY >= this.height - this.canvas.offsetTop) {
        this.context.fillText(
          value,
          this.axisPosX + line * this.cellSize,
          this.height - 20
        );
      } else if (this.axisPosY <= 0) {
        this.context.fillText(value, this.axisPosX + line * this.cellSize, 20);
      } else {
        this.context.fillText(
          value,
          this.axisPosX + line * this.cellSize,
          this.axisPosY + 20
        );
      }
    }

    this.context.closePath();
  }

  setAxis() {
    // Styler
    this.setLineStyle("axis");

    //Tracer
    this.context.beginPath();

    // Tracer l'horizontale
    this.context.moveTo(0, this.axisPosY);
    this.context.lineTo(this.width, this.axisPosY);
    // Tracer la verticale
    this.context.moveTo(this.axisPosX, 0);
    this.context.lineTo(this.axisPosX, this.height);

    this.context.stroke();
    this.context.closePath();

    // Numéroter le point 0
    this.context.font = "12px arial";
    this.context.fillStyle = "#aaaaaa";
    this.context.textAlign = "center";
    this.context.beginPath();
    this.context.fillText("0", this.axisPosX - 15, this.axisPosY + 20);
    this.context.closePath();
  }

  setPan(
    mouseStartX: number,
    mouseStartY: number,
    mousePosX: number,
    mousePosY: number
  ) {
    // As long as we pan, the (0;0) coordinate is not updated yet
    const beforeX = mouseStartX / this.cellSize;
    const beforeY = mouseStartY / this.cellSize;

    const afterX = mousePosX / this.cellSize;
    const afterY = mousePosY / this.cellSize;

    const deltaX = afterX - beforeX;
    const deltaY = afterY - beforeY;

    this.axisPosX = this.lastAxisPosX;
    this.axisPosY = this.lastAxisPosY;

    this.axisPosX += deltaX * this.cellSize;
    this.axisPosY += deltaY * this.cellSize;

    this.draw();
  }

  setZoom(zoom: number, mousePosX: number, mousePosY: number) {
    this.zoom = zoom;
    // Calculate the mouse position before applying the zoom
    // in the coordinate system of the grid
    let beforeX = (mousePosX - this.axisPosX) / this.cellSize / this.ratio;
    let beforeY = (mousePosY - this.axisPosY) / this.cellSize / this.ratio;

    this.cellSize = this.cellSize + this.zoom;
    // Limit the precision of the ratio variable
    this.ratio = parseFloat(this.ratio.toExponential(8));

    // check if zoom should subdivide or combine
    if (this.cellSize >= 2 * this.minCellSize) {
      if (Math.abs(Math.log2(this.gen)) % 3 === 0) {
        this.cellSize = 20;
        this.gen *= 2;
        this.ratio *= 2;
      } else if (Math.abs(Math.log2(this.gen)) % 3 === 1) {
        this.cellSize = 16;
        this.gen *= 2;
        if (this.gen > 1) {
          this.ratio *= 2.5;
        } else {
          this.ratio *= 2;
        }
      } else if (Math.abs(Math.log2(this.gen)) % 3 === 2) {
        this.cellSize = 20;
        this.gen *= 2;
        if (this.gen > 1) {
          this.ratio *= 2;
        } else {
          this.ratio *= 2.5;
        }
      }
    } else if (this.cellSize < this.minCellSize / 2) {
      if (Math.abs(Math.log2(this.gen)) % 3 === 0) {
        this.ratio /= 2;
        this.cellSize = 20;
        this.gen /= 2;
      } else if (Math.abs(Math.log2(this.gen)) % 3 === 1) {
        if (this.gen < 1) {
          this.ratio /= 2.5;
        } else {
          this.ratio /= 2;
        }

        this.cellSize = 16;
        this.gen /= 2;
      } else if (Math.abs(Math.log2(this.gen)) % 3 === 2) {
        if (this.gen < 1) {
          this.ratio /= 2;
        } else {
          this.ratio /= 2.5;
        }

        this.cellSize = 20;
        this.gen /= 2;
      }
    }

    // After zoom, you'll see the coordinates changed
    let afterX = (mousePosX - this.axisPosX) / this.cellSize / this.ratio;
    let afterY = (mousePosY - this.axisPosY) / this.cellSize / this.ratio;

    // Calculate the shift
    const deltaX = afterX - beforeX;
    const deltaY = afterY - beforeY;

    // "Undo" the shift by shifting the coordinate system's center
    this.axisPosX += deltaX * this.cellSize * this.ratio;
    this.axisPosY += deltaY * this.cellSize * this.ratio;

    // Get last (0;0) coordinates
    this.lastAxisPosX = this.axisPosX;
    this.lastAxisPosY = this.axisPosY;
    this.draw();
  }

  setOpacity(zoomLevel, val1, val2) {
    if (this.zoom > 0) {
      this.opacityMin = val1;
      this.opacityMax = val2;
      this.zoomMin = 1;
      this.zoomMax = 2;
    } else if (this.zoom < 0) {
      this.opacityMin = val2;
      this.opacityMax = val1;
      this.zoomMin = 0.5;
      this.zoomMax = 1;
    }

    const zoomRange = this.zoomMax - this.zoomMin;
    const opacityRange = this.opacityMax - this.opacityMin;
    const zoomLevelPercent = (zoomLevel - this.zoomMin) / zoomRange;
    const opacityLevel = opacityRange * zoomLevelPercent + this.opacityMin;
    return opacityLevel;
  }
}
