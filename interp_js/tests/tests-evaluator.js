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
    if (obj.type() != ObjectType.INTEGER_OBJ && expected !== null) {
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
        { input: '"Hello" - "World"', expected: "unknown operator: STRING - STRING" },
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
            Log.error("Evaluator Test", `test[${i}] ${evaluation.toString()}`);
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
            Log.error("Evaluator Test", `test[${i}] ${evaluation.toString()}`);
            testFailed = true;
        } else if (evaluation.toString() != tests[i].expected) {
            testFailed = true;
        }
        if (testFailed) failed++;
    }

    return { totalTests: tests.length, failedTests: failed };
}

function testEvalStringConcatenation() {
    Log.info("Evaluator Test", "testEvalStringConcatenation()");
    const tests = [{ input: '"hello" + " " + "world";', expected: "hello world" }];

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        const evaluation = testEval(test.input);
        let testFailed = false;
        Log.info(
            "Evaluator Test",
            `test[${i}] input "${test.input}", expected '${test.expected}', got '${evaluation.value}'`
        );
        if (evaluation.type() == ObjectType.ERROR_OBJ) {
            Log.error("Evaluator Test", `test[${i}] ${evaluation.toString()}`);
            testFailed = true;
        } else if (evaluation.type() != ObjectType.STRING_OBJ) {
            Log.error("Evaluator Test", `test[${i}] expected STRING object, got ${evaluation.type()}`);
            testFailed = true;
        } else if (evaluation.value != test.expected) {
            Log.error("Evaluator Test", `test[${i}] expected ${test.expected}, got ${evaluation.value}`);
            testFailed = true;
        }
        if (testFailed) failed++;
    }

    return { totalTests: tests.length, failedTests: failed };
}

function testEvalBuiltinFunctions() {
    Log.info("Evaluator Test", "testEvalBuiltinFunctions()");
    const testsValid = [
        { input: 'len("");', expected: 0 },
        { input: 'len("four");', expected: 4 },
        { input: 'len("hello world");', expected: 11 },
    ];

    const testsError = [
        { input: "len(1);", expected: "argument to 'len' not supported, got INTEGER" },
        { input: 'len("one", "two");', expected: "wrong number of arguments. got=2, want=1" },
    ];
    const totalTests = testsValid.length + testsError.length;

    let failed = 0;
    for (let i = 0; i < testsValid.length; i++) {
        const test = testsValid[i];
        const evaluation = testEval(test.input);
        Log.info(
            "Evaluator Test",
            `valid test[${i}] input "${test.input}", expected 'INTEGER', got '${
                evaluation.value !== undefined ? evaluation.value : evaluation.message
            }'`
        );

        let testFailed = false;
        switch (evaluation.type()) {
            case ObjectType.INTEGER_OBJ:
                testFailed = !testIntegerObject(i, evaluation, test.expected);
                break;
            case ObjectType.ERROR_OBJ:
                Log.error("Evaluator Test", `ERROR valid test[${i}] ${evaluation.message}`);
                testFailed = true;
                break;
            default:
                Log.error("Evaluator Test", `object is not INTEGER, got=${evaluation.type()}`);
                testFailed = true;
        }
        if (testFailed) failed++;
    }

    for (let i = 0; i < testsError.length; i++) {
        const test = testsError[i];
        const testNum = i + testsValid.length;
        const evaluation = testEval(test.input);
        Log.info(
            "Evaluator Test",
            `error test[${testNum}] input "${test.input}", expected 'ERROR', got '${
                evaluation.value !== undefined ? evaluation.value : evaluation.toString()
            }'`
        );

        let testFailed = false;
        switch (evaluation.type()) {
            case ObjectType.ERROR_OBJ:
                if (evaluation.message !== test.expected) {
                    Log.error(
                        "Evaluator Test",
                        `error test[${testNum}] expected=${test.expected}, got="${evaluation.type()}"`
                    );
                    testFailed = true;
                }
                break;
            default:
                Log.error("Evaluator Test", `error test[${testNum}] object is not ERROR, got=${evaluation.type()}`);
                testFailed = true;
        }
        if (testFailed) failed++;
    }

    return { totalTests, failedTests: failed };
}

function testEvalArrayLiteral() {
    Log.info("Evaluator Test", "testEvalArrayLiteral()");
    const tests = [{ input: "[1, 2 * 2, 3 + 3]", expected: [1, 4, 6] }];

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        const evaluation = testEval(test.input);
        Log.info("Evaluator Test", `test[${i}] input "${test.input}", expected 'ARRAY', got '${evaluation.type()}'`);

        let testFailed = false;
        if (evaluation.type() !== ObjectType.ARRAY_OBJ) {
            Log.error("Evaluator Test", `test[${i}] object is not array, got=${evaluation.type()}`);
            failed++;
            break;
        }

        if (evaluation.elements.length != test.expected.length) {
            Log.error(
                "Evaluator Test",
                `test[${i}] array has wrong number of elements, expected=${
                    test.expected.length
                }, got=${evaluation.type()}`
            );
            testFailed = true;
        }

        if (!testIntegerObject(i, evaluation.elements[0], test.expected[0])) testFailed = true;
        if (!testIntegerObject(i, evaluation.elements[1], test.expected[1])) testFailed = true;
        if (!testIntegerObject(i, evaluation.elements[2], test.expected[2])) testFailed = true;

        if (testFailed) failed++;
    }

    return { totalTests: tests.length, failedTests: failed };
}

function testEvalArrayIndexExpression() {
    Log.info("Evaluator Test", "testEvalArrayIndexExpression()");
    const testsValid = [
        { input: "[1, 2, 3][0]", expected: 1 },
        { input: "[1, 2, 3][1]", expected: 2 },
        { input: "[1, 2, 3][2]", expected: 3 },
        { input: "let i = 0; [1][i];", expected: 1 },
        { input: "[1, 2, 3][1 + 1];", expected: 3 },
        { input: "let myArray = [1, 2, 3]; myArray[2];", expected: 3 },
        { input: "let myArray = [1, 2, 3]; myArray[0] + myArray[1] + myArray[2];", expected: 6 },
        { input: "let myArray = [1, 2, 3]; let i = myArray[0]; myArray[i];", expected: 2 },
    ];

    const testsError = [
        { input: "[1, 2, 3][3];", expected: null },
        { input: "[1, 2, 3][-1];", expected: null },
    ];
    const totalTests = testsValid.length + testsError.length;

    let failed = 0;
    for (let i = 0; i < testsValid.length; i++) {
        const test = testsValid[i];
        const evaluation = testEval(test.input);
        Log.info("Evaluator Test", `test[${i}] input "${test.input}", expected 'INTEGER', got '${evaluation.type()}'`);

        if (!testIntegerObject(i, evaluation, test.expected)) failed++;
    }
    for (let i = 0; i < testsError.length; i++) {
        const test = testsError[i];
        const testNum = i + testsValid.length;
        const evaluation = testEval(test.input);
        Log.info(
            "Evaluator Test",
            `test[${testNum}] input "${test.input}", expected 'NULL', got '${evaluation.type()}'`
        );

        if (!testIntegerObject(i, evaluation, test.expected)) failed++;
    }

    return { totalTests, failedTests: failed };
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
    testEvalStringConcatenation,
    testEvalBuiltinFunctions,
    testEvalArrayLiteral,
    testEvalArrayIndexExpression,
};
