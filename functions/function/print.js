const { toParam } = require("./toParam")

module.exports = {
    print: async ({ id, options }) => {

        var mediaQueryList = window.matchMedia('print')

        mediaQueryList.addListener(function(mql) {
            if (mql.matches) {
                // console.log('before print dialog open');
                if (options["before-print"]) toParam({ string: options["before-print"], id, mount: true })
            } else {
                // console.log('after print dialog closed');
                if (options["after-print"]) toParam({ string: options["after-print"], id, mount: true })
            }
        })
        
        window.print()
    }
}