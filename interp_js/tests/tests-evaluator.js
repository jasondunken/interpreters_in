import { Tokenizer } from "../tokenizer.js";
import { Parser } from "../parser.js";
import { Evaluator } from "../evaluator.js";

import { ObjectType } from "../object.js";

import { Log } from "../logger.js";

function testEval(input) {
    const tokenizer = new Tokenizer(input);
    const parser = new Parser(tokenizer);
    const program = parser.parse();
    const evaluator = new Evaluator();
    return evaluator.eval(program);
}

function testEvalIntegerExpression() {
    Log.info("Evaluator Test", "testEvalIntegerExpression()");
    const tests = [
        { input: "5", expected: 5 },
        { input: "10", expected: 10 },
        { input: "-5", expected: -5 },
        { input: "-10", expected: -10 },
        { input: "5 + 5 + 5 + 5 - 10", expected: 10 },
        { input: "2 * 2 * 2 * 2 * 2", expected: 32 },
        { input: "-50 + 100 - 50", expected: 0 },
        { input: "5 * 2 + 10", expected: 20 },
        { input: "5 + 2 * 10", expected: 25 },
        { input: "20 + 2 * -10", expected: 0 },
        { input: "50 / 2 * 2 + 10", expected: 60 },
        { input: "2 * (5 + 10)", expected: 30 },
        { input: "3 * 3 * 3 + 10", expected: 37 },
        { input: "3 * (3 * 3) + 10", expected: 37 },
        { input: "(5 + 10 * 2 + 15 / 3) * 2 + -10", expected: 50 },
    ];

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        let evaluation = testEval(tests[i].input);
        Log.info(
            "Evaluator Test",
            `test[${i}] input "${tests[i].input}", expected '${tests[i].expected}', got '${evaluation.value}'`
        );
        if (!testIntegerObject(i, evaluation, tests[i].expected)) {
            failed++;
        }
    }

    return { totalTests: tests.length, failedTests: failed };
}

function testIntegerObject(i, obj, expected) {
    if (obj.type() != ObjectType.INTEGER_OBJ) {
        Log.error("Evaluator Test", `test[${i}] Incorrect object type, expected 'INTEGER' got '${obj.type()}'`);
        return false;
    }
    if (obj.value != expected) {
        Log.error("Evaluator Test", `test[${i}] Incorrect object value, expected '${expected}' got '${obj.value}'`);
        return false;
    }
    return true;
}

function testEvalBooleanExpression() {
    Log.info("Evaluator Test", "testEvalBooleanExpression()");
    const tests = [
        { input: "true", expected: true },
        { input: "false", expected: false },
        { input: "1 < 2", expected: true },
        { input: "1 > 2", expected: false },
        { input: "1 < 1", expected: false },
        { input: "1 > 1", expected: false },
        { input: "1 == 1", expected: true },
        { input: "1 != 1", expected: false },
        { input: "1 == 2", expected: false },
        { input: "1 != 2", expected: true },
        { input: "true == true", expected: true },
        { input: "false == false", expected: true },
        { input: "true == false", expected: false },
        { input: "true != false", expected: true },
        { input: "false != true", expected: true },
        { input: "(1 < 2) == true", expected: true },
        { input: "(1 < 2) == false", expected: false },
        { input: "(1 > 2) == true", expected: false },
        { input: "(1 > 2) == false", expected: true },
    ];

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const evaluation = testEval(tests[i].input);
        Log.info(
            "Evaluator Test",
            `test[${i}] input "${tests[i].input}", expected '${tests[i].expected}', got '${evaluation.value}'`
        );
        if (!testBooleanObject(i, evaluation, tests[i].expected)) {
            failed++;
        }
    }

    return { totalTests: tests.length, failedTests: failed };
}

function testBooleanObject(i, obj, expected) {
    if (obj.type() != ObjectType.BOOLEAN_OBJ) {
        Log.error("Evaluator Test", `test[${i}] Incorrect object type, expected '${expected}' got '${obj.type()}'`);
        return false;
    }
    if (obj.value != expected) {
        Log.error("Evaluator Test", `test[${i}] Incorrect object value, expected '${expected}' got '${obj.value}'`);
        return false;
    }
    return true;
}

