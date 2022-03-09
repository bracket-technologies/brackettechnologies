const capitalize = (string, minimize) => {
  if (typeof string !== "string") return string

  if (minimize) return string
    .split(" ")
    .map((string) => string.charAt(0).toLowerCase() + string.slice(1))
    .join(" ")

  return string
      .split(" ")
      .map((string) => string.charAt(0).toUpperCase() + string.slice(1))
      .join(" ")
}

module.exports = {capitalize}
