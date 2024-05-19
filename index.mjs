import DrawingCanvas from "./src/js/DrawinfCanvas.mjs";
import { onMenuHoverEffect } from "./src/js/menuHover.mjs";
import { init } from "./src/js/meunBtnClick.mjs";
import { initNewFileModal } from "./src/js/newFileModal.mjs";
import { docWidthInput, docHeightInput } from "./src/js/newFileModal.mjs";
import { NEW_DOC_CREATED } from "./src/js/newFileModal.mjs";

const wrapper = document.getElementById("canvas-wrapper");
const ACTIVE_CANVAS_CHANGED_EVENT = "activeCanvasChanged";
const activeCanvasChanged = new Event(ACTIVE_CANVAS_CHANGED_EVENT);

onMenuHoverEffect();
init();
initNewFileModal();

let canvasArray = [];
let baseCanvas = null;
let docDimentions = {};
let scale = 1;
let activeCanvas = null;

const tools = {
  brush: "brush",
  line: "line",
  rect: "rect",
  circle: "circle",
};
let currentTool = tools.brush;

const brushBtn = document.getElementById("brush-tool-btn");
const lineBtn = document.getElementById("line-tool-btn");
const rectBtn = document.getElementById("rect-tool-btn");
const circleBtn = document.getElementById("circle-tool-btn");

brushBtn.classList.add("active-tool");

const toolBtnArray = [brushBtn, lineBtn, rectBtn, circleBtn];

brushBtn.addEventListener("click", () => {
  currentTool = tools.brush;
  toolBtnArray.forEach((btn) => {
    if (btn != brushBtn) {
      btn.classList.remove("active-tool");
    } else {
      btn.classList.add("active-tool");
    }
  });
});
lineBtn.addEventListener("click", () => {
  currentTool = tools.line;
  toolBtnArray.forEach((btn) => {
    if (btn != lineBtn) {
      btn.classList.remove("active-tool");
    } else {
      btn.classList.add("active-tool");
    }
  });
});
rectBtn.addEventListener("click", () => {
  currentTool = tools.rect;
  toolBtnArray.forEach((btn) => {
    if (btn != rectBtn) {
      btn.classList.remove("active-tool");
    } else {
      btn.classList.add("active-tool");
    }
  });
});
circleBtn.addEventListener("click", () => {
  currentTool = tools.circle;
  toolBtnArray.forEach((btn) => {
    if (btn != circleBtn) {
      btn.classList.remove("active-tool");
    } else {
      btn.classList.add("active-tool");
    }
  });
});

//events

let initX = 0;
let initY = 0;
let currentX = 0;
let currentY = 0;
let isDrawing = false;
let isMouseDown = false;

let tempLayer = null;

const saveBtn = document.getElementById("save-file-btn");
saveBtn.addEventListener("click", saveImage);

window.addEventListener(NEW_DOC_CREATED, (e) => {
  resetAppState();
  docDimentions = {
    width: Number.parseInt(docWidthInput.value),
    height: Number.parseInt(docHeightInput.value),
  };
  baseCanvas = new DrawingCanvas(
    wrapper,
    docDimentions,
    "canvas",
    canvasArray.length
  );
  canvasArray.push(baseCanvas);
  scale = dertermineScale(docDimentions.width, docDimentions.height);
  activeCanvas = canvasArray[0];
  activeCanvas.canvas.style.scale = scale;
  window.dispatchEvent(activeCanvasChanged);
  const layerWrapper = document.getElementById("layers-wrapper");
  layerWrapper.innerHTML = `<article class="layer" id="0">
      <p class="layer-name ">Layer 1</p>
    </article>`;
});

window.addEventListener(ACTIVE_CANVAS_CHANGED_EVENT, (e) => {
  activeCanvas.canvas.style.scale = scale;
  activeCanvas.canvas.addEventListener("mousedown", (e) => {
    if (currentTool != tools.brush && !tempLayer) {
      tempLayer = new DrawingCanvas(
        wrapper,
        docDimentions,
        "temp",
        canvasArray.length
      );
      canvasArray.push(tempLayer);
      activeCanvas = canvasArray[canvasArray.length - 1];
      window.dispatchEvent(activeCanvasChanged);
    }

    initX = e.offsetX;
    initY = e.offsetY;
    isDrawing = true;
  });

  activeCanvas.canvas.addEventListener("mousemove", (e) => {
    currentX = e.offsetX;
    currentY = e.offsetY;
  });

  activeCanvas.canvas.addEventListener("mouseup", (e) => {
    if (tempLayer && currentTool != tools.brush) {
      const last = canvasArray[canvasArray.length - 1];
      const secondLast = canvasArray[canvasArray.length - 2];

      secondLast.ctx.drawImage(last.canvas, 0, 0);
      last.ctx.clearRect(0, 0, docDimentions.width, docDimentions.height);

      canvasArray.pop();
      activeCanvas.remove();
      tempLayer = null;

      activeCanvas = canvasArray[canvasArray.length - 1];
      window.dispatchEvent(activeCanvasChanged);
    }

    isDrawing = false;
    activeCanvas.ctx.beginPath();
  });

  activeCanvas.canvas.addEventListener("mouseleave", (e) => {
    if (currentTool == tools.brush) {
      isDrawing = false;
      activeCanvas.ctx.beginPath();
    }
  });

  activeCanvas.canvas.addEventListener("mouseenter", () => {
    if (currentTool == tools.brush && isMouseDown) {
      isDrawing = true;
      activeCanvas.ctx.beginPath();
    }
  });
});

