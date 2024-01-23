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
}

function testBooleanExpression(obj, expected) {
    Log.info("Evaluator Test", "testBooleanExpression()");
}

function testBooleanObject(obj, expected) {
    Log.info("Evaluator Test", "testBooleanObject()");
}

function testBangOperator() {
    Log.info("Evaluator Test", "testBangOperator()");
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
    testEvalIfElseExpressions,
    testEvalReturnStatements,
    testErrorHandling,
};
