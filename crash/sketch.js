let dataObject;
let data;
let loc = {
  lat: {
    min: 90,
    max: -90,
  },
  lon: {
    min: 180,
    max: -180,
  },
};

function preload() {
  dataObject = loadJSON(
    "https://genxp-2411.github.io/assets/datasets/Motor-Vehicle-Crashes/Motor-Vehicle-Crashes.json"
  );
}

function sortByTimestamp(crashA, crashB) {
  return crashA.timestamp - crashB.timestamp;
}

let drawDim;
let timeRange;
let time0;
let timePadding = 3600 * 1000;
let timeScale = 3600;

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(1);

  data = Object.values(dataObject);
  drawDim = min(windowWidth, windowHeight);

  // pre-process data
  for (let i = 0; i < data.length; i++) {
    // add a combined datetime field
    data[i].timestamp = Date.parse(
      `${data[i]["CRASH_DATE"]} ${data[i]["CRASH_TIME"]}`
    );

    // get min and max for crash latitude and longitude
    if (data[i].LATITUDE != 0) {
      loc.lat.min = min(loc.lat.min, data[i].LATITUDE);
      loc.lat.max = max(loc.lat.max, data[i].LATITUDE);
    }

    if (data[i].LONGITUDE != 0) {
      loc.lon.min = min(loc.lon.min, data[i].LONGITUDE);
      loc.lon.max = max(loc.lon.max, data[i].LONGITUDE);
    }
  }

  // sort by timestamp
  data.sort(sortByTimestamp);

  time0 = data[0].timestamp;
  timeRange = data[data.length - 1].timestamp - data[0].timestamp + timePadding;
}

let crashCircles = [];
let dataIndex = 0;

function addCrashCircle(crash) {
  let cCircle = {
    x: map(crash.LONGITUDE, loc.lon.min, loc.lon.max, 0, drawDim),
    y: map(crash.LATITUDE, loc.lat.min, loc.lat.max, drawDim, 0),
    d: 0,
    a: 255,
    v: random(1, 2),
  };
  crashCircles.push(cCircle);
}

function isVisible(cCircle) {
  return cCircle.a > 0;
}

function drawCrashCircle(cCircle) {
  noFill();
  stroke(0, cCircle.a);
  ellipse(cCircle.x, cCircle.y, cCircle.d, cCircle.d);
}

function drawTimeText(millisIdx) {
  noStroke();
  fill(255);
  rect(10, 6, 150, 20);
  fill(0);
  text(new Date(millisIdx).toLocaleString(), 20, 20);
}

function updateCrashCircle(cCircle) {
  cCircle.a = max(0, cCircle.a - cCircle.v);
  cCircle.d = (255 - cCircle.a) / 2;
}

function draw() {
  background(255, 2);

  let millisRelative = (millis() * timeScale) % timeRange;
  let millisIdx = millisRelative + time0 - timePadding;

  drawTimeText(millisIdx);

  if (data[dataIndex].timestamp < millisIdx) {
    addCrashCircle(data[dataIndex]);
    dataIndex += 1;
  }
  if (dataIndex >= data.length || millisIdx < data[0].timestamp) {
    dataIndex = 0;
  }

  crashCircles.forEach(updateCrashCircle);
  crashCircles = crashCircles.filter(isVisible);
  crashCircles.forEach(drawCrashCircle);
}
