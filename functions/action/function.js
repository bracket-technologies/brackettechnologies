const {clearValues} = require("./clearValues")
const {clone} = require("./clone")
const {getParam} = require("./getParam")
const {isArabic} = require("./isArabic")
const {isEqual} = require("./isEqual")
const {merge} = require("./merge")
const {toApproval} = require("./toApproval")
const {toId} = require("./toId")
const {toParam} = require("./toParam")
const {jsonToBracket} = require("./jsonToBracket")
const {update} = require("./update")
const {toArray} = require("./toArray")
const {generate} = require("./generate")
const {axios} = require("./axios")
const {toView} = require("./toView")
const {addEventListener} = require("./event")
const {execute} = require("./execute")
const {starter} = require("./starter")
const {setPosition} = require("./setPosition")
const {droplist} = require("./droplist")
const {filter} = require("./filter")
const {remove} = require("./remove")
const {focus} = require("./focus")
const {sort} = require("./sort")
const {search} = require("./search")
const {save} = require("./save")
const {erase} = require("./erase")
const {toValue} = require("./toValue")
const {reducer} = require("./reducer")
const {getJsonFiles} = require("./jsonFiles")
const {setData} = require("./setData")
const {defaultInputHandler} = require("./defaultInputHandler")
const {createActions} = require("./createActions")
const {blur} = require("./blur")
const {toAwait} = require("./toAwait")
const {note} = require("./note")
const {toCode} = require("./toCode")
const {isPath} = require("./isPath")
const {toNumber} = require("./toNumber")
const {capitalize} = require("./capitalize")
const {toOperator} = require("./toOperator")
const upload = require("./upload")
const {compare} = require("./compare")
const {toCSV} = require("./toCSV")
const {decode} = require("./decode")
const {route} = require("./route")
const {contentful} = require("./contentful")
const {getDateTime} = require("./getDateTime")
const {insert} = require("./insert")
const {exportJson} = require("./exportJson")
const {setCookie, getCookie} = require("./cookie")
const {getDaysInMonth} = require("./getDaysInMonth")
const {fileReader} = require("./fileReader")
const {position, getPadding} = require("./position")
const {
  setStyle,
  resetStyles,
  toggleStyles,
  mountAfterStyles,
} = require("./style")
const {resize, dimensions, lengthConverter} = require("./resize")
const {createData, clearData} = require("./data")

module.exports = {
  getDaysInMonth,
  lengthConverter,
  getCookie,
  setCookie,
  position,
  getPadding,
  route,
  decode,
  contentful,
  toCSV,
  compare,
  clearValues,
  clone,
  getJsonFiles,
  search,
  getParam,
  isArabic,
  isEqual,
  merge,
  addEventListener,
  toApproval,
  toId,
  toParam,
  fileReader,
  jsonToBracket,
  update,
  execute,
  toArray,
  generate,
  toView,
  resize,
  dimensions,
  createData,
  setData,
  clearData,
  starter,
  setPosition,
  droplist,
  filter,
  createActions,
  blur,
  toAwait,
  exportJson,
  remove,
  defaultInputHandler,
  focus,
  sort,
  save,
  erase,
  toCode,
  toValue,
  reducer,
  capitalize,
  note,
  isPath,
  toNumber,
  getDateTime,
  toOperator,
  upload,
  insert,
  axios
}