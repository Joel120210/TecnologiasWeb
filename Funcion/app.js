(function () {
  const $ = id => document.getElementById(id);
  const canvas = $('canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * devicePixelRatio);
    canvas.height = Math.round(rect.height * devicePixelRatio);
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawAxes(xmin, xmax, ymin, ymax) {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;

    function niceTicks(a, b, n) {
      const span = b - a; if (span === 0) return [a];
      const raw = span / n;
      const pow = Math.pow(10, Math.floor(Math.log10(raw)));
      const mul = [1, 2, 5, 10].find(m => raw / pow <= m) || 10;
      const step = pow * mul;
      const start = Math.ceil(a / step) * step;
      const ticks = [];
      for (let v = start; v <= b + 1e-9; v += step) ticks.push(+v.toFixed(12));
      return ticks;
    }

    const xticks = niceTicks(xmin, xmax, 10);
    const yticks = niceTicks(ymin, ymax, 8);

    ctx.beginPath();
    xticks.forEach(x => {
      const sx = (x - xmin) / (xmax - xmin) * w;
      ctx.moveTo(sx, 0); ctx.lineTo(sx, h);
    });
    yticks.forEach(y => {
      const sy = h - (y - ymin) / (ymax - ymin) * h;
      ctx.moveTo(0, sy); ctx.lineTo(w, sy);
    });
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1.5;
    if (ymin < 0 && ymax > 0) {
      const sy = h - (0 - ymin) / (ymax - ymin) * h;
      ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(w, sy); ctx.stroke();
    }
    if (xmin < 0 && xmax > 0) {
      const sx = (0 - xmin) / (xmax - xmin) * w;
      ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, h); ctx.stroke();
    }

    ctx.fillStyle = 'rgba(230,238,246,0.9)'; ctx.font = '12px system-ui';
    xticks.forEach(x => {
      const sx = (x - xmin) / (xmax - xmin) * w;
      ctx.fillText(String(x), sx + 4, h - 6);
    });
    yticks.forEach(y => {
      const sy = h - (y - ymin) / (ymax - ymin) * h;
      ctx.fillText(String(y), 6, sy - 6);
    });
  }

  function plotFunction(fn, xmin, xmax, samples) {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    let xs = [], ys = [];
    for (let i = 0; i < samples; i++) {
      const t = i / (samples - 1);
      const x = xmin + t * (xmax - xmin);
      let y;
      try { y = fn(x); if (!isFinite(y)) y = NaN; } catch (e) { y = NaN }
      xs.push(x); ys.push(y);
    }
    const yvals = ys.filter(v => Number.isFinite(v));
    if (yvals.length === 0) return;
    let ymin = Math.min(...yvals), ymax = Math.max(...yvals);
    if (ymin === ymax) { ymin -= 1; ymax += 1 }
    const pad = (ymax - ymin) * 0.12;
    ymin -= pad; ymax += pad;

    clear();
    drawAxes(xmin, xmax, ymin, ymax);

    ctx.beginPath(); ctx.lineWidth = 2; ctx.strokeStyle = '#6dd3ff';
    let started = false;
    for (let i = 0; i < xs.length; i++) {
      const x = xs[i], y = ys[i];
      if (!Number.isFinite(y)) { started = false; continue }
      const sx = (x - xmin) / (xmax - xmin) * w;
      const sy = h - (y - ymin) / (ymax - ymin) * h;
      if (!started) { ctx.moveTo(sx, sy); started = true } else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  }

  function safeMakeFunction(expr) {
    const banned = ['window', 'document', 'eval', 'Function', 'fetch', 'XMLHttpRequest', 'require', 'import', 'process', 'while(true)', '=>', 'constructor'];
    const lower = expr.toLowerCase();
    for (const b of banned) if (lower.includes(b)) throw new Error('Expresión no segura');

    expr = expr.replace(/\^/g, '**');

    if (!/^[0-9xX+\-*/%().,\s\^eE\*\*a-zA-Z_]*$/.test(expr)) 
      throw new Error('Caracteres inválidos en la expresión');

    let fn;
    try {
      fn = new Function('x', 'with(Math){ return ' + expr + ' }');
      fn(1);
    } catch (e) { throw new Error('No se pudo compilar la expresión'); }
    return fn;
  }

  $('plot').addEventListener('click', () => {
    const expr = $('expr').value.trim();
    const xmin = parseFloat($('xmin').value);
    const xmax = parseFloat($('xmax').value);
    const samples = parseInt($('samples').value, 10) || 400;
    if (isNaN(xmin) || isNaN(xmax) || xmin >= xmax) { alert('Rango inválido'); return }
    try {
      const fn = safeMakeFunction(expr);
      plotFunction(fn, xmin, xmax, samples);
    } catch (e) { alert('Error: ' + e.message) }
  });

  $('clear').addEventListener('click', () => { clear(); });

  $('plot').click();
})();
