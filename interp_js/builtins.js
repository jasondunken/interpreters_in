import { ObjectType, IntegerObj, ErrorObj, BuiltinFnObj, NULL } from "./object.js";

const builtins = {
    len: new BuiltinFnObj((args) => {
        if (args.length != 1) {
            return new ErrorObj(`wrong number of arguments. got=${args.length}, want=1`);
        }
        switch (args[0].type()) {
            case ObjectType.STRING_OBJ:
                return new IntegerObj(args[0].value.length);
            case ObjectType.ARRAY_OBJ:
                return new IntegerObj(args[0].elements.length);
            default:
                return new ErrorObj(`argument to 'len' not supported, got ${args[0].type()}`);
        }
    }),
    first: new BuiltinFnObj((args) => {
        if (args.length != 1) {
            return new ErrorObj(`wrong number of arguments. got=${args.length}, want=1`);
        }
        if (args[0].type() != ObjectType.ARRAY_OBJ) {
            return new ErrorObj(`argument to 'first' ust be an ARRAY, got ${orgs[0].type()}`);
        }
        if (args[0].elements.length > 0) {
            return args[0].elements[0];
        }
        return NULL;
    }),
    last: new BuiltinFnObj((args) => {
        if (args.length != 1) {
            return new ErrorObj(`wrong number of arguments. got=${args.length}, want=1`);
        }
        if (args[0].type() != ObjectType.ARRAY_OBJ) {
            return new ErrorObj(`argument to 'first' ust be an ARRAY, got ${orgs[0].type()}`);
        }
        if (args[0].elements.length > 0) {
            return args[0].elements[args[0].elements.length - 1];
        }
        return NULL;
    }),
};

export { builtins };
