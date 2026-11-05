const test = require('node:test');
const assert = require('node:assert/strict');
const { calculate, analyzeRuns } = require('../flaky-tests.js');

test('calcula 20 % con 2 casos inestables de 10 repetidos', () => {
  assert.deepEqual(calculate(10, 2), { valid: true, repeatedCases: 10, unstableCases: 2, rate: 20 });
});

test('devuelve 0 % si ningún caso cambia de resultado', () => {
  assert.equal(calculate(10, 0).rate, 0);
});

test('no calcula la tasa cuando no se repitieron casos', () => {
  assert.equal(calculate(0, 0).rate, null);
});

test('rechaza cantidades inválidas o más casos inestables que repetidos', () => {
  assert.equal(calculate(-1, 0).valid, false);
  assert.equal(calculate(2.5, 1).valid, false);
  assert.equal(calculate(3, 4).valid, false);
});

test('detecta qué pruebas cambiaron de resultado entre ejecuciones', () => {
  const runs = [
    [{ name: 'Compra', pass: true }, { name: 'Filtro', pass: true }],
    [{ name: 'Compra', pass: true }, { name: 'Filtro', pass: false }],
    [{ name: 'Compra', pass: true }, { name: 'Filtro', pass: true }]
  ];
  assert.deepEqual(analyzeRuns(runs), { valid: true, total: 2, unstable: 1, rate: 50 });
});

test('considera estable una suite con resultados iguales en todas las ejecuciones', () => {
  const runs = [
    [{ name: 'Compra', pass: true }],
    [{ name: 'Compra', pass: true }]
  ];
  assert.equal(analyzeRuns(runs).rate, 0);
});

test('rechaza ejecuciones con pruebas o resultados inconsistentes', () => {
  assert.equal(analyzeRuns([[{ name: 'Compra', pass: true }]]).valid, false);
  assert.equal(analyzeRuns([[{ name: 'Compra', pass: true }], [{ name: 'Filtro', pass: false }]]).valid, false);
});
