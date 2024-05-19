class DrawingCanvas {
  constructor(parent, {width, height}, className, id) {
    this.canvas = document.createElement("canvas");
    this.width = width;
    this.height = height;

    this.canvas.height = height;
    this.canvas.width = width;
    this.canvas.classList.add(className);
    this.canvas.id = id;
    this.id = id;

    this.ctx = this.canvas.getContext("2d");

    parent.append(this.canvas);
    this.remove = () => {
      parent.removeChild(this.canvas);
    };
  }
}

export default DrawingCanvas;
