const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateCoverage, calculateExecution } = require('../automation-metrics.js');

test('calcula cobertura de 20 casos automatizados entre 25 planificados', () => {
  assert.equal(calculateCoverage(20, 25).rate, 80);
});

test('indica cobertura no calculable si no hay casos planificados', () => {
  assert.equal(calculateCoverage(0, 0).rate, null);
});

test('rechaza más casos automatizados que casos planificados', () => {
  assert.equal(calculateCoverage(21, 20).valid, false);
});

test('calcula pass rate, fail rate y duración de una ejecución', () => {
  assert.deepEqual(calculateExecution([true, true, false, true], 12.5), {
    valid: true, total: 4, passed: 3, failed: 1, passRate: 75, failRate: 25, durationMs: 12.5
  });
});

test('maneja una suite sin pruebas ejecutadas', () => {
  const result = calculateExecution([], 0);
  assert.equal(result.passRate, null);
  assert.equal(result.failRate, null);
});
