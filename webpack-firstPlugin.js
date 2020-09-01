const path = require("path");
const fs = require("fs");
class firstPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      console.log("i am first plugin");
      // console.log(compilation)
      const writerStream = fs.createWriteStream("output.txt");
      writerStream.write(JSON.stringify(compilation.assets), "utf-8");
      writerStream.end();
      writerStream.on("error", function (err) {
        console.log(err.stack);
      });
      let str = "";
      for (let filename in compilation.assets) {
        str += `文件:${filename}  大小${compilation.assets[filename][
          "size"
        ]()}\n`;
      }
      // 通过compilation.assets可以获取打包后静态资源信息，同样也可以写入资源
      compilation.assets["fileSize.md"] = {
        source: function () {
          return str;
        },
        size: function () {
          return str.length;
        },
      };
      callback();
    });
  }
}
module.exports = firstPlugin;
