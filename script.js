const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');


roundedRect(ctx, 5, 5, 150, 150, 15);
function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.stroke();
}
//postavi vrijeme ovdje!!!!
const phase_time=4;

const dpr = Math.ceil(window.devicePixelRatio);
canvas.width = 200 * dpr;
canvas.height = 200 * dpr;
ctx.scale(dpr, dpr);


ctx.font = '12px Roboto, sans-serif';
ctx.lineWidth =8;

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.querySelector('meta[name="theme-color"]').content = 'black';
  document.querySelector('link[rel="manifest"]').href = 'manifest-dark.json';
  ctx.strokeStyle = 'rgba(35, 65, 77, 0.2)';
} else {
  ctx.strokeStyle = '#dbf5ff';
}
const stages = ['Udahni', 'Zadrži dah', 'Izdahni', 'Pauza'];
const textWidths = stages.map((text) => ctx.measureText(text).width);

function text(section, opacity) {
  ctx.fillStyle = `rgba(35, 65, 77,  ${opacity})`;
  ctx.fillText(stages[section], 100 - textWidths[section] / 2, 105);
}

//Linija koja se kreće
function line(section, location, length) {
  ctx.fillStyle =  'rgba(35, 65, 77, 0.5)';
  ctx.beginPath();

  switch (section) {
    case 0:
      ctx.roundRect(location, 0, length, 10,50);
      break;
    case 1:
      ctx.roundRect(190, location, 10, length,50);
      break;
    case 2:
      ctx.roundRect(200 - location, 190, -length, 10,50);
      break;
    case 3:
      ctx.roundRect(0, 200 - location, 10, -length,50);
      break;
  }

  ctx.fill();
}

function tick(start) {
  const t = Date.now() - start;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  roundedRect(ctx, 5, 5, 190, 190, 15);
  function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.arcTo(x, y + height, x + radius, y + height, radius);
    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    ctx.arcTo(x + width, y, x + width - radius, y, radius);
    ctx.arcTo(x, y, x, y + radius, radius);
    ctx.stroke();
  }

  const section = Math.floor((t / (1000*phase_time)) % 4);
  const nextSection = (section + 1) % 4;
  const completion = (t % (1000*phase_time)) / (1000*phase_time);

  line(section, completion * 190, 50);

  if (completion > 0.8) {
    line(nextSection, 10, completion * 200 - 160);
  }

  if (completion > 0.85) {
    const opacity = (completion - 0.85) / 0.15;
    text(nextSection, opacity);
    text(section, 1 - opacity);
  } else {
    text(section, 1);
  }

  if (canvas.ariaLabel !== stages[section]) {
    canvas.ariaLabel = stages[section];
  }

  window.requestAnimationFrame(() => tick(start));
}

tick(Date.now());

navigator.serviceWorker.register('sw.js', { scope: './' });
