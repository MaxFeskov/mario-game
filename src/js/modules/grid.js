export default function drawGrid(context, step = 32) {
  const {
    width, height,
  } = context.canvas;

  for (let x = 0; x < width; x += step) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();

    context.fillText(x / step, x, 10);
  }

  for (let y = 0; y < height; y += step) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();

    const ceil = y / step;

    for (let i = 0; i < 23; i += 1) {
      context.fillText(15 - ceil, 320 * i, y);
    }
  }
}
