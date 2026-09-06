// A deterministic generator keeps the emblem stable across resize and theme changes.
export function randomSequence(seed = 7319) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
}

// Curved anchor paths reproduce the paired braces without drawing visible strokes.
function bezier(a, b, c, d, t) {
  const q = 1 - t;
  return [q ** 3 * a[0] + 3 * q * q * t * b[0] + 3 * q * t * t * c[0] + t ** 3 * d[0], q ** 3 * a[1] + 3 * q * q * t * b[1] + 3 * q * t * t * c[1] + t ** 3 * d[1]];
}

// Only point coordinates leave this model; the renderer cannot create connections.
export function emblemPoints() {
  const random = randomSequence();
  const points = [];
  const scatter = (x, y, spread, group) => {
    const angle = random() * Math.PI * 2;
    const distance = Math.sqrt(-2 * Math.log(Math.max(random(), 0.00001))) * spread;
    const depth = random();
    points.push({ x: x + Math.cos(angle) * distance, y: y + Math.sin(angle) * distance, z: (depth - .5) * .17, depth, size: .24 + random() ** 5 * 2.65, color: Math.floor(random() * 7), phase: random() * Math.PI * 2, group });
  };
  const segments = [
    [[.29, .13], [.15, .12], [.18, .19], [.17, .33]],
    [[.17, .33], [.17, .46], [.16, .47], [.10, .50]],
    [[.10, .50], [.16, .53], [.17, .54], [.17, .67]],
    [[.17, .67], [.18, .81], [.15, .88], [.29, .87]],
  ];
  for (const mirror of [false, true]) {
    for (const segment of segments) {
      for (let i = 0; i < 340; i++) {
        const [x, y] = bezier(...segment, random());
        scatter(mirror ? 1 - x : x, y, .009 + (random() < .18 ? .012 : .004) * random(), mirror ? 'right-brace' : 'left-brace');
      }
    }
  }
  for (let layer = 0; layer < 3; layer++) {
    const y = .4 + layer * .095;
    const vertices = [[.5, y - .09], [.665, y], [.5, y + .09], [.335, y]];
    for (let edge = 0; edge < 4; edge++) {
      const a = vertices[edge], b = vertices[(edge + 1) % 4];
      for (let i = 0; i < 110; i++) {
        const t = random();
        scatter(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, .006, 'core');
      }
    }
  }
  for (const [x, y] of [[.4, .19], [.5, .19], [.6, .19], [.32, .76], [.5, .82], [.68, .76]]) {
    for (let i = 0; i < 65; i++) scatter(x, y, .012, 'satellite');
  }
  return points;
}

// Rotate actual volume coordinates before applying perspective, rather than shifting a flat image.
export function projectPoint(x, y, z, yaw, pitch, focal = 1.8) {
  const side = x * Math.cos(yaw) + z * Math.sin(yaw);
  const back = z * Math.cos(yaw) - x * Math.sin(yaw);
  const vertical = y * Math.cos(pitch) - back * Math.sin(pitch);
  const depth = y * Math.sin(pitch) + back * Math.cos(pitch);
  const scale = focal / Math.max(.8, focal - depth);
  return { x: side * scale, y: vertical * scale, depth, scale };
}

// Integrate a damped spring in bounded substeps so mouse disturbance retains momentum and recovers.
export function stepSpring(body, targetX, targetY, dt, stiffness = 38, damping = 7) {
  const time = Math.max(0, Math.min(dt, .05));
  const count = Math.max(1, Math.ceil(time / .008));
  const step = time / count;
  for (let i = 0; i < count; i++) {
    body.vx += ((targetX - body.x) * stiffness - body.vx * damping) * step;
    body.vy += ((targetY - body.y) * stiffness - body.vy * damping) * step;
    body.x += body.vx * step;
    body.y += body.vy * step;
  }
  return body;
}
