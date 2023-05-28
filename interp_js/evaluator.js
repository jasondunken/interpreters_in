import { ObjectType, Integer, Boolean, Null } from "./object.js";

import { Log } from "./logger.js";

class Evaluator {
    TRUE = new Boolean("true");
    FALSE = new Boolean("false");
    NULL = new Null();

    NODE_TYPE = {
        Program: "Program",
        LetStatement: "LetStatement",
        ReturnStatement: "ReturnStatement",
        ExpressionStatement: "ExpressionStatement",
        BlockStatement: "BlockStatement",
        Identifier: "Identifier",
        FunctionLiteral: "FunctionLiteral",
        IntegerLiteral: "IntegerLiteral",
        Boolean: "Boolean",
        IfExpression: "IfExpression",
        CallExpression: "CallExpression",
        PrefixExpression: "PrefixExpression",
        InfixExpression: "InfixExpression",
    };

    eval(node) {
        const nodeType = node.constructor.name;
        switch (nodeType) {
            case this.NODE_TYPE.Program:
                return this.evalStatements(node.statements);
            case this.NODE_TYPE.ExpressionStatement:
                return this.eval(node.expression);
            case this.NODE_TYPE.IntegerLiteral:
                return new Integer(node.value);
            case this.NODE_TYPE.Boolean:
                return this.boolNodeToBoolObject(node.value);
            case this.NODE_TYPE.PrefixExpression:
                return this.evalPrefixExpression(node.operator, this.eval(node.right));
            case this.NODE_TYPE.InfixExpression:
                const right = this.eval(node.right);
                const left = this.eval(node.left);
                return this.evalInfixExpression(node.operator, left, right);
            case this.NODE_TYPE.IfExpression:
                return this.evalIfExpression(node);
            case this.NODE_TYPE.BlockStatement:
                return this.evalStatements(node.statements);
            case this.NODE_TYPE.FunctionLiteral:
                console.log("intLit: ", nodeType);
                break;
            default:
                Log.error(this.constructor.name, `unrecognized node type: ${nodeType}`);
                return this.NULL;
        }
    }

    evalStatements(statements) {
        let result; // Object
        for (let statement of statements) {
            result = this.eval(statement);
        }
        return result;
    }

    evalPrefixExpression(operator, right) {
        switch (operator) {
            case "!":
                return this.evalBangOperatorExpression(right);
            case "-":
                return this.evalMinusPrefixOperatorExpression(right);
            default:
                return this.NULL;
        }
    }

    evalInfixExpression(operator, left, right) {
        if (left.type() === ObjectType.INTEGER_OBJ && right.type() === ObjectType.INTEGER_OBJ) {
            return this.evalIntegerInfixExpression(operator, left, right);
        }
        switch (operator) {
            case "==":
                return this.boolNodeToBoolObject(left.value == right.value);
            case "!=":
                return this.boolNodeToBoolObject(left.value != right.value);
            default:
                return this.NULL;
        }
    }

    evalIntegerInfixExpression(operator, left, right) {
        switch (operator) {
            case "+":
                return new Integer(left.value + right.value);
            case "-":
                return new Integer(left.value - right.value);
            case "*":
                return new Integer(left.value * right.value);
            case "/":
                return new Integer(Math.floor(left.value / right.value));
            case "<":
                return this.boolNodeToBoolObject(left.value < right.value);
            case ">":
                return this.boolNodeToBoolObject(left.value > right.value);
            case "==":
                return this.boolNodeToBoolObject(left.value == right.value);
            case "!=":
                return this.boolNodeToBoolObject(left.value != right.value);
            default:
                return this.NULL;
        }
    }

    evalIfExpression(expression) {
        const condition = this.eval(expression.condition);
        if (this.isTruthy(condition)) {
            return this.eval(expression.consequence);
        } else if (expression.alternative) {
            return this.eval(expression.alternative);
        }
        return this.NULL;
    }

    isTruthy(condition) {
        switch (condition.value) {
            case "null":
                return false;
            case "true":
                return true;
            case "false":
                return false;
            default:
                return true;
        }
    }

    evalBangOperatorExpression(right) {
        switch (right.value) {
            case "true":
                return this.FALSE;
            case "false":
                return this.TRUE;
            case "null":
                return this.TRUE;
            default:
                return this.FALSE;
        }
    }

    evalMinusPrefixOperatorExpression(right) {
        if (right.type() != ObjectType.INTEGER_OBJ) return this.NULL;
        const value = right.value;
        return new Integer(-value);
    }

    boolNodeToBoolObject(value) {
        return value ? this.TRUE : this.FALSE;
    }
}

export { Evaluator };
