import * as Object from "./object.js";
import { Log } from "./cli.js";

class Evaluator {
    TRUE = new Object.Boolean("true");
    FALSE = new Object.Boolean("false");
    NULL = new Object.Null();

    eval(node) {
        const nodeType = node.constructor.name;
        switch (nodeType) {
            case "Program":
                return this.evalStatements(node.statements);
            case "ExpressionStatement":
                return this.eval(node.expression);
            case "IntegerLiteral":
                return new Object.Integer(node.value);
            case "Boolean":
                return this.boolNodeToBoolObject(node.value);
            case "PrefixExpression":
                const right = this.eval(node.right);
                return this.evalPrefixExpression(node.operator, right);
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

    boolNodeToBoolObject(value) {
        return value ? this.TRUE : this.FALSE;
    }
}

export { Evaluator };
