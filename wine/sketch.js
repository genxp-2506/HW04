let dataObject;
let data;

let priceMin;
let priceMax;
let pointsMin;
let pointsMax;

function preload() {
  dataObject = loadJSON("https://genxp-2411.github.io/assets/datasets/Winemag/Winemag.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  data = Object.values(dataObject);

  // determine smallest and largest values for price and points
  for (let i = 0; i < data.length; i++) {
    let points = data[i].points;
    let price = data[i].price;

    priceMin = min(priceMin, price);
    priceMax = max(priceMax, price);
    pointsMin = min(pointsMin, points);
    pointsMax = max(pointsMax, points);
  }
  noLoop();
}

function draw() {
  background(0);
  noFill();
  stroke(190, 20, 255);

  // draw a visualization relating price to points
  for (let i = 0; i < data.length; i++) {
    let x = map(data[i].points, pointsMin, pointsMax, 20, width);
    let d = map(data[i].price, priceMin, priceMax, 20, width);
    ellipse(x, height / 2, d, d);
  }
}
