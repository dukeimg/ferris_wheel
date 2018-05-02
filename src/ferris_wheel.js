var ctx, direction, dir, screenSize, containerScale, zones, x, y;
var inside = false;
var wheelIsSpinnig = true;
var lastSteps = 2;

const getById = (id) => {
  return document.getElementById(id)
};

const canvas = getById('canvas');

function adjust() {
  screenSize = window.innerWidth;

  if (screenSize >= 950) {
    containerScale = 1;
  } else {
    containerScale = (screenSize / 950).toFixed(2);
  }

  zones = {
    0: {
      x: 82.5 * containerScale,
      y: 468 * containerScale
    },
    1: {
      x: 136.5 * containerScale,
      y: 285 * containerScale
    },
    2: {
      x: 280.5 * containerScale,
      y: 143 * containerScale
    },
    3: {
      x: 475 * containerScale,
      y: 90 * containerScale
    },
    4: {
      x: 667.5 * containerScale,
      y: 145 * containerScale
    },
    5: {
      x: 809.5 * containerScale,
      y: 283 * containerScale
    },
    6: {
      x: 865.5 * containerScale,
      y: 458 * containerScale
    }
  };

  x = 475 * containerScale;
  y = 475 * containerScale;

  if (!wheelIsSpinnig) {
    window.requestAnimationFrame(function () {
      drawFrame(lastSteps, 1);
    });
  }

  canvas.style.height = y;
}

adjust();

window.addEventListener('resize', adjust);

var wheelApp = {
  brands: [],
  wheelBrands: [],
  initWheel: function () {
    const runWheel = () => {
      wheelApp.wheelBrands = [];
      while (wheelApp.wheelBrands.length < 12 + wheelApp.brands.length) {
        wheelApp.wheelBrands = wheelApp.wheelBrands.concat(wheelApp.brands);
      }

      document.getElementsByClassName('loading')[0].style.display = 'none';
      getById('canvas').style.display = 'block';
      document.getElementsByClassName('jumbotron')[0].getElementsByClassName('selector')[0].classList.add('active');
      animate('forward', 2);
      setTimeout(function () {
        wheelIsSpinnig = false;
      }, 1200)
    };

    const imageCount = this.brands.length;
    let imagesLoaded = 0;

    const preloadImage = src => {
      let image = new Image(125, 125);
      image.src = src;
      return image;
    };

    this.brands = this.brands.map((brand) => {
      brand.image = preloadImage(brand.image);
      brand.image.onload = function () {
        imagesLoaded++;
        if (imagesLoaded === imageCount) {
          runWheel();
        }
      };
      return brand;
    });

    getById('visible-brand').addEventListener('click', function (e) {
      e.preventDefault();

      var url = wheelApp.currentBrand.url;
      var target = wheelApp.currentBrand.newPage === 'True' ? '_blank' : '_self';
      window.open(url, target);
    })
  }
};

var shift = 0; // Defines wheel rotation shift

// Init canvas
ctx = canvas.getContext('2d');

// Define animation rotator
// Rotator in a multiplier used to rotate canvas for animation spinning.

var rotator = 0;

// Define functions

var clearCircle = function(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.clip();
  ctx.clearRect(x - radius - 1, y - radius - 1, radius * 2 + 2, radius * 2 + 2);
  ctx.closePath();
};

function drawCircle(x, y, radius, startAngle, endAngle, anticlockwise) {
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
  ctx.stroke();
}

function drawLine(ctx, startPoint, endPoint) {
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
}

function rotate(x, y, xm, ym, a) {
  var cos = Math.cos;
  var sin = Math.sin;

  a = a * Math.PI / 180;

  var xr = (x - xm) * cos(a) - (y - ym) * sin(a)   + xm;
  var yr = (x - xm) * sin(a) + (y - ym) * cos(a)   + ym;

  return [xr, yr];
}

