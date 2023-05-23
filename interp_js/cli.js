import { Tokenizer } from "./tokenizer.js";
import { Parser } from "./parser.js";

import * as fs from "fs";

console.log("***Monkey Code Interpreter_JS***");
const inputFile = process.argv[2];
const flags = process.argv.slice(3);

console.log("loading: ", inputFile, "...");

fs.readFile(inputFile, "utf8", (err, data) => {
    if (err) {
        console.error("ERROR====>>>> ", err);
        return;
    }
    doTheMonkey(data);
});

function doTheMonkey(inputString) {
    const tokenizer = new Tokenizer(inputString);
    tokenizer.test();
    //const parser = new Parser(tokenizer);
    //const program = parser.parse();
}
