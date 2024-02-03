import { Tokenizer } from "../tokenizer.js";
import { Parser } from "../parser.js";
import { Evaluator } from "../evaluator.js";

import { ObjectType } from "../object.js";

import { Log } from "../logger.js";
import { Environment } from "../environment.js";

function testEval(input) {
    const tokenizer = new Tokenizer(input);
    const parser = new Parser(tokenizer);
    const program = parser.parse();
    const evaluator = new Evaluator();
    const environment = new Environment();
    return evaluator.eval(program, environment);
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
        { input: "foobar", expected: "identifier not found: foobar" },
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

function testEvalLetStatements() {
    Log.info("Evaluator Test", "testLetStatements()");
    const tests = [
        { input: "let a = 5; a;", expected: 5 },
        { input: "let a = 5 * 5; a;", expected: 25 },
        { input: "let a = 5; let b = a; b;", expected: 5 },
        { input: "let a = 5; let b = a; let c = a + b + 5; c;", expected: 15 },
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

function testEvalFunctionObject() {
    Log.info("Evaluator Test", "testEvalFunctionObject()");
    const input = "fn(x) { x + 2; };";
    const expectedParams = ["x"];
    const expectedBody = "(x + 2)";

    const evaluation = testEval(input);
    Log.info("Evaluator Test", `test[0] input "${input}", expected 'FUNCTION', got '${evaluation.type()}'`);
    let failed = false;
    if (evaluation.type() == ObjectType.ERROR_OBJ) {
        Log.error("Evaluator Test", `test[0] expected 'FUNCTION' message, got '${evaluation.type()}'`);
        failed = true;
    }
    if (evaluation.parameters.length != 1) {
        Log.error("Evaluator Test", `test[0] function has wrong parameters, got '${evaluation.parameters}'`);
        failed = true;
    }
    if (evaluation.parameters[0].value != expectedParams[0]) {
        Log.error("Evaluator Test", `test[0] wrong parameter, expected 'x', got '${evaluation.parameters[0]}'`);
        failed = true;
    }
    if (evaluation.body != expectedBody) {
        Log.error(
            "Evaluator Test",
            `test[0] wrong function body, expected '${expectedBody}', got '${evaluation.parameters[0]}'`
        );
        failed = true;
    }
    if (failed) failed = 1;
    return { totalTests: 1, failedTests: failed };
}

function testEvalFunctionApplication() {
    Log.info("Evaluator Test", "testEvalFunctionApplication()");
    const tests = [
        { input: "let identity = fn(x) { x; }; identity(5);", expected: 5 },
        { input: "let identity = fn(x) { return x; }; identity(5);", expected: 5 },
        { input: "let double = fn(x) { return x * 2; }; double(5);", expected: 10 },
        { input: "let add = fn(x, y) { return x + y; }; add(5, 5);", expected: 10 },
        { input: "let add = fn(x, y) { return x + y; }; add(5 + 5 , add(5, 5));", expected: 20 },
        { input: "fn(x) { x; }(5)", expected: 5 },
        // test closures
        { input: "let newAdder = fn(x) { fn(y) { x + y }; }; let addTwo = newAdder(2); addTwo(2);", expected: 4 },
    ];

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const evaluation = testEval(tests[i].input);
        Log.info(
            "Evaluator Test",
            `test[${i}] input "${tests[i].input}", expected '${tests[i].expected}', got '${evaluation.value}'`
        );
        if (evaluation.type() == ObjectType.ERROR_OBJ) {
            Log.error("Evaluator Test", `test[${i}] ${evaluation.string()}`);
            failed++;
        } else if (!testIntegerObject(i, evaluation, tests[i].expected)) {
            failed++;
        }
    }

    return { totalTests: tests.length, failedTests: failed };
}

function testEvalStringLiteral() {
    Log.info("Evaluator Test", "testEvalStringLiteral()");
    const tests = [{ input: '"hello world";', expected: "hello world" }];

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        let testFailed = false;
        const evaluation = testEval(tests[i].input);
        Log.info(
            "Evaluator Test",
            `test[${i}] input "${tests[i].input}", expected '${tests[i].expected}', got '${evaluation.value}'`
        );
        if (evaluation.type() == ObjectType.ERROR_OBJ) {
            Log.error("Evaluator Test", `test[${i}] ${evaluation.string()}`);
            testFailed = true;
        } else if (evaluation.string() != tests[i].expected) {
            testFailed = true;
        }
        if (testFailed) failed++;
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
    testEvalLetStatements,
    testEvalFunctionObject,
    testEvalFunctionApplication,
    testEvalStringLiteral,
};
