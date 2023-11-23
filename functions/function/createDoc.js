const { toParam } = require("./toParam");
const { toCode } = require("./toCode");

const createDoc = ({ _window }) => {

    var { global, views, res } = _window

    // update manifest
    var string = "manifest:().favicon=.favicon||'';manifest:().language=.language||.lang||en;manifest:().direction=.direction||.dir||[rtl?manifest:().language=ar;manifest:().language=fa?ltr];manifest:().title=.title||Bracket App Title;manifest:().meta:()=[.meta||[]];__views__:().filter():[__server__]._():[_.view.del();_.children.del();_.__actions__.keys().():[__.__.actions__.[_]=true]]"
    toParam({ _window, id: global.manifest.page, string: toCode({ _window, string }) })
    
    console.log("Document is ready!");
    
    res.send(
    `<!DOCTYPE html>
        <html lang="${global.manifest.language}" dir="${global.manifest.direction}" class="html">
            <head>
                    <title>${global.manifest.title}</title>
                <!-- meta -->
                    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
                    <meta name="viewport" content= "width=device-width, initial-scale=1.0">
                <!-- links: favicon, google api, & css -->
                    <link rel="icon" type="image/x-icon" href="${global.manifest.favicon}">
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link rel="stylesheet" href="/resources/index.css"/>
                <!-- links: default fonts -->
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap">
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400&display=swap">
                <!-- head links -->
                ${global.__links__.head || ""}
            </head>
            <body>
                <!-- body links -->
                    ${global.__links__.body || ""}
                    ${views.root.__html__ || ""}
                <!-- scripts: views, globals, & index -->
                    <script id="__views__" type="application/json">${JSON.stringify(views)}</script>
                    <script id="__global__" type="application/json">${JSON.stringify(global)}</script>
                    <script src="/index.js"></script>
                <!-- links: google & bootstrap icons -->
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined"/>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Rounded"/>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Sharp"/>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"/>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"/>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp"/>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
            </body>
        </html>`
    )
}

module.exports = { createDoc }