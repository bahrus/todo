///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='Scripts/typings/cheerio/cheerio.d.ts'/>
///<reference path='CommonActions.ts'/>
///<reference path='StringUtils.ts'/>
///<reference path='FileSystemActions.ts'/>

const fs = require('fs');
const path = require('path');
const compressor = require('node-minify');
const cheerio = require('cheerio');

module todo.NodeJSImplementations {
    
    const su = todo.StringUtils;;

    export class NodeJSFileManager implements FileSystemActions.IFileManager {

        readTextFileSync(filePath: string) {
            const data = <any> fs.readFileSync(filePath, { encoding: 'utf8' });
            return <string> data;
        }
        readTextFileAsync(filePath: string, callback: (err: Error, data: string) => void) {
            fs.readFile(filePath, { encoding: 'utf8' }, callback);
        }
        resolve(...pathSegments: any[]) {
            return path.resolve.apply(this, pathSegments);
        }

        listDirectorySync(dirPath: string) {
            return fs.readdirSync(dirPath);
        }
        getExecutingScriptFilePath() {
            const pathOfScript = process.argv[1];
            return pathOfScript;
        }
        getSeparator() {
            return path.sep;
        }
        writeTextFileSync(filePath: string, content: string) {
            fs.writeFileSync(filePath, content, { encoding: 'utf8' });
        }
        getWorkingDirectoryPath() {
            return process.cwd();
        }
        doesFilePathExist(sPath: string) {
            return fs.exists(sPath);
        }
    }

    export class NodeJSWebFileManager extends NodeJSFileManager implements FileSystemActions.IWebFileManager {

        loadHTML(html: string) {
            const $ = cheerio.load(html);
            const $any = <any> $;
            return <JQueryStatic> $any;
        }
        minify(filePath: string, callback: (err: Error, min: string) => void) {
            const destPath = su.replaceEndWith(filePath, '.js', '.min.js');
            new compressor.minify({
                type: 'uglifyjs',
                fileIn: filePath,
                fileOut: destPath,
                callback: callback,
            });
        }

    }

    export class NodeJSProcessManager implements IProcessManager {
        WaitForUserInputAndExit(message: string, testForExit: (chunk: string, key: string) => boolean) {
            const stdin = process['openStdin']();
            process.stdin['setRawMode']();
            console.log(message);
            stdin.on('keypress', function (chunk, key) {
                process.stdout.write('Get Chunk: ' + chunk + '\n');
                if (testForExit(chunk, key)) process.exit();
            });
        }
    }
}

(function(__global: any) {
    const modInfo = {
        name: 'todo',
        mod: todo,
        //subMod: todo.CommonActions,
    }
    if (typeof __global[modInfo.name] !== "undefined") {
        if (__global[modInfo.name] !== modInfo.mod) {
            for (var p in modInfo.mod) {
                __global[modInfo.name][p] = (<any>modInfo.mod)[p];
            }
        }
    }
    else {
        __global[modInfo.name] = modInfo.mod;
    }
})(
    typeof window !== "undefined" ? window :
        typeof WorkerGlobalScope !== "undefined" ? self :
            typeof global !== "undefined" ? global :
                Function("return this;")());


