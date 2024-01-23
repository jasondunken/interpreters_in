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
        Log.info("Evaluator Test", `test[${i}] expected 'INTEGER' object, got '${evaluation.type()}'`);
        if (!testIntegerObject(i, evaluation, tests[i].expected)) {
            failed++;
        }
    }

    return { totalTests: tests.length, failedTests: failed };
}

function testIntegerObject(i, obj, expected) {
    if (obj.type() != ObjectType.INTEGER_OBJ) {
        Log.error("Evaluator Test", `test[${i}] Incorrect object type expected '${expected}' got '${obj.type()}'`);
        return false;
    }
    if (obj.value != expected) {
        Log.error("Evaluator Test", `test[${i}] Incorrect object value expected '${expected}' got '${obj.value}'`);
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
        Log.info("Evaluator Test", `test[${i}] expected 'BOOLEAN' object, got '${evaluation.type()}'`);
        if (!testBooleanObject(i, evaluation, tests[i].expected)) {
            failed++;
        }
    }

    return { totalTests: tests.length, failedTests: failed };
}

function testBooleanObject(i, obj, expected) {
    if (obj.type() != ObjectType.BOOLEAN_OBJ) {
        Log.error("Evaluator Test", `test[${i}] Incorrect object type expected '${expected}' got '${obj.type()}'`);
        return false;
    }
    if (obj.value != expected) {
        Log.error("Evaluator Test", `test[${i}] Incorrect object value expected '${expected}' got '${obj.value}'`);
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
        Log.info("Evaluator Test", `test[${i}] expected 'BOOLEAN' object, got '${evaluation.type()}'`);
        if (!testBooleanObject(i, evaluation, tests[i].expected)) {
            failed++;
        }
    }

    return { totalTests: tests.length, failedTests: failed };
}

function testEvalIfElseExpressions() {
    Log.info("Evaluator Test", "testEvalIfElseExpressions()");
}

function testNullObject(obj) {
    Log.info("Evaluator Test", "testNullObject()");
}

function testEvalReturnStatements() {
    Log.info("Evaluator Test", "testEvalReturnStatements()");
}

function testErrorHandling() {
    Log.info("Evaluator Test", "testErrorHandling()");
}

export {
    testEvalIntegerExpression,
    testEvalBooleanExpression,
    testEvalBangOperator,
    testEvalIfElseExpressions,
    testEvalReturnStatements,
    testErrorHandling,
};
