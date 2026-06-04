/**
 * ParticleBuilding.js
 *
 * Reconstructs an image from animated particles that scatter and converge.
 *
 * Usage:
 *   import { initParticleBuilding } from './ParticleBuilding.js';
 *
 *   const effect = initParticleBuilding('my-container', '/logo.png', {
 *     particleSize: 2,
 *     noiseIntensity: 2,
 *     sampleStep: 5,
 *   });
 *
 *   // Later, to clean up:
 *   effect.destroy();
 *
 *   // To re-trigger the scatter → build animation:
 *   effect.rebuild();
 */

/**
 * @param {string}  containerId          - ID of the DOM element to attach the canvas to
 * @param {string}  imageUrl             - URL of the source image (must be CORS-accessible)
 * @param {Object}  [options]
 * @param {number}  [options.particleSize=1]      - Pixel size of each particle square
 * @param {number}  [options.noiseIntensity=4]  - Amplitude of noise displacement (px) once settled
 * @param {number}  [options.sampleStep=6]        - Sample every Nth pixel (higher = fewer particles)
 * @param {number}  [options.speed=0.06]          - Spring stiffness towards target (0.01–0.15)
 * @param {number}  [options.damping=0.82]        - Velocity damping per frame (0.7–0.95)
 * @param {string}  [options.scatterMode='radial'] - 'radial' | 'top' | 'bottom' | 'left' | 'right'
 * @param {number}  [options.alphaThreshold=20]   - Skip pixels below this alpha (0–255)
 * @param {number}  [options.dpr]                 - Device pixel ratio override (defaults to window.devicePixelRatio)
 * @returns {{ destroy: () => void, rebuild: () => void }}
 */
