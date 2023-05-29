import { Log } from "../logger.js";

import { testNextToken } from "./tests-tokenizer.js";
import { testLetStatements, testReturnStatements } from "./tests-parser.js";

(function runTests() {
    Log.info("interp_js", "starting test suite!");
    const results = {
        totalTests: 0,
        failedTests: 0,
    };
    addResult(results, testNextToken());
    addResult(results, testLetStatements());
    addResult(results, testReturnStatements());

    Log.info("interp_js", "test suite completed!");
    Log.testResult("interp_js", results.totalTests - results.failedTests, results.failedTests);
})();

function addResult(results, result) {
    results.totalTests += result.totalTests;
    results.failedTests += result.failedTests;
}
