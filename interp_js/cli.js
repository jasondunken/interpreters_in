import { Tokenizer } from "./tokenizer.js";
import { Parser } from "./parser.js";

import * as fs from "fs";
import * as readline from "readline";

console.log("***                                                                   ***");
console.log("***                    Monkeyscript Interpreter_JS                    ***");
console.log("***                                                                   ***");
const inputFile = process.argv[2];
const args = process.argv.slice(3);

class Monkey {
    constructor(inputFile, args) {
        this.reader = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        if (inputFile) {
            this.loadFile(inputFile, args);
        }

        if (!this.loading) {
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
            case "exit":
                this.reader.close();
                return;
            case "load":
                this.loadFile(cmd[1], cmd.slice(2));
                return;
            default:
                if (command.length > 0) {
                    this.doTheMonkey(command);
                }
        }
    }

    loadFile(path, args) {
        console.log("loading: ", path);
        this.loading = true;
        fs.readFile(path, "utf8", (err, data) => {
            if (err) {
                console.error("FILE READ ERROR====>>>> ", err);
            } else {
                this.doTheMonkey(data, args);
            }
            this.loading = false;
            this.loop();
        });
    }

    doTheMonkey(inputString, args) {
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
