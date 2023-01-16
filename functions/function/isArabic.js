const arabic = /[\u0600-\u06FF\u0750-\u077F]/
const english = /[A-Za-z]/

const isArabic = ({ id, value, text }) => {

  var view = window.views[id]
  if (!view || !view.element) return
  text = text || value || view.element.value || view.element.innerHTML
  if (!text) return

  var isarabic = arabic.test(text)
  var isenglish = english.test(text)

  if (isarabic && !isenglish) {

    view.element.classList.add("arabic")
    view.element.style.textAlign = view.element.style.textAlign || "right"
    if (view.type !== "Input") view.element.innerHTML = text.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])
    else view.element.value = text.toString().replace(/\d/g, d =>  '٠١٢٣٤٥٦٧٨٩'[d])
    if (view["placeholder-ar"]) view.element.placeholder = view["placeholder-ar"]

  } else {

    if (view.element.className.includes("arabic")) view.element.style.textAlign = view.element.style.textAlign || "right"
    view.element.classList.remove("arabic")
    if (view["placeholder"]) view.element.placeholder = view["placeholder"]
  }

  return isarabic && !isenglish
}

module.exports = { isArabic }
