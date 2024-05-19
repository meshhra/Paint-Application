const bruhsSizeInput = document.getElementById("brush-size-input");

const newFileModal = document.getElementById("new-file-modal");

const docWidthInput = document.getElementById("doc-width-input");
const docHeightInput = document.getElementById("doc-height-input");

const createBtn = document.getElementById("new-file-create-btn");
const cancelBtn = document.getElementById("new-file-cancel-btn");

const NEW_DOC_CREATED = "newDocCreated";
const newDocCreated = new Event(NEW_DOC_CREATED);

function initNewFileModal() {
  //validate only text

  bruhsSizeInput.addEventListener("input", function (event) {
    this.value = this.value.replace(/[^\d]/g, "");
    if (Number.parseInt(this.value) > 75) {
      this.value = 75;
    }
    if (Number.parseInt(this.value) <= 0) {
      this.value = 1;
    }
  });

  docWidthInput.addEventListener("input", function (event) {
    this.value = this.value.replace(/[^\d]/g, "");
    if (Number.parseInt(this.value) > 9999) {
      this.value = 9999;
    }
  });

  docHeightInput.addEventListener("input", function (event) {
    this.value = this.value.replace(/[^\d]/g, "");
    if (Number.parseInt(this.value) > 9999) {
      this.value = 9999;
    }
  });

  createBtn.addEventListener("click", () => {
    window.dispatchEvent(newDocCreated);
    newFileModal.classList.remove("modal-active");
  });

  cancelBtn.addEventListener("click", () => {
    newFileModal.classList.remove("modal-active");
  });
}

export { initNewFileModal };
export { docWidthInput, docHeightInput };
export { NEW_DOC_CREATED, newDocCreated };
