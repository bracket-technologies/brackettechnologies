const {clearValues} = require("./clearValues")
const {clone} = require("./clone")
const {getParam} = require("./getParam")
const {isArabic} = require("./isArabic")
const {isEqual} = require("./isEqual")
const {merge} = require("./merge")
const {overflow} = require("./overflow")
const {toApproval} = require("./toApproval")
const {toComponent} = require("./toComponent")
const {toId} = require("./toId")
const {toParam} = require("./toParam")
const {toString} = require("./toString")
const {update, removeChildren} = require("./update")
const {toControls} = require("./toControls")
const {toArray} = require("./toArray")
const {generate} = require("./generate")
const {refresh} = require("./refresh")
const {axios} = require("./axios")
const {wait} = require("./wait")
const {createElement} = require("./createElement")
const {addEventListener} = require("./event")
const {execute} = require("./execute")
const {controls} = require("./controls")
const {setContent} = require("./setContent")
const {starter} = require("./starter")
const {setState} = require("./state")
const {setPosition} = require("./setPosition")
const {droplist} = require("./droplist")
const {createView} = require("./createView")
const {filter} = require("./filter")
const {remove} = require("./remove")
const {focus} = require("./focus")
const {sort} = require("./sort")
const {log} = require("./log")
const {search} = require("./search")
const {save} = require("./save")
const {erase} = require("./erase")
const {toValue} = require("./toValue")
const {reducer} = require("./reducer")
const {toStyle} = require("./toStyle")
const {preventDefault} = require("./preventDefault")
const {createComponent} = require("./createComponent")
const {getJsonFiles} = require("./jsonFiles")
const {createHtml} = require("./createHtml")
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
const {setElement} = require("./setElement")
const {toOperator} = require("./toOperator")
const {popup} = require("./popup")
const {keys} = require("./keys")
const {toggleView} = require("./toggleView")
const {upload} = require("./upload")
const {compare} = require("./compare")
const {toCSV} = require("./toCSV")
const {decode} = require("./decode")
const {route} = require("./route")
const {contentful} = require("./contentful")
const {importJson} = require("./importJson")
const {getDateTime} = require("./getDateTime")
const {insert} = require("./insert")
const {exportJson} = require("./exportJson")
const {switchMode} = require("./switchMode")
const {setCookie, getCookie} = require("./cookie")
const {getDaysInMonth} = require("./getDaysInMonth")
const {reload} = require("./reload")
const {nothing} = { nothing: () => {} }
const {fileReader} = require("./fileReader")
const {position, getPadding} = require("./position")
const {
  setStyle,
  resetStyles,
  toggleStyles,
  mountAfterStyles,
} = require("./style")
const {resize, dimensions, converter} = require("./resize")
const {createData, clearData} = require("./data")

module.exports = {
  switchMode,
  refresh,
  nothing,
  getDaysInMonth,
  importJson,
  converter,
  getCookie,
  setCookie,
  position,
  getPadding,
  route,
  decode,
  contentful,
  reload,
  toCSV,
  compare,
  setElement,
  clearValues,
  clone,
  getJsonFiles,
  search,
  getParam,
  isArabic,
  isEqual,
  merge,
  overflow,
  addEventListener,
  setState,
  toApproval,
  toComponent,
  toId,
  toParam,
  fileReader,
  toString,
  update,
  execute,
  removeChildren,
  toArray,
  generate,
  createElement,
  controls,
  setStyle,
  resetStyles,
  toggleStyles,
  mountAfterStyles,
  resize,
  dimensions,
  createData,
  setData,
  clearData,
  setContent,
  starter,
  createComponent,
  setPosition,
  droplist,
  filter,
  createView,
  createActions,
  blur,
  toAwait,
  exportJson,
  toControls,
  remove,
  defaultInputHandler,
  focus,
  sort,
  wait,
  log,
  save,
  erase,
  toCode,
  toValue,
  reducer,
  preventDefault,
  toStyle,
  createHtml,
  capitalize,
  note,
  isPath,
  toNumber,
  popup,
  getDateTime,
  keys,
  toOperator,
  upload,
  toggleView,
  insert,
  axios
}