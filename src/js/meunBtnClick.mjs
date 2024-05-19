import DrawingCanvas from "./DrawinfCanvas.mjs";

const newFileBtn = document.getElementById("new-file-btn");
const saveFileBtn = document.getElementById("save-file-btn");

const newFileModal = document.getElementById("new-file-modal");
function init() {
  newFileBtn.addEventListener("click", () => {
    newFileModal.classList.add("modal-active");
  });
}

export { init };
