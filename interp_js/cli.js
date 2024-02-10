import { readFile } from "fs";
import * as readline from "readline";

import { Tokenizer } from "./tokenizer.js";
import { Parser } from "./parser.js";
import { Evaluator } from "./evaluator.js";
import { Environment } from "./environment.js";

import { Log } from "./logger.js";

console.log("\n**************************************************************************");
console.log("***                                                                    ***");
console.log("***                        Monkeyscript REPL JS                        ***");
console.log("***                                                                    ***");
console.log("**************************************************************************");

const inputFile = process.argv[2];
const args = process.argv.slice(3);

class Monkey {
    constructor(inputFile, args) {
        this.environment = new Environment();
        this.reader = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        this.loading = false;
        if (inputFile) {
            this.loading = true;
            this.loadFile(inputFile, args);
        }

        if (!this.loading) {
            this.loop();
        }
    }

    loop() {
        this.reader.question(`\nMonkey$ `, (command) => {
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
                break;
            case "clear":
                this.clear();
                break;
            default:
                if (command.length > 0) {
                    command = command.split("~");
                    const input = command[0].trim();
                    const args = command.slice(1);
                    this.doTheMonkey(input, args);
                } else {
                    console.log("enter a valid monkeyscript string");
                    console.log("something like 'let a = 10'");
                }
        }
        this.loop();
    }

    loadFile(path, args) {
        Log.info(this.constructor.name, `loading: ${path}`);
        this.loading = true;
        readFile(path, "utf8", (err, data) => {
            if (err) {
                Log.error(this.constructor.name, `can't read file ${path} ${err}`);
            } else {
                this.doTheMonkey(data, args);
            }
            this.loading = false;
        });
    }

    clear() {
        this.environment.clear();
    }

    doTheMonkey(inputString, args) {
        const tokenizer = new Tokenizer(inputString);
        const parser = new Parser(tokenizer);
        const program = parser.parse();
        const pErrors = parser.getErrors();
        if (pErrors.length > 0) {
            for (const error of pErrors) {
                Log.error("Parser", error);
            }
        } else {
            if (args.find((a) => a.trim() === "p")) {
                Log.info("Parser", `program string: ${program.toString()}`);
            }
            const evaluator = new Evaluator();
            const evaluation = evaluator.eval(program, this.environment);
            if (args.find((a) => a.trim() === "e")) {
                Log.info("Evaluator", evaluation);
                console.log("evaluation: ", evaluation);
            }
            if (evaluation) {
                if (evaluation.value) {
                    console.log(evaluation.value);
                } else {
                    console.log(evaluation.toString());
                }
            }
        }
    }
}

new Monkey(inputFile, args);
