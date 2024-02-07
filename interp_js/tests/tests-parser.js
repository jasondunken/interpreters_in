import { Tokenizer } from "../tokenizer.js";
import { Parser } from "../parser.js";

import { Log } from "../logger.js";
import { ObjectType } from "../object.js";

function testLetStatements() {
    Log.info("Parser Test", "testing parseLetStatement()");
    const input = `
        let x = 5;
        let y = 10;
        let foobar = 838383;    
    `;

    const tests = [
        ["x", 5],
        ["y", 10],
        ["foobar", 838383],
    ];

    const program = parseProgram(input);
    if (!programParsingSuccessful(program, tests.length)) {
        return { totalTests: tests.length, failedTests: tests.length };
    }

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const statement = program.statements[i];
        const expected = tests[i];
        Log.info("Parser Test", `test[${i}] expected 'let' got '${statement.token.literal}'`);

        let testFailed = false;
        if (statement.token.literal != "let") {
            Log.error("Parser Test", `test[${i}] token literal not 'let' got '${statement.token.literal}'`);
            testFailed = true;
        }

        if (statement.constructor.name != "LetStatement") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'LetStatement' got '${statement.constructor.name}'`
            );
            testFailed = true;
        }

        if (statement.name.value != expected[0]) {
            Log.error(
                "Parser Test",
                `test[${i}] statement name value not '${expected[0]}' got '${statement.name.value}'`
            );
            testFailed = true;
        }

        if (statement.name.token.literal != expected[0]) {
            Log.error(
                "Parser Test",
                `test[${i}] statement name token literal not '${expected[0]}' got '${statement.name.token.literal}'`
            );
            testFailed = true;
        }

        if (statement.value.token.literal != expected[1]) {
            Log.error(
                "Parser Test",
                `test[${i}] statement value token literal not '${expected[1]}' got '${statement.value.token.literal}'`
            );
            testFailed = true;
        }

        if (statement.value.value != expected[1]) {
            Log.error(
                "Parser Test",
                `test[${i}] statement name value value not '${expected[1]}' got '${statement.value.value}'`
            );
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testReturnStatements() {
    Log.info("Parser Test", "testing parseReturnStatement()");
    const input = `
        return 5;
        return 10;
        return 993322;
    `;

    const tests = [5, 10, 993322];

    const program = parseProgram(input);
    if (!programParsingSuccessful(program, tests.length)) {
        return { totalTests: tests.length, failedTests: tests.length };
    }

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const statement = program.statements[i];
        Log.info("Parser Test", `test[${i}] expected 'return' got '${statement.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ReturnStatement") {
            Log.error(
                "ParserTest",
                `test[${i}] statement type not 'ReturnStatement', got '${statement.constructor.name}'`
            );
            testFailed = true;
        }
        if (statement.token.literal != "return") {
            Log.error(
                "ParserTest",
                `test[${i}] statement token literal not 'return', got '${statement.token.literal}'`
            );
            testFailed = true;
        }
        if (statement.returnValue.value != tests[i]) {
            Log.error(
                "ParserTest",
                `test[${i}] statement return value not '${tests[i]}', got '${statement.returnValue.value}'`
            );
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testIdentifierExpressions() {
    Log.info("Parser Test", "testing parseIdentifierExpression()");
    const input = `
        foobar;
        test;
        x;
        a;
        this;
    `;

    const tests = ["foobar", "test", "x", "a", "this"];

    const program = parseProgram(input);
    if (!programParsingSuccessful(program, tests.length)) {
        return { totalTests: tests.length, failedTests: tests.length };
    }

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const statement = program.statements[i];
        const expression = statement.expression;
        Log.info("Parser Test", `test[${i}] expected '${tests[i]}' got '${expression.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ExpressionStatement") {
            Log.error(
                "ParserTest",
                `test[${i}] expression type not 'ExpressionStatement', got ;${statement.constructor.name};`
            );
            testFailed = true;
        }
        if (expression.constructor.name != "Identifier") {
            Log.error(
                "ParserTest",
                `test[${i}] expression type not 'Identifier', got '${expression.constructor.name}'`
            );
            testFailed = true;
        }
        if (expression.token.literal != tests[i]) {
            Log.error(
                "ParserTest",
                `test[${i}] expression token literal not '${tests[i]}', got '${expression.token.literal}'`
            );
            testFailed = true;
        }
        if (expression.value != tests[i]) {
            Log.error("ParserTest", `test[${i}] expression value not '${tests[i]}', got '${expression.value}'`);
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testIntegerLiteralExpressions() {
    Log.info("Parser Test", "testing parseIntegerLiteralExpression()");
    const input = `
        5;
        10;
        999;
    `;

    const tests = [5, 10, 999];

    const program = parseProgram(input);
    if (!programParsingSuccessful(program, tests.length)) {
        return { totalTests: tests.length, failedTests: tests.length };
    }

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const statement = program.statements[i];
        const expression = statement.expression;
        Log.info("Parser Test", `test[${i}] expected '${tests[i]}' got '${expression.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ExpressionStatement") {
            Log.error(
                "ParserTest",
                `test[${i}] expression type not 'ExpressionStatement', got '${statement.constructor.name}'`
            );
            testFailed = true;
        }
        if (expression.constructor.name != "IntegerLiteral") {
            Log.error(
                "ParserTest",
                `test[${i}] expression type not 'IntegerLiteral', got '${expression.constructor.name}'`
            );
            testFailed = true;
        }
        if (expression.token.literal != tests[i]) {
            Log.error(
                "ParserTest",
                `test[${i}] expression token literal not '${tests[i]}', got '${expression.token.literal}'`
            );
            testFailed = true;
        }
        if (expression.value != tests[i]) {
            Log.error("ParserTest", `test[${i}] expression value not '${tests[i]}', got '${expression.value}'`);
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testParsingPrefixExpressions() {
    Log.info("Parser Test", "testing parsePrefixExpression()");
    const input = `
        -5;
        !10;
    `;

    const tests = [
        ["-", 5],
        ["!", 10],
    ];

    const program = parseProgram(input);
    if (!programParsingSuccessful(program, tests.length)) {
        return { totalTests: tests.length, failedTests: tests.length };
    }

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const statement = program.statements[i];
        const expression = statement.expression;
        Log.info("Parser Test", `test[${i}] expected '${tests[i][0]}' got '${expression.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ExpressionStatement") {
            Log.error(
                "ParserTest",
                `test[${i}] expression type not 'ExpressionStatement', got '${statement.constructor.name}'`
            );
            testFailed = true;
        }
        if (expression.constructor.name != "PrefixExpression") {
            Log.error(
                "ParserTest",
                `test[${i}] expression type not 'PrefixExpression', got '${expression.constructor.name}'`
            );
            testFailed = true;
        }
        if (expression.operator != tests[i][0]) {
            Log.error(
                "ParserTest",
                `test[${i}] expression operator not '${tests[i][0]}', got '${expression.operator}'`
            );
            testFailed = true;
        }
        if (expression.right.value != tests[i][1]) {
            Log.error(
                "ParserTest",
                `test[${i}] expression value not '${tests[i][1]}', got '${expression.right.value}'`
            );
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testParsingInfixExpressions() {
    Log.info("Parser Test", "testing parseInfixExpression()");
    const input = `
        5 - 5;
        10 + 10;
        999 / 5;
        128 * 256;
        5 > 5;
        5 < 5;
        5 == 5;
        5 != 5
    `;

    const tests = [
        [5, "-", 5],
        [10, "+", 10],
        [999, "/", 5],
        [128, "*", 256],
        [5, ">", 5],
        [5, "<", 5],
        [5, "==", 5],
        [5, "!=", 5],
    ];

    const program = parseProgram(input);
    if (!programParsingSuccessful(program, tests.length)) {
        return { totalTests: tests.length, failedTests: tests.length };
    }

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const statement = program.statements[i];
        const expression = statement.expression;
        Log.info("Parser Test", `test[${i}] expected '${tests[i][1]}' got '${expression.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ExpressionStatement") {
            Log.error(
                "ParserTest",
                `test[${i}] expression type not 'ExpressionStatement', got '${expression.constructor.name}'`
            );
            testFailed = true;
        }
        if (expression.constructor.name != "InfixExpression") {
            Log.error(
                "ParserTest",
                `test[${i}] expression type not 'InfixExpression', got '${expression.constructor.name}'`
            );
            testFailed = true;
        }
        if (expression.token.literal != tests[i][1]) {
            Log.error(
                "ParserTest",
                `test[${i}] expression token literal not '${tests[i][1]}', got '${expression.token.literal}'`
            );
            testFailed = true;
        }
        if (expression.left != tests[i][0]) {
            Log.error(
                "ParserTest",
                `test[${i}] expression left value not '${tests[i][0]}', got '${expression.left.value}'`
            );
            testFailed = true;
        }
        if (expression.right != tests[i][2]) {
            Log.error(
                "ParserTest",
                `test[${i}] expression right value not '${tests[i][2]}', got '${expression.right.value}'`
            );
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testOperatorPrecedenceParsing() {
    Log.info("Parser Test", "testing operator precedence parsing");
    const tests = [
        ["-a * b", "((-a) * b)"],
        ["!-a", "(!(-a))"],
        ["a + b + c", "((a + b) + c)"],
        ["a + b - c", "((a + b) - c)"],
        ["a * b * c", "((a * b) * c)"],
        ["a * b / c", "((a * b) / c)"],
        ["a + b / c", "(a + (b / c))"],
        ["a + b * c + d / e - f", "(((a + (b * c)) + (d / e)) - f)"],
        ["3 + 4; -5 * 5", "(3 + 4)((-5) * 5)"],
        ["5 > 4 == 3 < 4", "((5 > 4) == (3 < 4))"],
        ["5 < 4 != 3 > 4", "((5 < 4) != (3 > 4))"],
        ["3 + 4 * 5 == 3 * 1 + 4 * 5", "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))"],
        ["3 > 5 == false", "((3 > 5) == false)"],
        ["3 < 5 == true", "((3 < 5) == true)"],
        ["a + add(b * c) + d", "((a + add((b * c))) + d)"],
        ["a * [1, 2, 3, 4][b + c] * d", "((a * ([1, 2, 3, 4][(b + c)])) * d)"],
        ["add(a * b[2], b[1], 2 * [1, 2][1])", "add((a * (b[2])), (b[1]), (2 * ([1, 2][1])))"],
    ];

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const program = parseProgram(tests[i][0], 1);
        if (!programParsingSuccessful(program)) {
            failed++;
            continue;
        }
        const result = program.toString();

        if (result != tests[i][1]) {
            Log.error("ParserTest", `test[${i}] input '${tests[i][0]}' expected '${tests[i][1]}' got '${result}'`);
            failed++;
        } else {
            Log.info("Parser Test", `test[${i}] input '${tests[i][0]}' got '${result}'`);
        }
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testIfExpressions() {
    Log.info("Parser Test", "testing parseIfExpression()");
    const input = `
        if (x < y) { x };
        if (a > b) { a };   
        if (i == j) { j };   
    `;

    const tests = [
        ["x", "<", "y", "x"],
        ["a", ">", "b", "a"],
        ["i", "==", "j", "j"],
    ];

    const program = parseProgram(input);
    if (!programParsingSuccessful(program, tests.length)) {
        return { totalTests: tests.length, failedTests: tests.length };
    }

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const statement = program.statements[i];
        const expression = statement.expression;
        const condition = expression.condition;
        const consequence = expression.consequence;
        const expected = tests[i];
        Log.info("Parser Test", `test[${i}] expected 'if' got '${statement.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ExpressionStatement") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'ExpressionStatement' got '${statement.constructor.name}'`
            );
            testFailed = true;
        }

        if (expression.constructor.name != "IfExpression") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'IfExpression' got '${expression.constructor.name}'`
            );
            testFailed = true;
        }

        if (condition.left.value != expected[0]) {
            Log.error(
                "Parser Test",
                `test[${i}] condition left value not '${expected[0]}' got '${condition.left.value}'`
            );
            testFailed = true;
        }

        if (condition.operator != expected[1]) {
            Log.error("Parser Test", `test[${i}] condition operator not '${expected[1]}' got '${condition.operator}'`);
            testFailed = true;
        }

        if (condition.right.value != expected[2]) {
            Log.error(
                "Parser Test",
                `test[${i}] condition right value not '${expected[2]}' got '${condition.right.value}'`
            );
            testFailed = true;
        }

        if (consequence.statements[0].expression.value != expected[3]) {
            Log.error(
                "Parser Test",
                `test[${i}] consequence value not '${expected[3]}' got '${consequence.statements[0].expression.value}'`
            );
            testFailed = true;
        }

        if (expression.alternative) {
            Log.error("Parser Test", `test[${i}] alternative was not null got '${expression.alternative}'`);
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testIfElseExpressions() {
    Log.info("Parser Test", "testing parseIfExpression() with else");
    const input = `
        if (x < y) { x } else { y };
        if (a > b) { a } else { b };   
        if (i == j) { j } else { null };   
    `;

    const tests = [
        ["x", "<", "y", "x", "y"],
        ["a", ">", "b", "a", "b"],
        ["i", "==", "j", "j", "null"],
    ];

    const program = parseProgram(input);
    if (!programParsingSuccessful(program, tests.length)) {
        return { totalTests: tests.length, failedTests: tests.length };
    }

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const statement = program.statements[i];
        const expression = statement.expression;
        const condition = expression.condition;
        const consequence = expression.consequence;
        const alternative = expression.alternative;
        const expected = tests[i];
        Log.info("Parser Test", `test[${i}] expected 'if' got '${statement.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ExpressionStatement") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'ExpressionStatement' got '${statement.constructor.name}'`
            );
            testFailed = true;
        }

        if (expression.constructor.name != "IfExpression") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'IfExpression' got '${expression.constructor.name}'`
            );
            testFailed = true;
        }

        if (condition.left.value != expected[0]) {
            Log.error(
                "Parser Test",
                `test[${i}] condition left value not '${expected[0]}' got '${condition.left.value}'`
            );
            testFailed = true;
        }

        if (condition.operator != expected[1]) {
            Log.error("Parser Test", `test[${i}] condition operator not '${expected[1]}' got '${condition.operator}'`);
            testFailed = true;
        }

        if (condition.right.value != expected[2]) {
            Log.error(
                "Parser Test",
                `test[${i}] condition right value not '${expected[2]}' got '${condition.right.value}'`
            );
            testFailed = true;
        }

        if (consequence.statements[0].expression.value != expected[3]) {
            Log.error(
                "Parser Test",
                `test[${i}] consequence value not '${expected[3]}' got '${consequence.statements[0].expression.value}'`
            );
            testFailed = true;
        }

        if (alternative.statements[0].expression.value != expected[4]) {
            Log.error(
                "Parser Test",
                `test[${i}] alternative value not '${expected[4]}' got '${alternative.statements[0].expression.value}'`
            );
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testFunctionLiteralParsing() {
    Log.info("Parser Test", "testing parseFunctionLiteral()");
    const input = `
        fn(x, y) { x + y; };
        fn(a, b) { b + a * a; };  
    `;

    const tests = [
        ["x", "y", "(x + y)"],
        ["a", "b", "(b + (a * a))"],
    ];

    const program = parseProgram(input);
    if (!programParsingSuccessful(program, tests.length)) {
        return { totalTests: tests.length, failedTests: tests.length };
    }

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const statement = program.statements[i];
        const expression = statement.expression;
        const expected = tests[i];
        Log.info("Parser Test", `test[${i}] expected 'fn' got '${statement.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ExpressionStatement") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'ExpressionStatement' got '${statement.constructor.name}'`
            );
            testFailed = true;
        }

        if (expression.constructor.name != "FunctionLiteral") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'FunctionLiteral' got '${expression.constructor.name}'`
            );
            testFailed = true;
        }

        if (expression.parameters[0].value != expected[0]) {
            Log.error(
                "Parser Test",
                `test[${i}] function parameter 1 not '${expected[0]}' got '${expression.parameters[0].value}'`
            );
            testFailed = true;
        }
        if (expression.parameters[1].value != expected[1]) {
            Log.error(
                "Parser Test",
                `test[${i}] function parameter 2 not '${expected[1]}' got '${expression.parameters[1].value}'`
            );
            testFailed = true;
        }

        if (expression.body.statements[0].toString() != expected[2]) {
            Log.error(
                "Parser Test",
                `test[${i}] condition operator not '${expected[2]}' got '${expression.body.statements[0].toString()}'`
            );
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testStringLiteralExpression() {
    Log.info("Parser Test", "testing testStringLiteralParsing()");
    const input = `
        "hello world";  
    `;

    const tests = ["hello world"];

    const program = parseProgram(input);
    if (!programParsingSuccessful(program, tests.length)) {
        return { totalTests: tests.length, failedTests: tests.length };
    }

    let failed = 0;
    for (let i = 0; i < tests.length; i++) {
        const statement = program.statements[i];
        const literal = statement.expression;
        const expected = tests[i];

        Log.info("Parser Test", `test[${i}] expected 'StringLiteral' got '${literal.constructor.name}'`);
        let testFailed = false;
        if (literal.constructor.name != "StringLiteral") {
            Log.error("Parser Test", `test[${i}] statement type not 'StringLiteral' got '${literal.constructor.name}'`);
            testFailed = true;
        }
        if (!literal?.value || literal.value !== expected) {
            Log.error("Parser Test", `test[${i}] literal not '${expected}' got '${literal.value}'`);
            testFailed = true;
        }

        if (testFailed) failed++;
    }

    return { totalTests: tests.length, failedTests: failed };
}

function testCallExpressionParsing() {
    Log.info("Parser Test", "testing parseCallArguments()");
    const input = `
        add(1, 2 * 3, 4 + 5);
        add(x, y + z, z * 2);  
    `;

    const tests = [
        ["add", 1, "(2 * 3)", "(4 + 5)"],
        ["add", "x", "(y + z)", "(z * 2)"],
    ];
    let failed = 0;

    const tokenizer = new Tokenizer(input);
    const parser = new Parser(tokenizer);

    const program = parser.parse();
    if (!program) {
        Log.error("Parser Test", "program parsing failed!");
        return { totalTests: tests.length, failed: tests.length };
    }
    if (program.statements.length != tests.length) {
        Log.error("Parser Test", "program does not contain the correct number of statements!");
        return { totalTests: tests.length, failed: tests.length };
    }

    for (let i = 0; i < tests.length; i++) {
        const statement = program.statements[i];
        const expression = statement.expression;
        const expected = tests[i];
        Log.info("Parser Test", `test[${i}] expected 'add' got '${statement.token.literal}'`);

        let testFailed = false;
        if (statement.constructor.name != "ExpressionStatement") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'ExpressionStatement' got '${statement.constructor.name}'`
            );
            testFailed = true;
        }

        if (expression.constructor.name != "CallExpression") {
            Log.error(
                "Parser Test",
                `test[${i}] statement type not 'CallExpression' got '${expression.constructor.name}'`
            );
            testFailed = true;
        }

        if (expression.arguments[0].toString() != expected[1]) {
            Log.error(
                "Parser Test",
                `test[${i}] call argument 1 not '${expected[1]}' got '${expression.arguments[0]}'`
            );
            testFailed = true;
        }
        if (expression.arguments[1].toString() != expected[2]) {
            Log.error(
                "Parser Test",
                `test[${i}] call argument 2 not '${expected[2]}' got '${expression.arguments[1]}'`
            );
            testFailed = true;
        }
        if (expression.arguments[2].toString() != expected[3]) {
            Log.error(
                "Parser Test",
                `test[${i}] call argument 3 not '${expected[3]}' got '${expression.arguments[2]}'`
            );
            testFailed = true;
        }
        if (testFailed) failed++;
    }
    return { totalTests: tests.length, failedTests: failed };
}

