export function resolveCollisions(objectList, resolveObject, options) {
  const item = resolveObject;

  const {
    sWidth, sHeight,
  } = item.icon;

  let dx = 0;
  let dy = 0;

  objectList.forEach((element) => {
    if (options.speed.x > 0 && item.x > element.x - sWidth) {
      dx = element.x - sWidth - item.x;
    } else if (options.speed.x < 0 && item.x < element.x + element.icon.sWidth) {
      dx = element.x + element.icon.sWidth - item.x;
    }

    if (options.speed.y > 0 && item.y > element.y - sHeight) {
      dy = element.y - sHeight - item.y;
    } else if (options.speed.y < 0 && item.y < element.y + element.icon.sHeight) {
      dy = element.y + element.icon.sHeight - item.y;
    }

    if (Math.abs(dx) < Math.abs(dy) || dy === 0) {
      item.x += dx;
    }

    if (Math.abs(dy) < Math.abs(dx) || dx === 0) {
      item.y += dy;
    }
  });
}

export function searchCollisions(objectList, resolveObject) {
  return objectList.filter((element) => {
    if (resolveObject.x >= element.x + element.icon.sWidth) {
      return false;
    }

    if (resolveObject.x <= element.x - resolveObject.icon.sWidth) {
      return false;
    }

    if (resolveObject.y >= element.y + element.icon.sHeight) {
      return false;
    }

    if (resolveObject.y <= element.y - resolveObject.icon.sHeight) {
      return false;
    }

    if (element === resolveObject) {
      return false;
    }

    return true;
  });
}
