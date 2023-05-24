import { Tokenizer } from "./tokenizer.js";
import { Parser } from "./parser.js";

import * as fs from "fs";
import * as readline from "readline";

console.log("***                                                                  ***");
console.log("***                    Monkey Code Interpreter_JS                    ***");
console.log("***                                                                  ***");
const inputFile = process.argv[2];
const args = process.argv.slice(3);

class Monkey {
    constructor(inputFile, args) {
        this.reader = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        if (inputFile) {
            this.loadingFile = true;
            this.loadFile(inputFile);
        }

        if (!this.loadingFIle) {
            this.loop();
        }
    }

    loop() {
        this.reader.question(`Monkey$ `, (command) => {
            this.handleCommand(command);
        });
    }

    handleCommand(command) {
        const cmd = command.split(" ");
        switch (cmd[0]) {
            case "EXIT":
                this.reader.close();
                return;
            case "load":
                this.loadFile(cmd[1]);
                break;
            default:
                this.doTheMonkey(command);
        }
    }

    loadFile(path) {
        console.log("loading: ", path);
        fs.readFile(path, "utf8", (err, data) => {
            if (err) {
                console.error("ERROR====>>>> ", err);
                return;
            }
            this.loadingFile = false;
            this.doTheMonkey(data);
        });
    }

    doTheMonkey(inputString) {
        const tokenizer = new Tokenizer(inputString);
        //tokenizer.test();
        const parser = new Parser(tokenizer);
        const program = parser.parse();
        //console.log(program);
        console.log("p.toString: ", program.toString());
        console.log("p.errors: ", parser.getErrors());
        this.loop();
    }
}
new Monkey(inputFile, args);
