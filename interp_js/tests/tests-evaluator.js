import { Tokenizer } from "../tokenizer.js";
import { Parser } from "../parser.js";
import { Evaluator } from "../evaluator.js";

import { Log } from "../logger.js";

function testEval(input) {
    const tokenizer = new Tokenizer(input);
    const parser = new Parser(tokenizer);
    const program = parser.parse();
    const evaluator = new Evaluator();
    return evaluator.eval(program);
}

function testEvalIntegerExpression() {}

function testIntegerExpression() {}

function testIntegerObject(obj, expected) {}

function testEvalBooleanExpression() {}

function testBooleanExpression(obj, expected) {}

function testBooleanObject(obj, expected) {}

function testBangOperator() {}

function testEvalIfElseExpressions() {}

function testNullObject(obj) {}

function testEvalReturnStatements() {}

function testErrorHandling() {}

export {
    testEvalIntegerExpression,
    testEvalBooleanExpression,
    testEvalIfElseExpressions,
    testEvalReturnStatements,
    testErrorHandling,
};
