(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DefectLeakage = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function calculate(before, escaped) {
    const validCount = value => Number.isSafeInteger(value) && value >= 0;
    if (!validCount(before) || !validCount(escaped) || !Number.isSafeInteger(before + escaped)) {
      return { valid: false, before, escaped, total: null, rate: null };
    }
    const total = before + escaped;
    return {
      valid: true, before, escaped, total,
      rate: total === 0 ? null : (escaped / total) * 100
    };
  }
  return { calculate };
});
