const { generate } = require("./generate");
const { toParam } = require("./toParam");

module.exports = {
    print: async ({ id, options }) => {

        var global = window.global
        var mediaQueryList = window.matchMedia('print');

        mediaQueryList.addListener(function(mql) {
            if (mql.matches) {
                // console.log('before print dialog open');
                if (options["before-print"]) toParam({ string: options["before-print"], id, mount: true })
            } else {
                // console.log('after print dialog closed');
                if (options["after-print"]) toParam({ string: options["after-print"], id, mount: true })
            }
        });

        window.print()
        /*var element
        if (options.id) element = document.getElementById(options.id)
        lDiv = document.createElement("div")
        views.root.element.appendChild(lDiv)
        lDiv.style.position = "absolute"
        lDiv.style.opacity = "0"
        var innerHTML = element.parentNode.innerHTML

        innerHTML.split(`id="`).slice(1).map(id => id.split(`"`)[0]).map(id => {
            innerHTML = innerHTML.replace(id, generate())
        })*/

        /*const getBase64Image = (url) => {

            const img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL("image/png");
            }
            
            img.src = url
        }

        var dataUrls = [...element.getElementsByTagName("IMG")].map(el => {

            el.crossOrigin = "Anonymous"
            const canvas = document.createElement("canvas")
            canvas.width = el.width
            canvas.height = el.height
            const ctx = canvas.getContext("2d")
            ctx.drawImage(el, 0, 0)
            return canvas.toDataURL("image/png")
        })*/
        
        /*if (innerHTML.split(`src="`).length > 0) {
            
            var _innerHTML = innerHTML
            var otherHTML = _innerHTML.split(`src="`).slice(1).map(html => html.split(`"`).slice(1).join(`"`))
            innerHTML = innerHTML.split(`src="`)[0]
            _innerHTML.split(`src="`).slice(1).map(src => src.split(`"`)[0]).map((src, i) => {
                
                innerHTML += `src="${dataUrls[i]}"${otherHTML[i]}`
            })
        }
        
        lDiv.innerHTML = innerHTML
        var _id = generate()
        lDiv.children[0].id = _id
        views[_id] = {
            id: _id,
            element: lDiv.children[0]
        }

        if (options.styleAll) {

            var styleAllChildren = (el) => {
                Array.from(el.children).map(el => {
                    Object.entries(options.styleAll).map(([key, value]) => {

                        el.style[key] = value
                    })

                    if ([...el.children].length > 0) styleAllChildren(el)
                })
            }
            styleAllChildren(lDiv)
        }

        if (options.params) require("./toParam").toParam({ id: _id, string: options.params })
        
        options = {
            margin:       options.margin || 0,
            filename:     (options.name || options.filename || `Bracket-${(new Date()).getTime()}`) + ".pdf",
            image:        { type: 'png', quality: 1 },
            html2canvas:  { scale: options.scale || 2, dpi: 90, letterRendering: true, allowTaint : false, logging: true },
            jsPDF:        { unit: 'in', format: options.format || 'a4', orientation: options.orientation || 'portrait' }
        }
        
        var printWindow = window.open('', '', 'height=0,width=0')
        printWindow.document.write('<html><head><title>DIV Contents</title></head><body>')
        printWindow.document.write(innerHTML)
        printWindow.document.write('</body></html>')
        printWindow.document.close()
        printWindow.print()

        /*var a = window.open("", "")
        a.document.write(`<!DOCTYPE html>
        <html lang="en" dir="ltr" class="html">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://bracketjs.com/resources/index.css"/>
                <link rel="stylesheet" href="https://bracketjs.com/resources/Lexend+Deca/index.css"/>
            </head>
            <body>${lDiv.innerHTML}</body>
        </html>`)
        a.document.close()
        a.print()*/
        // index.js
        
        /*var fakeImageElements = [...lDiv.getElementsByTagName("IMG")]
        var mainImageElements = [...element.getElementsByTagName("IMG")]

        mainImageElements.map((element, index) => {

            fakeImageElements[index].src = element.src
            var input = document.createElement("input")
            input.style.position = "absolute"
            input.style.opacity = "0"
            views.root.element.appendChild(input)
            
            input.value = element.src
            console.log("1", element);
            
            var reader = new FileReader()
            
            reader.onload = function() {
    
                var imageDataUrl = reader.result;
                console.log("2", imageDataUrl);  
                fakeImageElements[index].setAttribute("src", imageDataUrl);

                
            }
            
            reader.readAsDataURL(input.files[0])
        })
    
        // html2canvas(lDiv.children[0], {useCORS: true})
        html2pdf().set(options).from(lDiv.children[0]).save().then(() => {

            views.root.element.removeChild(lDiv)
            lDiv = null
            require("./update").removeChildren({ id: _id })
        })*/

    }
}