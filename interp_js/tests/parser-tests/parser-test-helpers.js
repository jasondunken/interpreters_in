import { Tokenizer } from "../../tokenizer.js";
import { Parser } from "../../parser.js";

import { Log } from "../../logger.js";

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

export { parseProgram, programParsingSuccessful, testIdentifier, testIntegerLiteral, testInfixExpression };
