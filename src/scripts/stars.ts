import { emblemPoints, randomSequence, projectPoint, stepSpring } from '../lib/constellation.mjs';

// Stellar temperatures mix white, blue-white, yellow, amber and orange-red independently of shape.
const darkColors = ['224,237,255', '116,177,248', '245,244,232', '255,209,133', '250,160,87', '185,213,250', '238,134,99'];
const lightColors = ['61,92,130', '43,107,177', '95,106,122', '157,112,47', '179,97,42', '84,113,154', '159,80,54'];

// One point-only renderer owns each field and stops work whenever its surface is not visible.
document.querySelectorAll<HTMLCanvasElement>('canvas[data-stars]').forEach((canvas) => {
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;
  const home = canvas.dataset.stars === 'home';
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const random = randomSequence(home ? 919 : 447);
  const background = Array.from({ length: home ? 850 : 1350 }, () => ({ x: random(), y: random(), depth: random(), size: .25 + random() ** 5 * 2, color: Math.floor(random() * 7), phase: random() * Math.PI * 2, spring: { x: 0, y: 0, vx: 0, vy: 0 } }));
  const emblem = home ? emblemPoints().map(star => ({ ...star, spring: { x: 0, y: 0, vx: 0, vy: 0 } })) : [];
  const halo = home ? Array.from({ length: 360 }, () => ({ radius: .23 + random() ** .65 * .34, angle: random() * Math.PI * 2, z: (random() - .5) * .35, speed: .014 + random() * .035, size: .25 + random() ** 5 * 1.5, color: Math.floor(random() * 7), phase: random() * 6.28 })) : [];
  const pointer = { x: -1000, y: -1000, active: false, speed: 0 };
  const camera = { x: 0, y: 0, vx: 0, vy: 0 };
  const drag = { active: false, x: 0, y: 0, vx: 0, vy: 0, lastX: 0, lastY: 0, lastTime: 0 };
  let width = 1, height = 1, contentBottom = 0, frame = 0, last = 0, clock = 0, paused = false, visible = true, light = false;
  let sprites: HTMLCanvasElement[] = [];
  const hit = canvas.parentElement?.querySelector<HTMLButtonElement>('[data-star-focus]');
  const motion = canvas.parentElement?.querySelector<HTMLButtonElement>('[data-motion-toggle]');

  // Cache circular stellar glow textures; every frame draws points with no connecting geometry.
  function makeSprites() {
    light = document.documentElement.dataset.theme === 'light';
    sprites = (light ? lightColors : darkColors).map(color => {
      const sprite = document.createElement('canvas'); sprite.width = sprite.height = 48;
      const brush = sprite.getContext('2d')!;
      const glow = brush.createRadialGradient(24, 24, 0, 24, 24, 24);
      glow.addColorStop(0, `rgba(${color},1)`);
      glow.addColorStop(.14, `rgba(${color},1)`);
      glow.addColorStop(.28, `rgba(${color},.5)`);
      glow.addColorStop(.52, `rgba(${color},.12)`);
      glow.addColorStop(1, `rgba(${color},0)`);
      brush.fillStyle = glow; brush.fillRect(0, 0, 48, 48);
      return sprite;
    });
  }

  // Keep mobile and desktop compositions anchored to their own clear reading areas.
  function layout() {
    const mobile = width < 900;
    const top = contentBottom + 32, bottom = height - 40;
    const scale = mobile ? Math.min(width * .94, 490, Math.max(80, bottom - top) / .92) : Math.min(width * .45, 640);
    return { scale, cx: mobile ? width / 2 : width * .745, cy: mobile ? (top + bottom) / 2 : height * .49 };
  }

  // Draw a perspective-scaled point sprite; subtle bright cores retain each star's temperature.
  function point(x: number, y: number, radius: number, color: number, alpha: number) {
    if (!context) return;
    const size = radius * 7;
    context.globalAlpha = Math.min(1, Math.max(0, alpha));
    context.drawImage(sprites[color], x - size / 2, y - size / 2, size, size);
  }

  // A local tangential force produces a small vortex with spring recovery and cursor-speed response.
  function disturb(star: { spring: { x: number; y: number; vx: number; vy: number } }, x: number, y: number, dt: number, strength: number) {
    const dx = x - pointer.x, dy = y - pointer.y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const influence = pointer.active ? Math.max(0, 1 - distance / (home ? 185 : 155)) ** 2 : 0;
    const force = influence * strength * (1 + Math.min(pointer.speed / 45, 1.6));
    stepSpring(star.spring, (dx * .42 - dy * .91) / distance * force, (dy * .42 + dx * .91) / distance * force, dt);
    return star.spring;
  }

  // Project a slowly living volume; drag velocity and near/far stars produce real spatial motion.
  function draw(dt = 0) {
    if (!context) return;
    const still = media.matches || paused;
    const { scale, cx, cy } = layout();
    context.clearRect(0, 0, width, height);
    const targetYaw = pointer.active ? Math.max(-.42, Math.min(.42, (pointer.x - cx) / scale * .8)) : 0;
    const targetPitch = pointer.active ? Math.max(-.28, Math.min(.28, (pointer.y - cy) / scale * .6)) : 0;
    if (!still) {
      stepSpring(camera, targetYaw, targetPitch, dt, 16, 5);
      if (!drag.active) stepSpring(drag, 0, 0, dt, 1.8, 1.8);
      pointer.speed *= Math.exp(-dt * 7);
    }
    const yaw = still ? 0 : camera.x + drag.x + Math.sin(clock * .25) * .15;
    const pitch = still ? 0 : camera.y + drag.y + Math.sin(clock * .18) * .065;
    for (const star of background) {
      const drift = still ? 0 : Math.sin(clock * .07 + star.phase) * (3 + star.depth * 7);
      const x = star.x * width + yaw * star.depth * (home ? 90 : 48) + drift;
      const y = star.y * height + pitch * star.depth * (home ? 70 : 35);
      const offset = still ? { x: 0, y: 0 } : disturb(star, x, y, dt, home ? 32 : 24);
      const twinkle = .75 + .25 * Math.sin(clock * .7 + star.phase);
      point(x + offset.x, y + offset.y, star.size, star.color, (.16 + star.depth * .65) * twinkle * (light ? .75 : 1));
    }
    // Keep even the initial scattered volume below the mobile copy and action buttons.
    context.save();
    if (home && width < 900) {
      context.beginPath(); context.rect(0, contentBottom + 12, width, Math.max(0, height - contentBottom - 12)); context.clip();
    }
    for (const star of halo) {
      const angle = star.angle + (still ? 0 : clock * star.speed);
      const projected = projectPoint(Math.cos(angle) * star.radius, Math.sin(angle) * star.radius * .8, star.z, yaw, pitch);
      point(cx + projected.x * scale, cy + projected.y * scale, star.size * projected.scale, star.color, .18 + .28 * (1 + Math.sin(star.phase + clock * .4)) / 2);
    }
    const forming = still ? 0 : Math.max(0, 1 - clock / 2.4) ** 3;
    for (const star of emblem) {
      const orbit = still ? 0 : clock * (.3 + star.depth * .25) + star.phase;
      const breath = still ? 0 : .003 + star.depth * .004;
      const scatter = forming * (.1 + star.depth * .42);
      const x = star.x - .5 + Math.cos(orbit) * breath + Math.cos(star.phase + clock * .6) * scatter;
      const y = star.y - .5 + Math.sin(orbit) * breath + Math.sin(star.phase + clock * .6) * scatter;
      const projected = projectPoint(x, y, star.z + Math.sin(orbit) * breath * 2, yaw, pitch);
      const screenX = cx + projected.x * scale, screenY = cy + projected.y * scale;
      const offset = still ? { x: 0, y: 0 } : disturb(star, screenX, screenY, dt, 48 + star.depth * 20);
      const twinkle = .85 + .15 * Math.sin(clock * .9 + star.phase);
      const radius = star.size * projected.scale * Math.min(1.12, scale / 480);
      point(screenX + offset.x, screenY + offset.y, radius, star.color, (.4 + star.depth * .6) * twinkle);
    }
    context.restore();
    context.globalAlpha = 1;
    canvas.dataset.rendered = 'true';
  }

  // Use display cadence with bounded elapsed time; no frame remains scheduled while paused or hidden.
  function animate(time: number) {
    frame = 0;
    if (media.matches || paused || document.hidden || !visible) return;
    const dt = last ? Math.min((time - last) / 1000, .035) : 1 / 60;
    last = time; clock += dt; draw(dt);
    frame = requestAnimationFrame(animate);
  }

  // Reset all transient force when motion is disabled so static output is exactly stable.
  function refresh() {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    if (media.matches || paused) {
      pointer.active = false; camera.x = camera.y = camera.vx = camera.vy = 0;
      drag.x = drag.y = drag.vx = drag.vy = 0; drag.active = false;
      for (const star of [...background, ...emblem]) star.spring.x = star.spring.y = star.spring.vx = star.spring.vy = 0;
    }
    draw();
    if (!media.matches && !paused && !document.hidden && visible) frame = requestAnimationFrame(animate);
    if (motion) { motion.textContent = media.matches || paused ? motion.dataset.resume! : motion.dataset.pause!; motion.disabled = media.matches; motion.setAttribute('aria-pressed', String(paused || media.matches)); }
  }

  // Cap raster resolution while retaining depth and soft glows at every responsive size.
  function resize() {
    const bounds = canvas.getBoundingClientRect(); width = bounds.width; height = bounds.height;
    const copy = canvas.parentElement?.querySelector('.hero-copy')?.getBoundingClientRect();
    contentBottom = copy ? copy.bottom - bounds.top : 0;
    if (hit) hit.style.top = width < 900 && copy ? `${contentBottom + 12}px` : '0px';
    const ratio = Math.min(devicePixelRatio, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context?.setTransform(ratio, 0, 0, ratio, 0, 0); refresh();
  }

  window.addEventListener('pointermove', (event) => {
    if (media.matches || paused || event.pointerType === 'touch') return;
    const bounds = canvas.getBoundingClientRect();
    const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
    if (pointer.active) pointer.speed = Math.min(120, Math.hypot(x - pointer.x, y - pointer.y));
    pointer.x = x; pointer.y = y;
    pointer.active = x >= 0 && x <= width && y >= 0 && y <= height;
    if (drag.active) {
      const elapsed = Math.max(8, event.timeStamp - drag.lastTime) / 1000;
      const dx = (event.clientX - drag.lastX) * .0045, dy = (event.clientY - drag.lastY) * .0035;
      drag.x = Math.max(-1.35, Math.min(1.35, drag.x + dx)); drag.y = Math.max(-.8, Math.min(.8, drag.y + dy));
      drag.vx = Math.max(-1.4, Math.min(1.4, dx / elapsed)); drag.vy = Math.max(-1, Math.min(1, dy / elapsed));
      drag.lastX = event.clientX; drag.lastY = event.clientY; drag.lastTime = event.timeStamp;
    }
  }, { passive: true });
  hit?.addEventListener('pointerdown', (event) => {
    if (media.matches || paused || event.pointerType === 'touch' || event.button !== 0) return;
    drag.active = true; drag.lastX = event.clientX; drag.lastY = event.clientY; drag.lastTime = event.timeStamp;
    hit.setPointerCapture(event.pointerId); hit.classList.add('dragging');
  });
  // Release capture on cancellation as well as pointer-up so focus and browser gestures remain usable.
  function release() { drag.active = false; hit?.classList.remove('dragging'); }
  hit?.addEventListener('pointerup', release);
  hit?.addEventListener('pointercancel', release);
  hit?.addEventListener('lostpointercapture', release);
  document.documentElement.addEventListener('pointerleave', () => { pointer.active = false; release(); });
  hit?.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key) || media.matches || paused) return;
    event.preventDefault(); pointer.active = false;
    if (event.key === 'Home') { camera.x = camera.y = camera.vx = camera.vy = 0; drag.x = drag.y = drag.vx = drag.vy = 0; }
    else { drag.x = Math.max(-1.35, Math.min(1.35, drag.x + (event.key === 'ArrowRight' ? .22 : event.key === 'ArrowLeft' ? -.22 : 0))); drag.y = Math.max(-.8, Math.min(.8, drag.y + (event.key === 'ArrowDown' ? .16 : event.key === 'ArrowUp' ? -.16 : 0))); }
  });
  motion?.addEventListener('click', () => { paused = !paused; refresh(); });
  window.addEventListener('themechange', () => { makeSprites(); refresh(); });
  document.addEventListener('visibilitychange', refresh);
  media.addEventListener('change', refresh);
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; refresh(); }).observe(canvas);
  makeSprites(); resize();
});