function testEvalBangOperator() {
    Log.info("Evaluator Test", "testBangOperator()");
    const tests = [
        { input: "!true", expected: false },
        { input: "!false", expected: true },
        { input: "!5", expected: false },
        { input: "!!true", expected: true },
        { input: "!!false", expected: false },
        { input: "!!5", expected: true },
    ];

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const evaluation = testEval(tests[i].input);
        Log.info(
            "Evaluator Test",
            `test[${i}] input "${tests[i].input}", expected '${tests[i].expected}', got '${evaluation.value}'`
        );
        if (!testBooleanObject(i, evaluation, tests[i].expected)) {
            failed++;
        }
    }

    return { totalTests: tests.length, failedTests: failed };
}

function testEvalIfElseExpressions() {
    Log.info("Evaluator Test", "testEvalIfElseExpressions()");
    const tests = [
        { input: "if (true) { 10 }", expected: 10 },
        { input: "if (false) { 10 }", expected: null },
        { input: "if (1) { 10 }", expected: 10 },
        { input: "if (1 < 2) { 10 }", expected: 10 },
        { input: "if (1 > 2) { 10 }", expected: null },
        { input: "if (1 > 2) { 10 } else { 20 }", expected: 20 },
        { input: "if (1 < 2) { 10 } else { 20 }", expected: 10 },
    ];

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const evaluation = testEval(tests[i].input);
        Log.info(
            "Evaluator Test",
            `test[${i}] input "${tests[i].input}", expected '${tests[i].expected}', got '${evaluation.value}'`
        );
        if (tests[i].expected != null) {
            if (!testIntegerObject(i, evaluation, tests[i].expected)) {
                failed++;
            }
        } else {
            if (!testNullObject(i, evaluation)) {
                failed++;
            }
        }
    }

    return { totalTests: tests.length, failedTests: failed };
}

function testNullObject(i, obj) {
    if (obj.type() != ObjectType.NULL_OBJ) {
        Log.error("Evaluator Test", `test[${i}] expected 'NULL' object, got '${obj.type()}'`);
        return false;
    }
    return true;
}

function testEvalReturnStatements() {
    Log.info("Evaluator Test", "testEvalReturnStatements()");
    const tests = [
        { input: "return 10;", expected: 10 },
        { input: "return 10; 9;", expected: 10 },
        { input: "return 2 * 5; 9;", expected: 10 },
        { input: "9; return 2 * 5; 9;", expected: 10 },
        { input: "if (10 > 1) { if (10 > 1) { return 10; } return 1; }", expected: 10 },
    ];

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const evaluation = testEval(tests[i].input);
        Log.info(
            "Evaluator Test",
            `test[${i}] input "${tests[i].input}", expected '${tests[i].expected}', got '${evaluation.value}'`
        );
        if (!testIntegerObject(i, evaluation, tests[i].expected)) {
            failed++;
        }
    }

    return { totalTests: tests.length, failedTests: failed };
}

function testErrorHandling() {
    Log.info("Evaluator Test", "testErrorHandling()");
    const tests = [
        { input: "5 + true;", expected: "type mismatch: INTEGER + BOOLEAN" },
        { input: "5 + true; 5;", expected: "type mismatch: INTEGER + BOOLEAN" },
        { input: "-true", expected: "unknown operator: -BOOLEAN" },
        { input: "true + false;", expected: "unknown operator: BOOLEAN + BOOLEAN" },
        { input: "5; true + false; 5;", expected: "unknown operator: BOOLEAN + BOOLEAN" },
        { input: "if (10 > 1) { true + false; }", expected: "unknown operator: BOOLEAN + BOOLEAN" },
        {
            input: "if (10 > 1) { if (10 > 1) { return true + false; } return 1; }",
            expected: "unknown operator: BOOLEAN + BOOLEAN",
        },
    ];

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const evaluation = testEval(tests[i].input);
        Log.info(
            "Evaluator Test",
            `test[${i}] input "${tests[i].input}", expected '${tests[i].expected}', got '${evaluation.message}'`
        );
        if (evaluation.type() != ObjectType.ERROR_OBJ) {
            Log.error("Evaluator Test", `test[${i}] expected 'ERROR' object, got '${evaluation.type()}'`);
            failed++;
        }
        if (evaluation.message != tests[i].expected) {
            Log.error(
                "Evaluator Test",
                `test[${i}] expected '${tests[i].expected}' message, got '${evaluation.message}'`
            );
            failed++;
        }
    }

    return { totalTests: tests.length, failedTests: failed };
}

export {
    testEvalIntegerExpression,
    testEvalBooleanExpression,
    testEvalBangOperator,
    testEvalIfElseExpressions,
    testEvalReturnStatements,
    testErrorHandling,
};
