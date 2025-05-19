let dataObject;
let data;

function preload() {
  dataObject = loadJSON(
    "https://genxp-2411.github.io/assets/datasets/Global-Inflation/Global-Inflation.json"
  );
}

let minDiam = 2;
let maxDiam = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  data = Object.values(dataObject);

  // get min and max for all inflation values
  for (let i = 0; i < data.length; i++) {
    let country = {
      min: data[i][1970],
      max: data[i][1970]
    };

    for (let yr = 1970; yr < 2023; yr++) {
      country.min = min(country.min, data[i][yr]);
      country.max = max(country.max, data[i][yr]);
    }

    // add new fields to data: country min and max
    data[i].min = country.min;
    data[i].max = country.max;
  }
}

function draw() {
  background(0);

  noStroke();
  let numCountries = data.length / 2;

  // show individual data points for half of the data
  for (let ci = 0; ci < numCountries; ci++) {
    let x = map(ci, 0, numCountries, maxDiam / 2, width - maxDiam / 2);

    for (let yr = 1970; yr < 2023; yr++) {
      let y = map(yr, 1970, 2022, maxDiam / 2, height - maxDiam / 2);
      let d = map(data[ci][yr], data[ci].min, data[ci].max, minDiam, maxDiam);
      ellipse(x, y, d);
    }
  }

  // show average of all data by year
  for (let yr = 1970; yr < 2023; yr++) {
    let sum = 0;

    for (let ci = 0; ci < data.length; ci++) {
      sum += map(data[ci][yr], data[ci].min, data[ci].max, 0.0, 1.0);
    }
    let average = sum / data.length;

    let y = map(yr, 1970, 2022, maxDiam / 2, height - maxDiam / 2);
    let d = average * 10 * maxDiam;
    fill(200, 0, 0);
    ellipse(width/2, y, d);
  }

  noLoop();
}
