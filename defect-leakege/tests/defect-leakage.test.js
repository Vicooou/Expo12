const test = require('node:test');
const assert = require('node:assert/strict');
const { calculate } = require('../defect-leakage.js');

test('calcula 20 % con 40 defectos previos y 10 escapados', () => {
  assert.deepEqual(calculate(40, 10), { valid: true, before: 40, escaped: 10, total: 50, rate: 20 });
});

test('devuelve 0 % si no se escaparon defectos', () => {
  assert.equal(calculate(12, 0).rate, 0);
});

test('no calcula una tasa si no hay defectos registrados', () => {
  assert.equal(calculate(0, 0).rate, null);
});

test('rechaza cantidades negativas, decimales o no seguras', () => {
  assert.equal(calculate(-1, 2).valid, false);
  assert.equal(calculate(1.5, 2).valid, false);
  assert.equal(calculate(Number.MAX_SAFE_INTEGER, 1).valid, false);
});
