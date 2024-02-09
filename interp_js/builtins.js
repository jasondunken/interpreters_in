import { ObjectType, IntegerObj, NullObj, ErrorObj, BuiltinFnObj } from "./object.js";

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
};

export { builtins };