export function initParticleBuilding(containerId, imageUrl, options = {}) {
  // Structural options — fixed at init time
  const {
    particleSize   = 2,
    sampleStep     = 4,
    scatterMode    = 'radial',
    alphaThreshold = 20,
    dpr            = window.devicePixelRatio || 1,
    // Shape of each particle:
    //  'square'  — axis-aligned square (fastest, pixel/digital look)
    //  'circle'  — soft circular dot
    //  'diamond' — 45° rotated square, sharp & angular
    //  'spark'   — thin elongated bar with per-particle random rotation (electrical feel)
    shape = 'square',
  } = options;

  // Mutable options — can be updated at runtime via setOptions()
  let noiseIntensity = options.noiseIntensity ?? 1.5;
  let speed = options.speed ?? 0.06;
  let damping = options.damping ?? 0.82;
  let mouseRepulsion = options.mouseRepulsion ?? true;
  let repulsionRadius = options.repulsionRadius ?? 80;   // px
  let repulsionStrength = options.repulsionStrength ?? 5;    // impulse magnitude
  // tintColor: override all particle colors with a single hex/rgb string.
  // Useful when the source image is dark — e.g. tintColor: '#F59E0B'
  let tintColor = options.tintColor ?? null;
  // minBrightness: skip pixels darker than this luminance (0–255). Use 20–40 to strip dark JPEG backgrounds.
  let minBrightness = options.minBrightness ?? 0;
  // maxBrightness: skip pixels brighter than this luminance (0–255). Use 220–240 to strip white backgrounds.
  let maxBrightness = options.maxBrightness ?? 255;

  /* ── Container ─────────────────────────────────────────────────── */
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`[ParticleBuilding] No element found with id "${containerId}"`);

  const prevPosition = container.style.position;
  if (window.getComputedStyle(container).position === 'static') {
    container.style.position = 'relative';
  }

  /* ── Canvas setup ───────────────────────────────────────────────── */
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'absolute',
    top: '0', left: '0',
    width: '100%', height: '100%',
    pointerEvents: 'none',
  });
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let cssW = 0, cssH = 0;

  function resizeCanvas() {
    cssW = container.offsetWidth;
    cssH = container.offsetHeight;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.scale(dpr, dpr);
  }

  /* ── Mouse tracking ────────────────────────────────────────────── */
  // Park off-screen so particles are never repelled before the first move.
  let mouseX = -9999, mouseY = -9999;

  function onMouseMove(e) {
    const rect = container.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }
  function onMouseLeave() {
    mouseX = -9999;
    mouseY = -9999;
  }

  container.addEventListener('mousemove', onMouseMove);
  container.addEventListener('mouseleave', onMouseLeave);

  /* ── Noise ──────────────────────────────────────────────────────── */
  // Two-speed layered sine-wave noise: slow drift + faster micro-turbulence.
  function noise2d(x, y, t) {
    const slow = (
      Math.sin(x * 0.008 + t * 0.41) * Math.cos(y * 0.010 + t * 0.27) +
      Math.sin(x * 0.019 - t * 0.63) * Math.sin(y * 0.015 - t * 0.55) * 0.5 +
      Math.cos(x * 0.031 + t * 0.17) * Math.cos(y * 0.028 + t * 0.83) * 0.25
    ) / 1.75;
    const fast = (
      Math.sin(x * 0.055 + t * 1.3) * Math.cos(y * 0.048 + t * 0.97) * 0.35 +
      Math.cos(x * 0.072 - t * 1.8) * Math.sin(y * 0.061 - t * 1.5) * 0.2
    ) / 0.55;
    return slow * 0.7 + fast * 0.3;
  }

  /* ── Scatter helpers ────────────────────────────────────────────── */
  function scatterPosition(tx, ty) {
    switch (scatterMode) {
      case 'top':
        return { x: tx + (Math.random() - 0.5) * cssW, y: -Math.random() * cssH * 0.5 };
      case 'bottom':
        return { x: tx + (Math.random() - 0.5) * cssW, y: cssH + Math.random() * cssH * 0.5 };
      case 'left':
        return { x: -Math.random() * cssW * 0.5, y: ty + (Math.random() - 0.5) * cssH };
      case 'right':
        return { x: cssW + Math.random() * cssW * 0.5, y: ty + (Math.random() - 0.5) * cssH };
      case 'radial':
      default: {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.hypot(cssW, cssH) * (0.5 + Math.random() * 0.6);
        return {
          x: cssW / 2 + Math.cos(angle) * dist,
          y: cssH / 2 + Math.sin(angle) * dist,
        };
      }
    }
  }

  /* ── Particle data (parallel typed arrays for performance) ──────── */
  // Storing as flat typed arrays avoids GC pressure with thousands of objects.
  let count = 0;
  let posX, posY;     // Float32Array — current position
  let tgtX, tgtY;     // Float32Array — target position
  let velX, velY;     // Float32Array — velocity
  let noiseOff;       // Float32Array — per-particle noise phase offset
  let colR, colG, colB, colA; // Uint8Array  — RGBA from source image
  // 0 = default  1 = orange (small + dim)  2 = yellow (normal)
  let particleType;   // Uint8Array

  /* ── Image sampling ─────────────────────────────────────────────── */
  function buildParticlesFromImage(img) {
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Draw image to offscreen canvas to read pixel data
    const off = document.createElement('canvas');
    off.width = iw;
    off.height = ih;
    const offCtx = off.getContext('2d');
    offCtx.drawImage(img, 0, 0);
    const { data } = offCtx.getImageData(0, 0, iw, ih);

    // Scale & centre image inside canvas (object-fit: contain behaviour)
    const scale = Math.min(cssW / iw, cssH / ih);
    const offsetX = (cssW - iw * scale) / 2;
    const offsetY = (cssH - ih * scale) / 2;

    // First pass: sample valid pixels and classify by hue
    const raw   = [];
    const types = [];
    for (let py = 0; py < ih; py += sampleStep) {
      for (let px = 0; px < iw; px += sampleStep) {
        const i = (py * iw + px) * 4;
        if (data[i + 3] < alphaThreshold) continue;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        // Perceived luminance (ITU-R BT.709)
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        if (lum < minBrightness || lum > maxBrightness) continue;

        // Hue classification — orange (type 1) or yellow (type 2)
        const maxC = Math.max(r, g, b), minC = Math.min(r, g, b), d = maxC - minC;
        const sat = maxC > 0 ? d / maxC : 0;
        let type = 0;
        if (sat > 0.3 && maxC > 60 && d > 0) {
          const hue = maxC === r ? ((g - b) / d * 60 + 360) % 360
                    : maxC === g ? (b - r) / d * 60 + 120
                                 : (r - g) / d * 60 + 240;
          if (hue >= 15 && hue < 42) type = 1;       // orange
          else if (hue >= 42 && hue < 72) type = 2;  // yellow
        }

        raw.push(px, py, r, g, b, data[i + 3]);
        types.push(type);
      }
    }

    count = raw.length / 6;

    posX        = new Float32Array(count);
    posY        = new Float32Array(count);
    tgtX        = new Float32Array(count);
    tgtY        = new Float32Array(count);
    velX        = new Float32Array(count);
    velY        = new Float32Array(count);
    noiseOff    = new Float32Array(count);
    colR        = new Uint8Array(count);
    colG        = new Uint8Array(count);
    colB        = new Uint8Array(count);
    colA        = new Uint8Array(count);
    particleType = new Uint8Array(count);

    for (let k = 0; k < count; k++) {
      const base = k * 6;
      const tx = offsetX + raw[base] * scale;
      const ty = offsetY + raw[base + 1] * scale;
      const { x, y } = scatterPosition(tx, ty);

      posX[k]         = x;
      posY[k]         = y;
      tgtX[k]         = tx;
      tgtY[k]         = ty;
      velX[k]         = 0;
      velY[k]         = 0;
      noiseOff[k]     = Math.random() * 628.3;
      colR[k]         = raw[base + 2];
      colG[k]         = raw[base + 3];
      colB[k]         = raw[base + 4];
      colA[k]         = raw[base + 5];
      particleType[k] = types[k];
    }
  }

  /* ── Animation loop ─────────────────────────────────────────────── */
  let rafId = null;
  let startTime = null;

  function tick(timestamp) {
    if (!startTime) startTime = timestamp;
    const t = (timestamp - startTime) * 0.001; // seconds

    ctx.clearRect(0, 0, cssW, cssH);

    for (let k = 0; k < count; k++) {
      // Noise-displaced target
      const no = noiseOff[k];
      const nx = noise2d(tgtX[k] + no, tgtY[k], t) * noiseIntensity;
      const ny = noise2d(tgtX[k], tgtY[k] + no, t + 1.7) * noiseIntensity;

      const goalX = tgtX[k] + nx;
      const goalY = tgtY[k] + ny;

      // Spring force toward (noise-displaced) target
      velX[k] += (goalX - posX[k]) * speed;
      velY[k] += (goalY - posY[k]) * speed;

      // Mouse repulsion
      if (mouseRepulsion) {
        const mdx = posX[k] - mouseX;
        const mdy = posY[k] - mouseY;
        const dist2 = mdx * mdx + mdy * mdy;
        if (dist2 < repulsionRadius * repulsionRadius && dist2 > 0) {
          const dist = Math.sqrt(dist2);
          // Force falls off linearly to zero at the edge of the radius
          const force = (1 - dist / repulsionRadius) * repulsionStrength;
          velX[k] += (mdx / dist) * force;
          velY[k] += (mdy / dist) * force;
        }
      }

      // Damping
      velX[k] *= damping;
      velY[k] *= damping;

      posX[k] += velX[k];
      posY[k] += velY[k];

      // Draw — orange: half size + 40% opacity; yellow/default: full size + full opacity
      const type = particleType[k];
      const sz   = type === 1 ? particleSize * 0.5 : particleSize;
      const x    = posX[k], y = posY[k];
      ctx.globalAlpha = (colA[k] / 255) * (type === 1 ? 0.4 : 1.0);
      ctx.fillStyle   = tintColor ?? `rgb(${colR[k]},${colG[k]},${colB[k]})`;

      switch (shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(x + sz * 0.5, y + sz * 0.5, sz * 0.5, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'diamond':
          ctx.beginPath();
          ctx.moveTo(x + sz * 0.5, y);
          ctx.lineTo(x + sz,       y + sz * 0.5);
          ctx.lineTo(x + sz * 0.5, y + sz);
          ctx.lineTo(x,            y + sz * 0.5);
          ctx.closePath();
          ctx.fill();
          break;
        case 'spark':
          ctx.save();
          ctx.translate(x + sz * 0.5, y + sz * 0.5);
          ctx.rotate(noiseOff[k]);         // unique frozen angle per particle
          ctx.fillRect(-sz * 2, -sz * 0.2, sz * 4, sz * 0.4);
          ctx.restore();
          break;
        case 'square':
        default:
          ctx.fillRect(x, y, sz, sz);
      }
    }

    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(tick);
  }

  /* ── Resize handling ────────────────────────────────────────────── */
  const ro = new ResizeObserver(() => {
    resizeCanvas();
    // Re-derive target positions on resize so image stays centred
    if (loadedImg) buildParticlesFromImage(loadedImg);
  });
  ro.observe(container);

  /* ── Load image & start ─────────────────────────────────────────── */
  let loadedImg = null;
  resizeCanvas();

  const img = new Image();
  img.crossOrigin = 'anonymous';

  img.onload = () => {
    loadedImg = img;
    buildParticlesFromImage(img);
    rafId = requestAnimationFrame(tick);
  };

  img.onerror = () => {
    console.error(`[ParticleBuilding] Failed to load image: "${imageUrl}"`);
  };

  img.src = imageUrl;

  /* ── Public API ─────────────────────────────────────────────────── */
  return {
    /**
     * Stop the animation and remove the canvas from the DOM.
     * Call this when navigating away or unmounting the component.
     */
    destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      canvas.remove();
      if (prevPosition !== undefined) container.style.position = prevPosition;
    },

    /**
     * Re-scatter particles and replay the build animation.
     * Useful for triggering the effect again on user interaction.
     */
    rebuild() {
      if (!loadedImg) return;
      if (rafId) cancelAnimationFrame(rafId);
      startTime = null;
      buildParticlesFromImage(loadedImg);
      rafId = requestAnimationFrame(tick);
    },

    /**
     * Update options at runtime without reloading the image.
     * Pass any subset of the original options object.
     * @param {Object} newOptions
     */
    setOptions(newOptions) {
      if (newOptions.noiseIntensity !== undefined) noiseIntensity = newOptions.noiseIntensity;
      if (newOptions.speed !== undefined) speed = newOptions.speed;
      if (newOptions.damping !== undefined) damping = newOptions.damping;
      if (newOptions.mouseRepulsion !== undefined) mouseRepulsion = newOptions.mouseRepulsion;
      if (newOptions.repulsionRadius !== undefined) repulsionRadius = newOptions.repulsionRadius;
      if (newOptions.repulsionStrength !== undefined) repulsionStrength = newOptions.repulsionStrength;
      if (newOptions.tintColor !== undefined) tintColor = newOptions.tintColor;
    },
  };
}
