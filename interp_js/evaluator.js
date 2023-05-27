import { ObjectType, Integer, Boolean, Null } from "./object.js";
import { Log } from "./cli.js";

class Evaluator {
    TRUE = new Boolean("true");
    FALSE = new Boolean("false");
    NULL = new Null();

    eval(node) {
        const nodeType = node.constructor.name;
        switch (nodeType) {
            case "Program":
                return this.evalStatements(node.statements);
            case "ExpressionStatement":
                return this.eval(node.expression);
            case "IntegerLiteral":
                return new Integer(node.value);
            case "Boolean":
                return this.boolNodeToBoolObject(node.value);
            case "PrefixExpression":
                //const right = this.eval(node.right);
                return this.evalPrefixExpression(node.operator, this.eval(node.right));
            case "InfixExpression":
                const right = this.eval(node.right);
                const left = this.eval(node.left);
                return this.evalInfixExpression(node.operator, left, right);
            case "FunctionLiteral":
                console.log("intLit: ", nodeType);
                break;
            default:
                Log.LogError(this, `unrecognized node type: ${nodeType}`);
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
        return this.NULL;
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
        if (right.type() != "INTEGER") return this.NULL;
        const value = right.value;
        return new Integer(-value);
    }

    boolNodeToBoolObject(value) {
        return value ? this.TRUE : this.FALSE;
    }
}

export { Evaluator };
