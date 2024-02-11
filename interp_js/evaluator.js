import { NODE_TYPE } from "./ast.js";
import {
    ObjectType,
    IntegerObj,
    ReturnValueObj,
    ErrorObj,
    FunctionObj,
    StringObj,
    ArrayObj,
    TRUE,
    FALSE,
    NULL,
} from "./object.js";
import { builtins } from "./builtins.js";

import { Log } from "./logger.js";
import { Environment } from "./environment.js";

class Evaluator {
    eval(node, env) {
        const nodeType = node.constructor.name;
        // this.inspectNode(node);
        // console.log("eval ", nodeType);
        switch (nodeType) {
            case NODE_TYPE.Program:
                return this.evalProgram(node.statements, env);
            case NODE_TYPE.ExpressionStatement:
                return this.eval(node.expression, env);
            case NODE_TYPE.IntegerLiteral:
                return new IntegerObj(node.value);
            case NODE_TYPE.Boolean:
                return this.boolNodeToBoolObject(node.value);
            case NODE_TYPE.StringLiteral:
                return new StringObj(node.value);
            case NODE_TYPE.PrefixExpression:
                const pRight = this.eval(node.right, env);
                if (this.isError(pRight)) {
                    return pRight;
                }
                return this.evalPrefixExpression(node.operator, pRight, env);
            case NODE_TYPE.InfixExpression:
                const right = this.eval(node.right, env);
                if (this.isError(right)) {
                    return right;
                }
                const left = this.eval(node.left, env);
                if (this.isError(left)) {
                    return left;
                }
                return this.evalInfixExpression(node.operator, left, right, env);
            case NODE_TYPE.IndexExpression:
                const eLeft = this.eval(node.left, env);
                if (this.isError(eLeft)) {
                    return eLeft;
                }
                const index = this.eval(node.index, env);
                if (this.isError(index)) {
                    return index;
                }
                return this.evalIndexExpression(eLeft, index);
            case NODE_TYPE.IfExpression:
                return this.evalIfExpression(node, env);
            case NODE_TYPE.BlockStatement:
                return this.evalBlockStatement(node, env);
            case NODE_TYPE.FunctionLiteral:
                const params = node.parameters;
                const body = node.body;
                return new FunctionObj(params, body, env);
            case NODE_TYPE.CallExpression:
                const func = this.eval(node.func, env);
                if (this.isError(func)) {
                    return func;
                }
                const args = this.evalExpressions(node.arguments, env);
                if (args.length == 1 && this.isError(args[0])) {
                    return args[0];
                }
                return this.applyFunction(func, args);
            case NODE_TYPE.ArrayLiteral:
                const elements = this.evalExpressions(node.elements, env);
                if (elements.length == 1 && this.isError(elements[0])) {
                    return elements[0];
                }
                return new ArrayObj(elements);
            case NODE_TYPE.ReturnStatement:
                const returnVal = this.eval(node.returnValue, env);
                if (this.isError(returnVal)) {
                    return returnVal;
                }
                return new ReturnValueObj(returnVal);
            case NODE_TYPE.LetStatement:
                const letVal = this.eval(node.value, env);
                if (this.isError(letVal)) {
                    return letVal;
                }
                env.set(node.name.value, letVal);
                return letVal;
            case NODE_TYPE.Identifier:
                return this.evalIdentifier(node, env);
            default:
                Log.error(this.constructor.name, `unrecognized node type: ${nodeType}`);
                return NULL;
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
            return this.evalIntegerObjInfixExpression(operator, left, right, env);
        }
        if (left.type() === ObjectType.STRING_OBJ && right.type() === ObjectType.STRING_OBJ) {
            return this.evalStringInfixExpression(operator, left, right, env);
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

    evalIntegerObjInfixExpression(operator, left, right, env) {
        switch (operator) {
            case "+":
                return new IntegerObj(left.value + right.value);
            case "-":
                return new IntegerObj(left.value - right.value);
            case "*":
                return new IntegerObj(left.value * right.value);
            case "/":
                return new IntegerObj(Math.floor(left.value / right.value));
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

    evalStringInfixExpression(operator, left, right, env) {
        if (operator != "+") {
            return this.newError(`unknown operator: ${left.type()} ${operator} ${right.type()}`);
        }

        const leftVal = left.value;
        const rightVal = right.value;
        return new StringObj(`${leftVal}${rightVal}`);
    }

    evalIndexExpression(left, index) {
        if (left.type() !== ObjectType.ARRAY_OBJ && index.type() !== ObjectType.INTEGER_OBJ) {
            return this.newError(`index operator not supported: ${left.type()}`);
        }
        return this.evalArrayIndexExpression(left, index);
    }

    evalArrayIndexExpression(left, index) {
        const i = index.value;
        const max = left.elements.length - 1;
        if (i < 0 || i > max) {
            return NULL;
        }
        return left.elements[i];
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
        return NULL;
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
                return FALSE;
            case false:
                return TRUE;
            case null:
                return TRUE;
            default:
                return FALSE;
        }
    }

    evalMinusPrefixOperatorExpression(right, env) {
        if (right.type() != ObjectType.INTEGER_OBJ) {
            return this.newError(`unknown operator: -${right.type()}`);
        }
        const value = right.value;
        return new IntegerObj(-value);
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
        switch (func.type()) {
            case ObjectType.FUNCTION_OBJ:
                const extendedEnv = this.extendFunctionEnv(func, args);
                const evaluated = this.eval(func.body, extendedEnv);
                return this.unwrapReturnValue(evaluated);
            case ObjectType.BUILTIN_OBJ:
                return func.fn(args);
            default:
                return this.newError(`not a function ${func.type()}`);
        }
    }

    extendFunctionEnv(func, args) {
        const env = Environment.newEnclosedEnvironment(func.env);
        for (let i = 0; i < func.parameters.length; i++) {
            const param = func.parameters[i];
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
        return value ? TRUE : FALSE;
    }

    evalIdentifier(node, env) {
        const val = env.get(node.value);
        if (val) {
            return val;
        }
        if (builtins[node.value]) {
            return builtins[node.value];
        }
        return this.newError(`identifier not found: ${node.value}`);
    }

    newError(message) {
        return new ErrorObj(message);
    }

    isError(obj) {
        if (obj != null) {
            return obj.type() == ObjectType.ERROR_OBJ;
        }
        return false;
    }

    inspectNode(node, env) {
        console.log("\ninspect node ---------------------------------------------------------");
        console.log("node:");
        console.log(node);
        if (node.func) {
            console.log("func:");
            console.log(node.func);
        }
        console.log("env:");
        console.log(env);
        console.log("end inspect ----------------------------------------------------------\n");
    }
}

export { Evaluator };
