import * as Object from "./object.js";

class Evaluator {
    TRUE = new Object.Boolean(true);
    FALSE = new Object.Boolean(false);
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
                console.log("unrecognized node type: ", nodeType);
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

    boolNodeToBoolObject(value) {
        if (value) {
            return node.value === "true" ? this.TRUE : this.FALSE;
        } else return this.NULL;
    }
}

export { Evaluator };
