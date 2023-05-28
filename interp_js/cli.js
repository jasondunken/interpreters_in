import { Tokenizer } from "./tokenizer.js";
import { Parser } from "./parser.js";
import { Evaluator } from "./evaluator.js";

import * as fs from "fs";
import * as readline from "readline";

console.log("\n**************************************************************************");
console.log("***                                                                    ***");
console.log("***                        Monkeyscript REPL JS                        ***");
console.log("***                                                                    ***");
console.log("**************************************************************************");

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
                return;
            default:
                if (command.length > 0) {
                    command = command.trim();
                    this.doTheMonkey(command);
                } else {
                    console.log("enter a valid monkeyscript string");
                    console.log("something like 'let a = 10'");
                }
        }
    }

    loadFile(path, args) {
        Log.LogInfo(this, `loading: ${path}`);
        this.loading = true;
        fs.readFile(path, "utf8", (err, data) => {
            if (err) {
                Log.LogError(this, `can't read file>>>> ${err}`);
            } else {
                this.doTheMonkey(data, args);
            }
            this.loading = false;
            this.loop();
        });
    }

    doTheMonkey(inputString, args) {
        console.log("input: ", inputString);
        const tokenizer = new Tokenizer(inputString);
        //tokenizer.test();
        const parser = new Parser(tokenizer);
        const program = parser.parse();
        //console.log(program);
        const evaluator = new Evaluator();
        // console.log("p.errors: ", parser.getErrors());
        console.log("program string: ", program.toString());
        const evaluation = evaluator.eval(program);
        console.log("evaluates to: ", evaluation);
        this.loop();
    }
}

new Monkey(inputFile, args);

export class Log {
    static LogInfo(obj, string) {
        string = `${obj.constructor.name}::info::${string}`;
        console.log(string);
        Log.Update(string);
    }

    static LogError(obj, string) {
        string = `${obj.constructor.name}::error::${string}`;
        console.log(string);
        Log.Update(string);
    }

    static Update(string) {
        fs.existsSync("logs") || fs.mkdirSync("logs");
        string = `${new Date().toISOString()}_${string}\n`;
        fs.writeFile("logs/monkey-trouble.mt", string, { flag: "a+" }, (err) => {
            if (err) throw err;
        });
    }
}
