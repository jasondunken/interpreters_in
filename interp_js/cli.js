import { Tokenizer } from "./tokenizer";
import { Parser } from "./parser";
import { AST } from "./ast";

console.log("***Monkey Code Interpreter_JS***");
const inputFile = process.argv[2];
const flags = process.argv.slice(3);
