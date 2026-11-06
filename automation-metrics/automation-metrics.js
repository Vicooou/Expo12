(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) 
    module.exports = api;
  else root.AutomationMetrics = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function calculateCoverage(automatedCases, plannedCases) {
    const validCount = value => Number.isSafeInteger(value) && value >= 0;
    if (!validCount(automatedCases) || !validCount(plannedCases) || automatedCases > plannedCases) {
      return { valid: false, automatedCases, plannedCases, rate: null };
    }
    return { valid: true, automatedCases, plannedCases, rate: plannedCases === 0 ? null : (automatedCases / plannedCases) * 100 };
  }

  function calculateExecution(results, durationMs) {
    if (!Array.isArray(results) || !results.every(result => typeof result === 'boolean') || !Number.isFinite(durationMs) || durationMs < 0) {
      return { valid: false, total: 0, passed: 0, failed: 0, passRate: null, failRate: null, durationMs: null };
    }
    const total = results.length;
    const passed = results.filter(Boolean).length;
    const failed = total - passed;
    return {
      valid: true, total, passed, failed,
      passRate: total ? (passed / total) * 100 : null,
      failRate: total ? (failed / total) * 100 : null,
      durationMs
    };
  }
  return { calculateCoverage, calculateExecution };
});
