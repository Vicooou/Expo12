(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FlakyTests = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function calculate(repeatedCases, unstableCases) {
    const validCount = value => Number.isSafeInteger(value) && value >= 0;
    if (!validCount(repeatedCases) || !validCount(unstableCases) || unstableCases > repeatedCases) {
      return { valid: false, repeatedCases, unstableCases, rate: null };
    }
    return {
      valid: true, repeatedCases, unstableCases,
      rate: repeatedCases === 0 ? null : (unstableCases / repeatedCases) * 100
    };
  }
  function analyzeRuns(runs) {
    if (!Array.isArray(runs) || runs.length < 2 || !Array.isArray(runs[0])) {
      return { valid: false, total: 0, unstable: 0, rate: null };
    }
    const names = runs[0].map(test => test && test.name);
    if (names.some(name => typeof name !== 'string' || !name) || new Set(names).size !== names.length) {
      return { valid: false, total: 0, unstable: 0, rate: null };
    }
    const consistent = runs.every(run => Array.isArray(run) && run.length === names.length &&
      run.every((test, index) => test && test.name === names[index] && typeof test.pass === 'boolean'));
    if (!consistent) return { valid: false, total: 0, unstable: 0, rate: null };
    const unstable = names.filter((name, index) => {
      const results = new Set(runs.map(run => run[index].pass));
      return results.size > 1;
    }).length;
    return { valid: true, total: names.length, unstable, rate: names.length ? (unstable / names.length) * 100 : null };
  }
  return { calculate, analyzeRuns };
});
