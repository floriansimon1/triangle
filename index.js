"use strict";

const width  = 500;
const height = 500;

const putPixel = (image, x, y, { r, g, b }) => {
  const pixelIndex = 4 * ((height - y) * width + x);

  image.data[pixelIndex]     = r;
  image.data[pixelIndex + 1] = g;
  image.data[pixelIndex + 2] = b;
};

const canvasElement = document.querySelector("canvas");

const vectorFrom = ({ x: x1, y: y1}, { x: x2, y: y2 }) => ({
  x: x2 - x1,
  y: y2 - y1
});

const crossProduct = (a, b) => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - b.z * a.x,
  z: a.x * b.y - a.y * b.x
});

// Relies on barycentric coordinates calculations.
const pointInTriangle = (p, a, b, c) => {
  const ab = vectorFrom(a, b);
  const ac = vectorFrom(a, c);
  const pa = vectorFrom(p, a);

  const zCoordinates = crossProduct(
    {
      x: ab.x,
      y: ac.x,
      z: pa.x
    },
    {
      x: ab.y,
      y: ac.y,
      z: pa.y
    }
  );

  return (
    1 - (zCoordinates.x + zCoordinates.y) / zCoordinates.z >= 0
    && zCoordinates.x / zCoordinates.z >= 0
    && zCoordinates.y / zCoordinates.z >= 0
  );
};

const triangle = (image, { a, b, c }, color) => {
  const [minX, minY, maxX, maxY] = [
    Math.max(Math.min(a.x, b.x, c.x), 0),
    Math.max(Math.min(a.y, b.y, c.y), 0),
    Math.min(Math.max(a.x, b.x, c.x), width),
    Math.min(Math.max(a.y, b.y, c.y), height)
  ];

  for (var x = minX; x <= maxX; x++) {
    for (var y = minY; y <= maxY; y++) {
      if (pointInTriangle({ x, y }, a, b, c)) {
        putPixel(image, x, y, color);
      }
    }
  }

  putPixel(image, a.x, a.y, { r: 255, g: 0, b: 0 });
  putPixel(image, b.x, b.y, { r: 255, g: 0, b: 0 });
  putPixel(image, c.x, c.y, { r: 255, g: 0, b: 0 });
};

let context = canvasElement.getContext('2d');

context.imageSmoothingEnabled = false;

let image = context.createImageData(width, height);

for (let it = 0; it < width * height * 4; it += 4) {
  image.data[it + 3] = 255;
}

const lineColor = { r: 255, g: 255, b: 255 };

const points = {
  a: {
    x: 20,
    y: 20
  },

  b: {
    x: 150,
    y: 30
  },

  c: {
    x: 50,
    y: 70
  }
};

triangle(image, points, lineColor);

context.putImageData(image, 0, 0);
