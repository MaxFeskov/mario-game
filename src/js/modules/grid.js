export default function drawGrid(ctx, step = 32) {
  const context = ctx;

  context.save();
  const {
    width, height,
  } = context.canvas;

  context.strokeStyle = '#000';
  context.fillStyle = '#fff';
  context.lineWidth = 0.25;

  for (let x = 0; x < width; x += step) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();

    context.fillText(x / step, x, height / 2);
  }

  for (let y = 0; y < height; y += step) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();

    for (let i = 0; i < 23; i += 1) {
      context.fillText(y / step, 320 * i, y + 10);
    }
  }

  context.restore();
}
