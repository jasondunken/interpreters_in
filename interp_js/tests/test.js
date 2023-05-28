import { Log } from "../logger.js";

import { testNextToken } from "./tests-tokenizer.js";

(function runTests() {
    Log.info("interp_js", "starting test suite!");
    const results = {
        totalTests: 0,
        failedTests: 0,
    };
    addResult(results, testNextToken());

    Log.info("interp_js", "test suite completed!");
    Log.testResult("interp_js", results.totalTests - results.failedTests, results.failedTests);
    //process.exit(results.failedTests);
})();

function addResult(results, result) {
    results.totalTests += result.totalTests;
    results.failedTests += result.failedTests;
}