function testArrayLiteralParsing() {
    Log.info("Parser Test", "testing testArrayLiteralParsing()");
    const input = `
        [1, 2 * 2, 3 + 3];  
    `;

    const program = parseProgram(input);
    if (!programParsingSuccessful(program)) {
        return { totalTests: 1, failedTests: tests.length };
    }

    const statement = program.statements[0];
    const array = statement.expression;
    let failed = false;
    if (array.constructor.name != "ArrayLiteral") {
        Log.error("Parser Test", `expression not ArrayLiteral. got=${array.constructor.name}`);
        failed = true;
    } else if (array.elements.length != 3) {
        Log.error("Parser Test", `length of elements not 3, got=${array.elements.length}`);
        failed = true;
    } else {
        if (!testIntegerLiteral(0, array.elements[0], 1)) failed = true;
        if (!testInfixExpression(0, array.elements[1], 2, "*", 2)) failed = true;
        if (!testInfixExpression(0, array.elements[2], 3, "+", 3)) failed = true;
    }
    failed = failed ? 1 : 0;
    return { totalTests: 1, failedTests: failed };
}

function testIndexExpressionParsing() {
    Log.info("Parser Test", "testing testIndexExpressionParsing()");
    const input = `
        myArray[1 + 1];  
    `;

    const program = parseProgram(input);
    if (!programParsingSuccessful(program)) {
        return { totalTests: 1, failedTests: tests.length };
    }

    const statement = program.statements[0];
    const indexExpression = statement.expression;
    let failed = false;
    if (indexExpression.constructor.name !== "IndexExpression") {
        Log.error("Parser Test", `expression not IndexExpression, got=${indexExpression.constructor.name}`);
        failed = true;
    }
    if (!testIdentifier(0, indexExpression.left, "myArray")) failed = true;
    if (!testInfixExpression(0, indexExpression.index, 1, "+", 1)) failed = true;

    failed = failed ? 1 : 0;
    return { totalTests: 1, failedTests: failed };
}