window.addEventListener("mousedown", () => {
  isMouseDown = true;
});
window.addEventListener("mouseup", () => {
  isMouseDown = false;
});

updateFrame();
function updateFrame() {
  requestAnimationFrame(updateFrame);
  if (!activeCanvas) return;
  switch (currentTool) {
    case tools.brush:
      drawBrush(activeCanvas.ctx);
      break;
    case tools.line:
      drawLine(activeCanvas.ctx);
      break;
    case tools.rect:
      drawRect(activeCanvas.ctx);
      break;
    case tools.circle:
      drawCircle(activeCanvas.ctx);
      break;
  }
}

const colorInput = document.getElementById("brush-color-input");
const bruhSizeInput = document.getElementById("brush-size-input");

function drawBrush(ctx) {
  if (!isDrawing) return;

  ctx.globalCompositeOperation = "source-over";
  ctx.lineTo(currentX, currentY);
  ctx.lineCap = "round";
  ctx.lineWidth = bruhSizeInput.value;
  ctx.strokeStyle = "rgba(0, 0, 0, 10)";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(currentX, currentY);
}

function drawLine(ctx) {
  if (!isDrawing) return;
  ctx.clearRect(0, 0, docDimentions.width, docDimentions.height);
  ctx.beginPath();
  ctx.moveTo(initX, initY);
  ctx.lineWidth = bruhSizeInput.value;
  ctx.strokeStyle = colorInput.value;
  ctx.lineTo(currentX, currentY);
  ctx.stroke();
}

function drawRect(ctx) {
  if (!isDrawing) return;
  ctx.clearRect(0, 0, docDimentions.width, docDimentions.height);
  ctx.beginPath();

  ctx.lineWidth = bruhSizeInput.value;
  ctx.strokeStyle = colorInput.value;
  ctx.rect(initX, initY, currentX - initX, currentY - initY);
  ctx.stroke();
}

function drawCircle(ctx) {
  if (!isDrawing) return;

  const mag = Math.sqrt(
    Math.pow(currentX - initX, 2) + Math.pow(currentY - initY, 2)
  );

  ctx.clearRect(0, 0, docDimentions.width, docDimentions.height);
  ctx.beginPath();
  ctx.lineWidth = bruhSizeInput.value;
  ctx.strokeStyle = colorInput.value;
  ctx.arc(initX, initY, mag, 0, 2 * Math.PI);
  ctx.stroke();
}

function dertermineScale(width, height) {
  if (width > height) {
    return 0.75 * (1280 / Number.parseInt(docWidthInput.value));
  } else if (width == height) {
    return 0.75 * (720 / Number.parseInt(docHeightInput.value));
  } else {
    return 0.75 * (720 / Number.parseInt(docHeightInput.value));
  }
}

function saveImage() {

  if (activeCanvas == null) {
    console.error("cannot save when no document is present");
    return;
  }

  let saveCanvas = new DrawingCanvas(
    wrapper,
    docDimentions,
    "temp",
    "saving-canvas"
  );
  saveCanvas.canvas.style.scale = dertermineScale(docDimentions.width, docDimentions.height);
  saveCanvas.ctx.fillStyle = "white";
  saveCanvas.ctx.fillRect(0, 0, docDimentions.width, docDimentions.height);
  saveCanvas.ctx.drawImage(activeCanvas.canvas, 0, 0);
  let canvasImage = saveCanvas.canvas.toDataURL("image");

  // this can be used to download any image from webpage to local disk
  let xhr = new XMLHttpRequest();
  xhr.responseType = "blob";
  xhr.onload = function () {
    let a = document.createElement("a");
    a.href = window.URL.createObjectURL(xhr.response);
    a.download = "image_name.png";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    saveCanvas.remove();
    saveCanvas = null;
  };
  xhr.open("GET", canvasImage); // This is to download the canvas Image
  xhr.send();
}

function resetAppState() {
  isDrawing = false;
  isMouseDown = false;
  wrapper.innerHTML = "";
  canvasArray = [];
  activeCanvas = null;
  tempLayer = null;
}
