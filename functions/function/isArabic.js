const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[A-Za-z]/

const isArabic = ({ id, value }) => {

  var local = window.value[id]
  var text = value || local.element && (local.element.value || local.element.innerHTML)
  if (!text) return

  var isarabic = arabic.test(text)
  var isenglish = english.test(text)

  if (isarabic && !isenglish) {

    local.element.classList.add("arabic")
    local.element.style.textAlign = "right"
    if (local["placeholder-ar"]) local.element.placeholder = local["placeholder-ar"]

  } else {

    if (local.element.className.includes("arabic")) local.element.style.textAlign = "left"
    local.element.classList.remove("arabic")
    if (local["placeholder"]) local.element.placeholder = local["placeholder"]

  }

  return isarabic && !isenglish
}

module.exports = { isArabic }
