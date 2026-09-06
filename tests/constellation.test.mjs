import test from 'node:test';
import assert from 'node:assert/strict';
import { emblemPoints, projectPoint, stepSpring } from '../src/lib/constellation.mjs';

// Stable spatial anchors keep the same organization identity through view changes.
test('the emblem preserves two braces, a stacked core and satellites', () => {
  const points = emblemPoints();
  assert.deepEqual(points, emblemPoints());
  for (const group of ['left-brace', 'right-brace', 'core', 'satellite']) assert(points.filter(p => p.group === group).length > 300);
  assert(points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y) && p.x > 0 && p.x < 1 && p.y > 0 && p.y < 1));
  const left = points.filter(p => p.group === 'left-brace');
  const right = points.filter(p => p.group === 'right-brace');
  assert(Math.max(...left.map(p => p.x)) < .4);
  assert(Math.min(...right.map(p => p.x)) > .6);
  for (let color = 0; color < 7; color++) assert(points.filter(p => p.color === color).length > points.length * .1);
  assert(points.some(p => p.size > 1.5) && points.some(p => p.size < .3));
});

// Depth changes scale and rotation response, making movement distinguishable from flat parallax.
test('near and far stars retain perspective during rotation', () => {
  const near = projectPoint(.2, .1, .15, 0, 0);
  const far = projectPoint(.2, .1, -.15, 0, 0);
  assert(near.scale > far.scale && near.x > far.x);
  const turned = projectPoint(.2, .1, .15, .55, .25);
  assert(Math.hypot(turned.x - near.x, turned.y - near.y) > .03);
  assert(Number.isFinite(turned.scale));
});

// Disturbed particles keep momentum, then settle back to their anchors across frame rates.
test('spring motion carries inertia and reliably reforms the emblem', () => {
  for (const dt of [1 / 30, 1 / 60, 1 / 120]) {
    const body = { x: 0, y: 0, vx: 0, vy: 0 };
    for (let time = 0; time < 1; time += dt) stepSpring(body, 40, -25, dt);
    assert(body.x > 30 && body.y < -20);
    for (let time = 0; time < 5; time += dt) stepSpring(body, 0, 0, dt);
    assert(Math.hypot(body.x, body.y) < .01);
  }
  const moving = { x: 0, y: 0, vx: 20, vy: 0 };
  stepSpring(moving, 0, 0, 1 / 60);
  assert(moving.x > 0);
});
