///<reference path='Scripts/typings/node/node.d.ts'/>
///<reference path='Scripts/typings/cheerio/cheerio.d.ts'/>
///<reference path='todo.ts'/>
///<reference path='StringUtils.ts'/>
///<reference path='FileSystemActions.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var fs = require('fs');
var path = require('path');
var compressor = require('node-minify');
var cheerio = require('cheerio');
var todo;
(function (todo) {
    var NodeJSImplementations;
    (function (NodeJSImplementations) {
        var su = todo.StringUtils;
        ;
        var NodeJSFileManager = (function () {
            function NodeJSFileManager() {
            }
            NodeJSFileManager.prototype.readTextFileSync = function (filePath) {
                var data = fs.readFileSync(filePath, { encoding: 'utf8' });
                return data;
            };
            NodeJSFileManager.prototype.readTextFileAsync = function (filePath, callback) {
                fs.readFile(filePath, { encoding: 'utf8' }, callback);
            };
            NodeJSFileManager.prototype.resolve = function () {
                var pathSegments = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    pathSegments[_i - 0] = arguments[_i];
                }
                return path.resolve.apply(this, pathSegments);
            };
            NodeJSFileManager.prototype.listDirectorySync = function (dirPath) {
                return fs.readdirSync(dirPath);
            };
            NodeJSFileManager.prototype.getExecutingScriptFilePath = function () {
                var pathOfScript = process.argv[1];
                return pathOfScript;
            };
            NodeJSFileManager.prototype.getSeparator = function () {
                return path.sep;
            };
            NodeJSFileManager.prototype.writeTextFileSync = function (filePath, content) {
                fs.writeFileSync(filePath, content, { encoding: 'utf8' });
            };
            NodeJSFileManager.prototype.getWorkingDirectoryPath = function () {
                return process.cwd();
            };
            NodeJSFileManager.prototype.doesFilePathExist = function (sPath) {
                return fs.exists(sPath);
            };
            return NodeJSFileManager;
        })();
        NodeJSImplementations.NodeJSFileManager = NodeJSFileManager;
        var NodeJSWebFileManager = (function (_super) {
            __extends(NodeJSWebFileManager, _super);
            function NodeJSWebFileManager() {
                _super.apply(this, arguments);
            }
            NodeJSWebFileManager.prototype.loadHTML = function (html) {
                var $ = cheerio.load(html);
                var $any = $;
                return $any;
            };
            NodeJSWebFileManager.prototype.minify = function (filePath, callback) {
                var destPath = su.replaceEndWith(filePath, '.js', '.min.js');
                new compressor.minify({
                    type: 'uglifyjs',
                    fileIn: filePath,
                    fileOut: destPath,
                    callback: callback,
                });
            };
            return NodeJSWebFileManager;
        })(NodeJSFileManager);
        NodeJSImplementations.NodeJSWebFileManager = NodeJSWebFileManager;
        var NodeJSProcessManager = (function () {
            function NodeJSProcessManager() {
            }
            NodeJSProcessManager.prototype.WaitForUserInputAndExit = function (message, testForExit) {
                var stdin = process['openStdin']();
                process.stdin['setRawMode']();
                console.log(message);
                stdin.on('keypress', function (chunk, key) {
                    process.stdout.write('Get Chunk: ' + chunk + '\n');
                    if (testForExit(chunk, key))
                        process.exit();
                });
            };
            return NodeJSProcessManager;
        })();
        NodeJSImplementations.NodeJSProcessManager = NodeJSProcessManager;
    })(NodeJSImplementations = todo.NodeJSImplementations || (todo.NodeJSImplementations = {}));
})(todo || (todo = {}));
(function (__global) {
    var modInfo = {
        name: 'todo',
        mod: todo,
    };
    if (typeof __global[modInfo.name] !== "undefined") {
        if (__global[modInfo.name] !== modInfo.mod) {
            for (var p in modInfo.mod) {
                __global[modInfo.name][p] = modInfo.mod[p];
            }
        }
    }
    else {
        __global[modInfo.name] = modInfo.mod;
    }
})(typeof window !== "undefined" ? window :
    typeof WorkerGlobalScope !== "undefined" ? self :
        typeof global !== "undefined" ? global :
            Function("return this;")());
//# sourceMappingURL=NodeJSImplementations.js.map