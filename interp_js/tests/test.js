import { Log } from "../logger.js";

import { testNextToken } from "./tests-tokenizer.js";
import {
    testLetStatements,
    testReturnStatements,
    testIdentifierExpressions,
    testIntegerLiteralExpressions,
    testParsingPrefixExpressions,
    testParsingInfixExpressions,
    testOperatorPrecedenceParsing,
    testIfExpressions,
    testIfElseExpressions,
    testFunctionLiteralParsing,
    testCallExpressionParsing,
} from "./tests-parser.js";

(function runTests() {
    Log.info("interp_js", "starting test suite!");
    const results = {
        totalTests: 0,
        failedTests: 0,
    };
    // tokenizer
    addResult(results, testNextToken());
    // parser
    addResult(results, testLetStatements());
    addResult(results, testReturnStatements());
    addResult(results, testIdentifierExpressions());
    addResult(results, testIntegerLiteralExpressions());
    addResult(results, testParsingPrefixExpressions());
    addResult(results, testParsingInfixExpressions());
    addResult(results, testOperatorPrecedenceParsing());
    addResult(results, testIfExpressions());
    addResult(results, testIfElseExpressions());
    addResult(results, testFunctionLiteralParsing());
    addResult(results, testCallExpressionParsing());

    // evaluator

    Log.info("interp_js", "test suite completed!");
    Log.testResult("interp_js", results.totalTests - results.failedTests, results.failedTests);
})();

function addResult(results, result) {
    results.totalTests += result.totalTests;
    results.failedTests += result.failedTests;
}
