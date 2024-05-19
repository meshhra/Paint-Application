class DrawingCanvas {
  constructor(width, height, className, id) {
    this.canvas = document.createElement("canvas");
    this.width = width;
    this.height = height;

    this.canvas.height = height;
    this.canvas.width = width;
    this.canvas.classList.add(className);
    this.canvas.id = id;
    this.id = id;

    this.ctx = this.canvas.getContext("2d");

    const wrapper = document.getElementById("canvas-wrapper");
    wrapper.append(this.canvas);
    this.remove = () => {
      wrapper.removeChild(this.canvas);
    }
  }
}

export default DrawingCanvas;
