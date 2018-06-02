export function minAbsValue(...values) {
  const result = values.reduce((min, item) => {
    if (Math.abs(item) === Math.min(Math.abs(min), Math.abs(item))) {
      return item;
    }
    return min;
  });

  return result;
}

export function resolveCollision(objectList, resolveObject) {
  const item = resolveObject;

  const {
    sWidth, sHeight,
  } = item.icon;

  objectList.forEach((element) => {
    const dx1 = element.x - sWidth - item.x;
    const dx2 = element.x + element.icon.sWidth - item.x;

    const dy1 = element.y - sHeight - item.y;
    const dy2 = element.y + element.icon.sHeight - item.y;

    const dx = minAbsValue(dx1, dx2);
    const dy = minAbsValue(dy1, dy2);
    const delta = minAbsValue(dx, dy);

    if (delta === dx) {
      item.x += dx;
    } else {
      item.y += dy;
    }
  });
}

export function resolveCollisions(collisionList) {
  collisionList.forEach((item) => {
    resolveCollision(item.collisions, item.element);
  });
}

export function searchCollisions(objectList, resolveObjects) {
  const collisionList = [];

  resolveObjects.forEach((item) => {
    const itemCollission = objectList.filter((element) => {
      if (item.x >= element.x + element.icon.sWidth) {
        return false;
      }

      if (item.x <= element.x - item.icon.sWidth) {
        return false;
      }

      if (item.y >= element.y + element.icon.sHeight) {
        return false;
      }

      if (item.y <= element.y - item.icon.sHeight) {
        return false;
      }

      if (element === item) {
        return false;
      }

      return true;
    });

    if (itemCollission.length && item.type !== 'object') {
      const collisionItem = {
        element: item,
        collisions: itemCollission,
      };

      collisionList.push(collisionItem);
    }
  });

  return collisionList;
}
