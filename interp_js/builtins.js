import { Builtin } from "./object.js";
import { ObjectType, Integer, Null, Error } from "./object.js";

const builtins = {
    len: new Builtin((args) => {
        if (args.length != 1) {
            return new Error(`wrong number of arguments. got=${args.length}, want=1`);
        }
        switch (args[0].type()) {
            case ObjectType.STRING_OBJ:
                return new Integer(args[0].value.length);
            default:
                return new Error(`argument to 'len' not supported, got ${args[0].type()}`);
        }
    }),
};

export { builtins };
