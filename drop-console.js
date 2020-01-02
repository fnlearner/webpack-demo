
const parser = require('@babel/parser')//将源码解析成ast
const traverse = require('@babel/traverse').default//对ast进行递归遍历，生成一个便于操作，转换的path对象
const generator = require('@babel/generator').default//将ast解码生成js代码
const t = require('@babel/types')//通过该模块对具体的ast节点进行增删改查
module.exports=function(source){
  const ast = parser.parse(source,{ sourceType: 'module'})
  traverse(ast,{
    CallExpression(path){ 
      if(t.isMemberExpression(path.node.callee) && t.isIdentifier(path.node.callee.object, {name: "console"})){
        path.remove()
      }
    }
  })
  const output = generator(ast, {}, source);
  return output.code
}