var setBrandTitleIsTriggered = false;
var shadowBrand = getById('shadow-brand');
var visibleBrand = getById('visible-brand');
function setBrandTitle(title, steps) {
  if (!setBrandTitleIsTriggered) {
    var width;
    setBrandTitleIsTriggered = true;

    shadowBrand.innerHTML = title;
    width = shadowBrand.offsetWidth;
    visibleBrand.innerHTML = '&nbsp;';
    visibleBrand.style.width = width + 'px';
    setTimeout(function () {
      visibleBrand.innerHTML = title;
    }, 600);
    setTimeout(function () {
      setBrandTitleIsTriggered = false;
    }, 600 * steps + 25);
  }
}

function drawFrame(steps, progress) {
  ctx.canvas.width = ctx.canvas.width;
  ctx.globalCompositeOperation = 'destination-over';

  // Use rotator to rotate canvas
  ctx.translate(x, y);
  ctx.rotate((Math.PI / 180) * rotator);
  ctx.translate(-x, -y);

  var angle =  Math.PI / 180 * (-rotator - 90);
  var x2 = x + Math.cos(angle) * x;
  var y2 = y + Math.sin(angle) * y;

  var gradient = ctx.createLinearGradient(x, y, x2, y2);
  gradient.addColorStop(0, '#bec7cf');
  gradient.addColorStop(1, 'white');
  ctx.fillStyle = 'transparent';
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 10 * containerScale;

  // Draw wheel elements
  var startAngle = 0;
  var endAngle = 360;
  var anticlockwise = false;

  var circles = [395 * containerScale, 430 * containerScale];

  for (var i = 0; i < circles.length; i++) {
    drawCircle(x, y, circles[i], startAngle, endAngle, anticlockwise);
  }

  // Draw lines
  ctx.save();

  for (var i = 0; i < 6; i++) {
    var startPoint = {
      x: 457.5 * containerScale,
      y: 80 * containerScale
    };
    var endPoint = {
      x: 457.5 * containerScale,
      y: 870 * containerScale
    };
    var startPoint2 = {
      x: 492.5 * containerScale,
      y: 80 * containerScale
    };
    var endPoint2 = {
      x: 492.5 * containerScale,
      y: 870 * containerScale
    };
    ctx.translate(x,  y);
    ctx.rotate((Math.PI / 180) * 30);
    ctx.translate(-x, -y);
    drawLine(ctx, startPoint, endPoint);
    drawLine(ctx, startPoint2, endPoint2);
  }

  ctx.restore();
  ctx.stroke();

  // Making emptiness for brands

  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = '#fff';

  var x3, y3; // coords of brand images
  var wheelOffset = 120; // wheel offset in degrees

  if (dir == 'b') {
    wheelOffset = 30 * 3;
  } else {
    wheelOffset = 30 * (3 + steps);
  }

  ctx.translate(x,  y);
  ctx.rotate((Math.PI / 180) * -wheelOffset);
  ctx.translate(-x, -y);

  var range, title;
  if (dir == 'b') {
    if (shift + 7 + steps > wheelApp.wheelBrands.length) {
      shift -= wheelApp.wheelBrands.length - 7 - steps;
    }
    range = wheelApp.wheelBrands.slice(shift, shift + 7 + steps);
    title = range[3 + steps].name;
    wheelApp.currentBrand = range[3 + steps];
  } else {
    range = wheelApp.wheelBrands.slice(shift, shift + 7 + steps);
    title = range[3].name;
    wheelApp.currentBrand = range[3];
  }

  setBrandTitle(title, steps);


  for (var t = 0; t < 7 + steps; t++) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = '#fff';

    var angle3 =  Math.PI / 180 * (rotator - wheelOffset + (30 * t));
    x3 = x;
    y3 = (85 + 5 * Math.cos(angle3)) * containerScale;

    ctx.beginPath();
    drawCircle(x3, y3, 84 * containerScale, startAngle, endAngle, anticlockwise);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    ctx.translate(x3,  y3);
    ctx.rotate(-angle3);

    var a, b;
    if (dir == 'b') {
      a = 3 + steps;
      b = 3;
    } else {
      a = 3;
      b = 3 + steps;
    }

    if (t == a) {
      ctx.globalAlpha = 0.6 + 0.4 * progress;
    } else if (t == b) {
      ctx.globalAlpha = 1 - 0.4 * progress;
    } else {
      ctx.globalAlpha = 0.6;
    }

    ctx.globalCompositeOperation = 'destination-over';
    ctx.drawImage(range[t].image, -wheelApp.brands[0].image.width * containerScale / 2,
      -wheelApp.brands[0].image.height * containerScale / 2 , wheelApp.brands[0].image.width * containerScale,
      wheelApp.brands[0].image.height * containerScale);

    ctx.rotate(angle3);
    ctx.translate(-x3, -y3);

    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 1;

    ctx.translate(x,  y);
    ctx.rotate((Math.PI / 180) * 30);
    ctx.translate(-x, -y);
  }

  // Clear circle in the middle
  clearCircle(x, y, 70 * containerScale);
}

