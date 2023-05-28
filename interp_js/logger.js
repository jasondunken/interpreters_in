import { writeFile, existsSync, mkdirSync } from "fs";

export class Log {
    static info(sender, message) {
        const infoTag = "info";
        let consoleString = `${sender}::${Log.EncodeColor("info", infoTag)}::${message}`;
        let logFileString = `${sender}::${infoTag}::${message}`;
        console.log(consoleString);
        Log.Update(logFileString);
    }

    static error(sender, message) {
        const errorTag = "error";
        const consoleString = `${sender}::${Log.EncodeColor("error", errorTag)}::${Log.EncodeColor("error", message)}`;
        const logFileString = `${sender}::${errorTag}::${message}`;
        console.log(consoleString);
        Log.Update(logFileString);
    }

    static testResult(sender, passed, failed) {
        const consoleMessage = `Passed: ${Log.EncodeColor("success", passed)}, Failed ${Log.EncodeColor(
            "failure",
            failed
        )}`;
        const logFileMessage = `Passed: ${passed}, Failed ${failed}`;
        const resultTag = "result";

        const consoleString = `${sender}::${Log.EncodeColor("result", resultTag)}::${consoleMessage}`;
        const logFileString = `${sender}::${resultTag}::${logFileMessage}`;
        console.log(consoleString);
        Log.Update(logFileString);
    }

    static Update(string) {
        existsSync("logs") || mkdirSync("logs");
        string = `${new Date().toISOString()}_${string}\n`;
        writeFile("logs/monkey-trouble.mt", string, { flag: "a+" }, (err) => {
            if (err) throw err;
        });
    }

    // acscii colors fg/bg
    static ASCII_COLORS = {
        Black: [0, 40],
        Red: [31, 41],
        Green: [32, 42],
        Yellow: [33, 43],
        Blue: [34, 44],
        Magenta: [35, 45],
        Cyan: [36, 46],
        White: [37, 47],
        Bright_Black: [90, 100],
        Bright_Red: [91, 101],
        Bright_Green: [92, 102],
        Bright_Yellow: [93, 103],
        Bright_Blue: [94, 104],
        Bright_Magenta: [95, 105],
        Bright_Cyan: [96, 106],
        Bright_White: [97, 107],
    };

    static EncodeColor(color, string) {
        let colorCode = Log.ASCII_COLORS.White[0];
        switch (color) {
            case "info":
                colorCode = Log.ASCII_COLORS.Yellow[0];
                break;
            case "error":
            case "failure":
                colorCode = Log.ASCII_COLORS.Red[0];
                break;
            case "success":
                colorCode = Log.ASCII_COLORS.Bright_White[0];
                break;
            case "result":
                colorCode = Log.ASCII_COLORS.Cyan[0];
                break;
        }
        return `\x1b[${colorCode}m${string}\x1b[0m`;
    }
}
