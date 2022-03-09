const { toComponent } = require("../function/toComponent");
const { generate } = require("../function/generate");

module.exports = (component) => {

  component = toComponent(component);
  var { model, controls } = component;

  var id = component.id || generate();
  var id00 = generate();
  var id05 = generate();
  var id10 = generate();
  var id15 = generate();
  var id20 = generate();
  var id25 = generate();
  var id30 = generate();
  var id35 = generate();
  var id40 = generate();
  var id45 = generate();
  var id50 = generate();

  if (model === "classic")
    return {
      ...component,
      type: "View?class=half-stars",
      children: [
        {
          type: "View?class=rating-group",
          children: [
            {
              type: `Input?id=${id00};class=rating__input rating__input-none;input.defaultValue=0;input.type=radio;checked;input.name=rating`,
            },
            // 0.5 star
            {
              type: `Label?aria-label=0.5 stars;class=rating__label rating__label-half;for=${id05}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star-half;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id05};class=rating__input;input.defaultValue=0.5;input.type=radio;input.name=rating`,
            },
            // 1 star
            {
              type: `Label?aria-label=1 stars;class=rating__label;for=${id10}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id10};class=rating__input;input.defaultValue=1;input.type=radio;input.name=rating`,
            },
            // 1.5 star
            {
              type: `Label?aria-label=1.5 stars;class=rating__label rating__label-half;for=${id15}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star-half;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id15};class=rating__input;input.defaultValue=1.5;input.type=radio;input.name=rating`,
            },
            // 2 star
            {
              type: `Label?aria-label=2 stars;class=rating__label;for=${id20}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id20};class=rating__input;input.defaultValue=2;input.type=radio;input.name=rating`,
            },
            // 2.5 star
            {
              type: `Label?aria-label=2.5 stars;class=rating__label rating__label-half;for=${id25}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star-half;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id25};class=rating__input;input.defaultValue=2.5;input.type=radio;input.name=rating`,
            },
            // 3 star
            {
              type: `Label?aria-label=3 stars;class=rating__label;for=${id30}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id30};class=rating__input;input.defaultValue=3;input.type=radio;input.name=rating`,
            },
            // 3.5 star
            {
              type: `Label?aria-label=3.5 stars;class=rating__label rating__label-half;for=${id35}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star-half;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id35};class=rating__input;input.defaultValue=3.5;input.type=radio;input.name=rating`,
            },
            // 4 star
            {
              type: `Label?aria-label=4 stars;class=rating__label;for=${id40}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id40};class=rating__input;input.defaultValue=4;input.type=radio;input.name=rating`,
            },
            // 4.5 star
            {
              type: `Label?aria-label=4.5 stars;class=rating__label rating__label-half;for=${id45}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star-half;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id45};class=rating__input;input.defaultValue=4.5;input.type=radio;input.name=rating`,
            },
            // 5 star
            {
              type: `Label?aria-label=5 stars;class=rating__label;for=${id50}`,
              children: [
                {
                  type: `Icon?class=rating__icon rating__icon-star;icon.name=fa fa-star;style.fontSize=2rem`,
                },
              ],
            },
            {
              type: `Input?id=${id50};class=rating__input;input.defaultValue=5;input.type=radio;input.name=rating`,
            },
          ],
        },
      ],
    };
}
