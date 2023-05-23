import { AST } from "./ast.js";

class Parser {
    tokenizer;
    constructor(tokenizer) {
        this.tokenizer = tokenizer;
    }

    parse() {
        const program = new AST();
        return program;
    }
}

export { Parser };