function testIdentifier(testNum, identifier, expected) {
    let valid = true;
    if (!identifier) {
        Log.error("Parse Test", `test[${testNum}] identifier is undefined`);
        return false;
    }
    if (identifier.constructor.name !== "Identifier") {
        Log.error("Parser Test", `test[${testNum}] expected Identifier, got=${identifier.constructor.name}`);
        valid = false;
    }
    if (identifier.value !== expected) {
        Log.error("Parser Test", `test[${testNum}] wrong identifier, expected=${expected}, got=${identifier.value}`);
        valid = false;
    }
    return valid;
}

function testIntegerLiteral(testNum, literal, expected) {
    let valid = true;
    if (!literal) {
        Log.error("Parse Test", `test[${testNum}] literal is undefined`);
        return false;
    }
    if (literal.constructor.name !== "IntegerLiteral") {
        Log.error("Parser Test", `test${testNum} expected IntegerLiteral, got ${expression.constructor.name}`);
        valid = false;
    }
    if (literal.value !== expected) {
        Log.error("Parser Test", `test${testNum} expected value ${expected}, got ${expression.value}`);
        valid = false;
    }
    return valid;
}

function testInfixExpression(testNum, expression, left, operator, right) {
    let valid = true;
    if (!expression) {
        Log.error("Parse Test", `test[${testNum}] expression is undefined`);
        return false;
    }
    if (expression.constructor.name !== "InfixExpression") {
        Log.error("Parser Test", `test${testNum} expected InfixExpression, got ${expression.constructor.name}`);
        valid = false;
    }
    if (expression.left.value !== left) {
        Log.error("Parser Test", `test${testNum} expected left value to be ${left}, got ${expression.left.value}`);
        valid = false;
    }
    if (expression.operator !== operator) {
        Log.error("Parser Test", `test${testNum} expected operator to be ${operator}, got ${expression.operator}`);
        valid = false;
    }
    if (expression.right.value !== right) {
        Log.error("Parser Test", `test${testNum} expected right value to be ${right}, got ${expression.right.value}`);
        valid = false;
    }
    return valid;
}

function parseProgram(input) {
    const tokenizer = new Tokenizer(input);
    const parser = new Parser(tokenizer);
    const program = parser.parse();
    program["errors"] = parser.getErrors();
    return program;
}

function programParsingSuccessful(program, testCount = 0) {
    if (!program) {
        Log.error("Parser Test", "program parsing failed!");
        return false;
    }
    if (program.errors.length > 0) {
        Log.error("Parser Test", "program parsing resulted in errors.");
        for (const error of program.errors) {
            Log.error("Parser Test", error);
        }
        return false;
    }
    if (testCount && program.statements.length != testCount) {
        Log.error("Parser Test", "program does not contain the correct number of statements!");
        return false;
    }
    return true;
}

export {
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
};
