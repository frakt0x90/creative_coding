function to_rad(angle) {
    return (angle % 360) * (PI / 180);
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

function findPeriod(points) {
  initVal = points[0];
  for (let i=1; i < points.length; i++) {
    comparePoint = [round(points[i][0]), round(points[i][1])];
    if (comparePoint[0] == initVal[0] && comparePoint[1] == initVal[1]) {
      return i.toString();
    }
  }
  return 'inf'
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

function setup() {
  size = 1000;
  mod = 1;
  nPoints = 50000;
  points = bouncer([size/2, size/2], 15, fibo_angles(nPoints, mod));
  pointIndex = 0;

  function modIncClicked() {
    mod++;
    clear();
    //background(239, 162, 201);
    points = bouncer([size/2, size/2], 10, fibo_angles(nPoints, mod));
    pointIndex = 0;
    textSize(32);
    text(findPeriod(points), 100, 30);
    text(mod.toString(), 100, 60);
  }

  createCanvas(size, size);
  //background(239, 162, 201);
  strokeWeight(2);
  r = 147;
  g = 222;
  b = 239;
  stroke(r, g, b);
  b = 239;
  let modIncButton = createButton('mod + 1');
  modIncButton.position(0, 0);
  modIncButton.mouseClicked(modIncClicked);
  textSize(32);
  text(findPeriod(points), 100, 30);
}

function draw() {
  p1 = points[pointIndex];
  p2 = points[pointIndex + 1];
  line(p1[0], p1[1], p2[0], p2[1]);
  pointIndex++;
  if (pointIndex >= nPoints - 1) {
    noLoop();
  }
}
