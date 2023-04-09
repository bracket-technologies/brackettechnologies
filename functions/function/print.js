const { toParam } = require("./toParam")

module.exports = {
    print: async ({ id, options, ...params }) => {

        var mediaQueryList = window.matchMedia('print')

        mediaQueryList.addListener(function(mql) {
            if (mql.matches) {
                // console.log('before print dialog open');
                if (options["before-print"]) toParam({ string: options["before-print"], id, mount: true })
            } else {
                // await params
                if (params.asyncer) require("./toAwait").toAwait({ id, ...params })
                if (options["after-print"]) toParam({ string: options["after-print"], id, mount: true })
            }
        })
        
        window.print()
    }
}   