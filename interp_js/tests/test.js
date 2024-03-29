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
    testStringLiteralExpression,
    testCallExpressionParsing,
    testArrayLiteralParsing,
    testIndexExpressionParsing,
} from "./tests-parser.js";
import {
    testEvalIntegerExpression,
    testEvalBooleanExpression,
    testEvalBangOperator,
    testEvalIfElseExpressions,
    testEvalReturnStatements,
    testErrorHandling,
    testEvalLetStatements,
    testEvalFunctionObject,
    testEvalFunctionApplication,
    testEvalStringLiteral,
    testEvalStringConcatenation,
    testEvalBuiltinFunctions,
    testEvalArrayLiteral,
    testEvalArrayIndexExpression,
} from "./tests-evaluator.js";

(function runTests() {
    Log.info("interp_js", "starting test suite!");
    const results = {
        totalTests: 0,
        failedTests: 0,
    };
    // tokenizer;
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
    addResult(results, testStringLiteralExpression());
    addResult(results, testArrayLiteralParsing());
    addResult(results, testIndexExpressionParsing());
    // evaluator
    addResult(results, testEvalIntegerExpression());
    addResult(results, testEvalBooleanExpression());
    addResult(results, testEvalBangOperator());
    addResult(results, testEvalIfElseExpressions());
    addResult(results, testEvalReturnStatements());
    addResult(results, testErrorHandling());
    addResult(results, testEvalLetStatements());
    addResult(results, testEvalFunctionObject());
    addResult(results, testEvalFunctionApplication());
    addResult(results, testEvalStringLiteral());
    addResult(results, testEvalStringConcatenation());
    addResult(results, testEvalBuiltinFunctions());
    addResult(results, testEvalArrayLiteral());
    addResult(results, testEvalArrayIndexExpression());

    Log.info("interp_js", "test suite completed!");
    Log.testResult("interp_js", results.totalTests - results.failedTests, results.failedTests);
})();

function addResult(results, result) {
    results.totalTests += result.totalTests;
    results.failedTests += result.failedTests;
}