var prevSteps = 0;
function animate(direction, steps) {
  if (steps == 0) {return;}
  steps == null ? steps = 1 : null;

  var val = 30 * steps;
  var duration = 600 * steps;

  if (dir == 'f' && direction == 'forward' || dir == null) {
    shift = 0
  } else if (dir == 'b' && direction == 'forward') {
    shift = shift - (steps - prevSteps);
  }

  if (dir == 'b' && direction == 'backward') {
    shift += steps;
    shift = shift - (steps - prevSteps);
  } else if (dir == null) {
    shift = 0;
  }

  prevSteps = steps;

  direction === 'forward' ? dir = 'f' : dir = 'b';


  if (shift > wheelApp.brands.length) {
    shift = shift - wheelApp.brands.length;
  }
  if (shift <= 0) {
    shift = wheelApp.brands.length + shift;
  }

  anim8({
    startValue: 0,
    endValue: val,
    duration: duration,
    step: (now) => {
      let progress = now / val;
      if (direction === 'forward') {
        rotator = now;
      } else if (direction === 'backward') {
        rotator = -(now);
      } else {
        // Nothing
      }
      window.requestAnimationFrame(function () {
        drawFrame(steps, progress);
      });
    }
  })
}

document.getElementsByClassName('arrow-right')[0].addEventListener('click', function (e) {
  e.preventDefault();
  if(!wheelIsSpinnig && !inside) {
    wheelIsSpinnig = true;
    lastSteps = 1;
    animate('forward', 1);
    setTimeout(function () {
      wheelIsSpinnig = false;
    }, 600);
  }
});

document.getElementsByClassName('arrow-left')[0].addEventListener('click', function (e) {
  e.preventDefault();
  if(!wheelIsSpinnig && !inside) {
    wheelIsSpinnig = true;
    lastSteps = 1;
    animate('backward', 1);
    setTimeout(function () {
      wheelIsSpinnig = false;
    }, 600);
  }
});

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

var context = canvas.getContext('2d');

canvas.addEventListener('click', function(evt) {
  var mousePos = getMousePos(canvas, evt);
  for (var c = 0; c < 7; c++) {
    if (Math.sqrt((zones[c].x - mousePos.x) * (zones[c].x - mousePos.x) + (zones[c].y - mousePos.y) * (zones[c].y - mousePos.y)) < 84 && !inside && !wheelIsSpinnig) {
      inside = true;
      var z = -3 + c;

      if (z > 0) {
        lastSteps = z;
        animate('backward', z);
      } else if (z === 0) {
        var url = wheelApp.currentBrand.url;
        var target = wheelApp.currentBrand.newPage === 'True' ? '_blank' : '_self';
        window.open(url, target);
      } else {
        lastSteps = Math.abs(z);
        animate('forward', Math.abs(z))
      }

      c = 7;

      setTimeout(function () {
        inside = false;
      }, Math.abs(z) * 600)
    }
  }
}, false);

canvas.addEventListener('mousemove', function (evt) {
  var mousePos = getMousePos(canvas, evt);
  for (var c = 0; c < 7; c++) {
    if (Math.sqrt((zones[c].x - mousePos.x) * (zones[c].x - mousePos.x) + (zones[c].y - mousePos.y) * (zones[c].y - mousePos.y)) < 84) {
      canvas.style.cursor = "pointer";
      return
    } else {
      canvas.style.cursor = "initial";
    }
  }
}, false);