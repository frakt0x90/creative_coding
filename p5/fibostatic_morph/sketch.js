function to_rad(angle) {
    return (angle % 360) * (PI / 180);
}

function areApproxEqual(array1, array2, threshold){
  return array1.length === array2.length && array1.every(function(value, index) { return abs(value - array2[index]) < threshold});
}

function fibo_angles(n, mod) {
  vals = [1];
  a = 1;
  b = 1;
  for (let i=0; i < n; i++) {
    vals.push(b % mod);
    temp = b % mod;
    b = a + temp;
    a = temp;
  }
  return vals; 
}

function bouncer(init_point, stroke_len, angles) {
  coords = [init_point];
  point = init_point;
  radians = 0;
  for (angle of angles) {
    radians = (radians + to_rad(angle)) % (TWO_PI);
    new_point = [point[0] + stroke_len * Math.cos(radians), point[1] + stroke_len * Math.sin(radians)];
    coords.push(new_point);
    point = new_point;
  }
  return coords;
}

function fiboBouncer(init_point, stroke_len, angles) {
  coords = [init_point];
  point = init_point;
  pointMatches = 0;
  radians = 0;
  for (angle of angles) {
    radians = (radians + to_rad(angle)) % (TWO_PI);
    new_point = [point[0] + stroke_len * Math.cos(radians), point[1] + stroke_len * Math.sin(radians)];
    if (areApproxEqual(new_point, coords[pointMatches], 1e-3)) {
      pointMatches++;
      if (pointMatches == 3) {
        coords.pop();
        break;
      }
    } else {
      pointMatches = 0;
    }
    coords.push(new_point);
    point = new_point;
  }
  return coords;
}

function getBounds(points) {
  maxY = -10000;
  minY = 10000;
  maxX = -10000;
  minX = 10000;

  for (point of points) {
    if (point[0] > maxX) {
      maxX = point[0];
    }
    if (point[0] < minX) {
      minX = point[0];
    }
    if (point[1] > maxY) {
      maxY = point[1];
    }
    if (point[1] < minY) {
      minY = point[1];
    }
  }

  return {'maxX': maxX, 'maxY': maxY, 'minX': minX, 'minY': minY, 'width': abs(maxX - minX), 'height': abs(maxY - minY)};
}

function shift(points, amountX, amountY) {
  for (let i=0; i < points.length; i++) {
    points[i][0] = points[i][0] + amountX;
    points[i][1] = points[i][1] + amountY;
    }
}

function contract(points, amount) {
  for (let i=0; i < points.length; i++) {
    points[i][0] = points[i][0] * amount;
    points[i][1] = points[i][1] * amount;
    }
}

function linspace(from, to, size){
  vals = [from];
  interval = (to - from) / size;
  curval = from;
  while (curval < to) {
    curval = curval + interval;
    vals.push(curval);
  }
  return vals;
}

function spaced(from, to, interval){
  vals = [from];
  curval = from;
  while (curval < to) {
    curval = curval + interval;
    vals.push(curval);
  }
  return vals;
}

function setup() {
  size = 512;
  margin = 40;
  canvasSize = size + 2 * margin;
  nPoints = 50000;
  //data = []

  createCanvas(canvasSize, canvasSize);
  strokeWeight(1);
  stroke(147, 222, 239);
  textSize(24);
  frameRate(10);

  modvals = spaced(19, 360, .001);
  modvalIndex = 0;
}

function draw() {
  clear();
  points = fiboBouncer([0, 0], 15, fibo_angles(nPoints, round(modvals[modvalIndex], 3)));
  text(`period: ${points.length-1}`, 10, 30);
  text(`mod: ${round(modvals[modvalIndex], 3)}`, size-50, 30);
  bounds = getBounds(points);
  scaleFactor = size / bounds.width;
  contract(points, scaleFactor);
  shift(points, -bounds.minX * scaleFactor + margin, -bounds.minY * scaleFactor + margin);

  for (let pointIndex = 0; pointIndex < points.length - 1; pointIndex++) {
    p1 = points[pointIndex];
    p2 = points[pointIndex + 1];
    line(p1[0], p1[1], p2[0], p2[1]);
  }
  modvalIndex++;
  if (modvalIndex >= modvals.length){
    noLoop();
  }
}

