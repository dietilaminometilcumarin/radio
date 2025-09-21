/* --- Полная логика плеера (не менял id/названия переменных) --- */
(function () {
  // DOM
  const btnTone = document.getElementById('btnTone');
  const btnStream = document.getElementById('btnStream');
  const playStop = document.getElementById('playStop');
  const copyLink = document.getElementById('copyLink');
  const volume = document.getElementById('volume');
  const streamList = document.getElementById('streamList');
  const canvas = document.getElementById('vizCanvas');
  const ctx = canvas.getContext('2d');

  // Audio state (names preserved)
  let audioCtx = null;
  let sourceNode = null;
  let analyser = null;
  let gainNode = null;
  let mediaEl = null;
  let osc = null;
  let animationId = null;

  // Mode: 'stream' by default
  let mode = 'stream';
  btnStream.classList.add('active');
  btnTone.classList.remove('active');
  streamList.disabled = false;

  // helpers: canvas size (handle DPR)
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // !!! при отрисовке используем clientWidth/clientHeight
    // а не canvas.width/canvas.height, чтобы оставаться в границах
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Update volume slider visual fill (left blue -> right red filled to pct)
  function updateVolumeColor() {
    const pct = parseFloat(volume.value);
    // gradient: from blue (left) to red (right), filled to pct
    const fill = pct * 100;
    volume.style.background = `linear-gradient(to right, blue 0%, red ${fill}%, #2b3133 ${fill}%)`;
  }

  // Start playback (uses current mode & streamList)
  function start() {
    stop(); // ensure clean
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = parseFloat(volume.value);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 4096;
    analyser.smoothingTimeConstant = 0.85;

    // routing: source -> gain -> analyser -> destination
    gainNode.connect(analyser);
    analyser.connect(audioCtx.destination);

    if (mode === 'tone') {
      osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 440;
      osc.connect(gainNode);
      osc.start();
    } else {
      mediaEl = new Audio();
      mediaEl.crossOrigin = 'anonymous';
      mediaEl.src = streamList.value;
      mediaEl.autoplay = true;
      try {
        sourceNode = audioCtx.createMediaElementSource(mediaEl);
        sourceNode.connect(gainNode);
      } catch (e) {
        console.warn('MediaElementSource creation failed:', e);
      }
      mediaEl.play().catch(console.warn);
    }

    // start visualizer
    drawLoop();
    playStop.textContent = '⏸';
  }

  // Stop playback and cleanup
  function stop() {
    if (mediaEl) {
      try { mediaEl.pause(); } catch (e) { }
      try { mediaEl.src = ''; } catch (e) { }
      mediaEl = null;
    }
    if (osc) {
      try { osc.stop(); } catch (e) { }
      try { osc.disconnect(); } catch (e) { }
      osc = null;
    }
    if (sourceNode) {
      try { sourceNode.disconnect(); } catch (e) { }
      sourceNode = null;
    }
    if (gainNode) {
      try { gainNode.disconnect(); } catch (e) { }
      gainNode = null;
    }
    if (analyser) {
      try { analyser.disconnect(); } catch (e) { }
      analyser = null;
    }
    if (audioCtx) {
      try { audioCtx.close(); } catch (e) { }
      audioCtx = null;
    }
    if (animationId) cancelAnimationFrame(animationId);
    animationId = null;
    playStop.textContent = '▶';
  }

  // Draw visualizer (logarithmic frequency axis, colored bars)
  function drawLoop() {
    if (!analyser) return;
    resizeCanvas(); // Ensure canvas size up-to-date
    const bufferLength = analyser.frequencyBinCount;
    const freqData = new Uint8Array(bufferLength);
    const sampleRate = audioCtx.sampleRate;
    const nyquist = sampleRate / 2;
    const bars = 240; // columns

    (function loop() {
      animationId = requestAnimationFrame(loop);
      analyser.getByteFrequencyData(freqData);

      // clear
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);


      // draw background inner panel
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fillRect(0, 0, w, h);

      // grid marks
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.font = '12px Inter, Arial';
      ctx.fillStyle = 'rgba(159,179,190,0.9)';
      ctx.textAlign = 'center';
      const marks = [50, 100, 500, 1000, 5000, 10000, 20000];
      for (let m of marks) {
        if (m > nyquist) continue;
        const x = Math.log(m / 20) / Math.log(nyquist / 20) * w;
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
        ctx.stroke();
        const label = m >= 1000 ? (m / 1000) + 'k' : String(m);
        ctx.fillText(label, x, h - 6);
      }

      // bars
      const barWidth = w / bars;
      for (let i = 0; i < bars; i++) {
        const freq = 20 * Math.pow(nyquist / 20, i / bars); // log frequency
        const index = Math.min(bufferLength - 1, Math.floor(freq / nyquist * bufferLength));
        const v = freqData[index];
        const bh = (v / 255) * h;
        const x = i * barWidth;

        // color gradient depends on height: bottom blue -> top red, top color depends on t
        const t = Math.max(0, Math.min(1, bh / h)); // 0..1
        const topR = Math.floor(255 * t);
        const topB = Math.floor(255 * (1 - t));
        const topColor = `rgb(${topR},0,${topB})`;
        const grad = ctx.createLinearGradient(0, h - bh, 0, h);
        grad.addColorStop(1, 'blue');        // bottom
        grad.addColorStop(0, topColor);      // top (depends on height)

        ctx.fillStyle = grad;
        ctx.fillRect(x + 1, h - bh, Math.max(1, barWidth - 2), bh);
      }
    })();
  }

  // Toggle play/stop (single click toggles)
  playStop.addEventListener('click', () => {
    if (audioCtx) stop();
    else start();
  });

  // Copy link button
  copyLink.addEventListener('click', () => {
    const url = streamList.value;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        // small visual feedback
        const old = copyLink.innerHTML;
        copyLink.innerHTML = '✓';
        setTimeout(() => copyLink.innerHTML = old, 900);
      });
    } else {
      alert('Clipboard API not available');
    }
  });

  // Volume control
  volume.addEventListener('input', () => {
    const v = parseFloat(volume.value);
    if (gainNode) gainNode.gain.value = v;
    updateVolumeColor();
  });

  // Update slider color initially
  updateVolumeColor();

  // Stream list change -> if in stream mode & playing -> restart
  streamList.addEventListener('change', () => {
    if (mode === 'stream') {
      if (audioCtx) {
        stop();
        // small delay to let previous context close in some browsers, then start
        setTimeout(() => start(), 120);
      }
    }
  });

  // Mode buttons logic: stop on change, block/unblock stream select
  btnTone.addEventListener('click', () => {
    if (mode === 'tone') return;
    mode = 'tone';
    btnTone.classList.add('active');
    btnStream.classList.remove('active');
    stop();
    streamList.disabled = true;
  });
  btnStream.addEventListener('click', () => {
    if (mode === 'stream') return;
    mode = 'stream';
    btnStream.classList.add('active');
    btnTone.classList.remove('active');
    stop();
    streamList.disabled = false;
  });

  // On load: ensure UI consistent
  window.addEventListener('load', () => {
    // default mode stream (as required)
    mode = 'stream';
    btnStream.classList.add('active');
    btnTone.classList.remove('active');
    streamList.disabled = false;
    updateVolumeColor();
  });

})();
