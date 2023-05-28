import { Log } from "../cli.js";

import { testNextToken } from "./tests-tokenizer.js";

(function runTests() {
    Log.LogInfo("interp_js", "starting test suite!");
    const results = {
        totalTests: 0,
        failedTests: 0,
    };
    addResult(results, testNextToken());

    Log.LogInfo("interp_js", "test suite completed!");
    Log.LogInfo("interp_js", `Passed: ${results.totalTests - results.failedTests}, Failed ${results.failedTests}`);
    process.exit(results.failedTests);
})();

function addResult(results, result) {
    results.totalTests += result.totalTests;
    results.failedTests += result.failedTests;
}
