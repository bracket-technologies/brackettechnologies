const { generate } = require("../function/generate")
const { toComponent } = require("../function/toComponent")

module.exports = (component) => {

  if (component.templated) return component

  component = toComponent(component)
  var { text, style, sort, path, model } = component
  var id = component.id || generate()

  if (model === "classic") return component
  else if (model === "featured")
    return {
      ...component,
      type: "Header",
      id,
      style: {
        display: "flex",
        ...style,
      },
      children: [
        {
          type: "View?class=flex-box;style.position=relative;style.flexDirection=column",
          children: [
            {
              type: `Text?text=${text};id=${id}-text`,
              style: {
                width: "fit-content",
                fontSize: style.fontSize || "1.4rem",
                cursor: "pointer",
              },
              controls: [
                {
                  event: "click",
                  actions: [
                    // hide previous visible carrets
                    `setStyle?style.display=none?global().${sort.state}-sort!=${id}-caret?global().${sort.state}-sort`,
                    // show carrets
                    `setStyle?style.display=flex??${id}-caret`,
                    // sort
                    `sort;setState?data=global().${sort.state};id=${sort.id};path=${path};global().${sort.state}-sort=${id}-caret?const.${path}`,
                    // caret-up
                    `setStyle?style.display=flex?().sort=ascending?${id}-caret-up`,
                    `setStyle?style.display=none?().sort=descending?${id}-caret-up`,
                    // caret-down
                    `setStyle?style.display=none?().sort=ascending?${id}-caret-down`,
                    `setStyle?style.display=flex?().sort=descending?${id}-caret-down`,
                  ],
                },
              ],
            },
            {
              type: `View?id=${id}-caret;style.display=none;style.cursor=pointer?const.${path}`,
              children: [
                {
                  type: `Icon?id=${id}-caret-up;style.position=absolute;style.top=-1rem;style.left=calc(50% - 1rem);style.width=2rem;icon.name=bi-caret-up-fill`,
                },
                {
                  type: `Icon?id=${id}-caret-down;style.position=absolute;style.bottom=-1.1rem;style.left=calc(50% - 1rem);style.width=2rem;icon.name=bi-caret-down-fill`,
                }
              ]
            }
          ]
        }
      ]
    };
}
