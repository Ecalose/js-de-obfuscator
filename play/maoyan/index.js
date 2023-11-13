const { Deob } = require('@deob/utils')
const fs = require('fs/promises')

class MyDeOb extends Deob {}

;(async function () {
  const fileName = 'code'

  let rawCode = await fs.readFile(__dirname + `/${fileName}.js`, {
    encoding: 'utf-8',
  })

  let deob = new MyDeOb(rawCode, {
    dir: __dirname,
    isWriteFile: true,
  })

  await deob.prettierCode()

  deob.splitMultipleDeclarations()

  deob.findDecryptFnByCallCount(1000, true)
  await deob.record(fileName, 1)

  deob.saveAllObject()
  deob.objectMemberReplace()
  await deob.record(fileName, 2)

  deob.switchFlat()
  deob.switchFlat()
  await deob.record(fileName, 3)

  // 平坦化之后可在执行一次
  deob.saveAllObject()
  deob.objectMemberReplace()
  await deob.record(fileName, '3_3')

  // 最后通用处理
  deob.calcBinary()
  deob.calcBoolean()
  deob.constantReplace()
  deob.reParse()
  await deob.record(fileName, 4)

  // deob.removeUnusedBlock()
  // // deob.removeUnusedVariables()
  // // deob.selfCallFnReplace()

  // // 优化
  // // deob.changeObjectAccessMode()
  // deob.deleteExtra()
  // deob.addComments()

  let code = deob.getCode()
  await fs.writeFile(__dirname + '/output.js', code)
})()
