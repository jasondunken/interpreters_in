import { ObjectType, Integer, Boolean, ReturnValue, Null, Error, FunctionObj } from "./object.js";

import { Log } from "./logger.js";
import { Environment } from "./environment.js";

class Evaluator {
    TRUE = new Boolean(true);
    FALSE = new Boolean(false);
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

    eval(node, env) {
        const nodeType = node.constructor.name;
        switch (nodeType) {
            case this.NODE_TYPE.Program:
                return this.evalProgram(node.statements, env);
            case this.NODE_TYPE.ExpressionStatement:
                return this.eval(node.expression, env);
            case this.NODE_TYPE.IntegerLiteral:
                return new Integer(node.value);
            case this.NODE_TYPE.Boolean:
                return this.boolNodeToBoolObject(node.value);
            case this.NODE_TYPE.PrefixExpression:
                const pRight = this.eval(node.right, env);
                if (this.isError(pRight)) {
                    return pRight;
                }
                return this.evalPrefixExpression(node.operator, pRight, env);
            case this.NODE_TYPE.InfixExpression:
                const right = this.eval(node.right, env);
                if (this.isError(right)) {
                    return right;
                }
                const left = this.eval(node.left, env);
                if (this.isError(left)) {
                    return left;
                }
                return this.evalInfixExpression(node.operator, left, right, env);
            case this.NODE_TYPE.IfExpression:
                return this.evalIfExpression(node, env);
            case this.NODE_TYPE.BlockStatement:
                return this.evalBlockStatement(node, env);
            case this.NODE_TYPE.FunctionLiteral:
                const params = node.parameters;
                const body = node.body;
                return new FunctionObj(params, body, env);
            case this.NODE_TYPE.CallExpression:
                const func = this.eval(node.func, env);
                if (this.isError(func)) {
                    return func;
                }
                const args = this.evalExpressions(node.arguments, env);
                if (args.length == 1 && this.isError(args[0])) {
                    return args[0];
                }
                return this.applyFunction(func, args);
            case this.NODE_TYPE.ReturnStatement:
                const returnVal = this.eval(node.returnValue, env);
                if (this.isError(returnVal)) {
                    return returnVal;
                }
                return new ReturnValue(returnVal);
            case this.NODE_TYPE.LetStatement:
                const letVal = this.eval(node.value, env);
                if (this.isError(letVal)) {
                    return letVal;
                }
                env.set(node.name.value, letVal);
                return letVal;
            case this.NODE_TYPE.Identifier:
                return this.evalIdentifier(node, env);
            default:
                Log.error(this.constructor.name, `unrecognized node type: ${nodeType}`);
                return this.NULL;
        }
    }

    evalProgram(statements, env) {
        let result; // Object
        for (let statement of statements) {
            result = this.eval(statement, env);

            switch (result.type()) {
                case ObjectType.RETURN_VALUE_OBJ:
                    return result.returnValue;
                case ObjectType.ERROR_OBJ:
                    return result;
            }
        }
        return result;
    }

    evalBlockStatement(node, env) {
        let result;

        for (let statement of node.statements) {
            result = this.eval(statement, env);

            if (result != null) {
                const rType = result.type();
                if (rType == ObjectType.RETURN_VALUE_OBJ || rType == ObjectType.ERROR_OBJ) {
                    return result;
                }
            }
        }
        return result;
    }

    evalPrefixExpression(operator, right, env) {
        switch (operator) {
            case "!":
                return this.evalBangOperatorExpression(right, env);
            case "-":
                return this.evalMinusPrefixOperatorExpression(right, env);
            default:
                return this.newError(`unknown operator: ${operator}${right.type()}`);
        }
    }

    evalInfixExpression(operator, left, right, env) {
        if (left.type() === ObjectType.INTEGER_OBJ && right.type() === ObjectType.INTEGER_OBJ) {
            return this.evalIntegerInfixExpression(operator, left, right, env);
        }
        if (left.type() != right.type()) {
            return this.newError(`type mismatch: ${left.type()} ${operator} ${right.type()}`);
        }
        switch (operator) {
            case "==":
                return this.boolNodeToBoolObject(left.value == right.value);
            case "!=":
                return this.boolNodeToBoolObject(left.value != right.value);
            default:
                return this.newError(`unknown operator: ${left.type()} ${operator} ${right.type()}`);
        }
    }

    evalIntegerInfixExpression(operator, left, right, env) {
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
                return this.newError(`unknown operator: ${left.type()} ${operator} ${right.type()}`);
        }
    }

    evalIfExpression(expression, env) {
        const condition = this.eval(expression.condition, env);
        if (this.isError(condition)) {
            return condition;
        }
        if (this.isTruthy(condition)) {
            return this.eval(expression.consequence, env);
        } else if (expression.alternative) {
            return this.eval(expression.alternative, env);
        }
        return this.NULL;
    }

    isTruthy(condition) {
        switch (condition.value) {
            case null:
                return false;
            case true:
                return true;
            case false:
                return false;
            default:
                return true;
        }
    }

    evalBangOperatorExpression(right, env) {
        switch (right.value) {
            case true:
                return this.FALSE;
            case false:
                return this.TRUE;
            case null:
                return this.TRUE;
            default:
                return this.FALSE;
        }
    }

    evalMinusPrefixOperatorExpression(right, env) {
        if (right.type() != ObjectType.INTEGER_OBJ) {
            return this.newError(`unknown operator: -${right.type()}`);
        }
        const value = right.value;
        return new Integer(-value);
    }

    evalExpressions(exps, env) {
        const result = [];
        for (const exp of exps) {
            const evaluated = this.eval(exp, env);
            if (this.isError(evaluated)) {
                return [evaluated];
            }
            result.push(evaluated);
        }
        return result;
    }

    applyFunction(func, args) {
        if (func.type() !== ObjectType.FUNCTION_OBJ) {
            return this.newError(`not a function ${func.type()}`);
        }

        const extendedEnv = this.extendFunctionEnv(func, args);
        console.log("applyFunction, eEnv: ", extendedEnv);
        const evaluated = this.eval(func.body, extendedEnv);
        return this.unwrapReturnValue(evaluated);
    }

    extendFunctionEnv(func, args) {
        console.log("extendEnv, args: ", args);
        const env = Environment.newEnclosedEnvironment(func.env);
        for (let i = 0; i < args.length; i++) {
            const param = args[i];
            env.set(param.value, args[i]);
        }
        return env;
    }

    unwrapReturnValue(obj) {
        if (obj.type() === ObjectType.RETURN_VALUE_OBJ) {
            return obj.returnValue;
        }
        return obj;
    }

    boolNodeToBoolObject(value) {
        return value ? this.TRUE : this.FALSE;
    }

    evalIdentifier(node, env) {
        const val = env.get(node.value);
        if (!val) {
            return this.newError(`identifier not found: ${node.value}`);
        }
        return val;
    }

    newError(message) {
        return new Error(message);
    }

    isError(obj) {
        if (obj != null) {
            return obj.type() == ObjectType.ERROR_OBJ;
        }
        return false;
    }
}

export { Evaluator };
