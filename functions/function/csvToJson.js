const { toParam } = require("./toParam");

module.exports = {
    csvToJson: ({ id, e, options }) => {
        
        var reader = new FileReader();
        reader.onload = function () {
            // document.getElementById('out').innerHTML = reader.result;
            var lines = reader.result.split("\n")
            var result = [];
            var headers=lines[0].split(",");

            for(var i=1;i<lines.length;i++){

                var obj = {};
                var currentline=lines[i].split(",");

                for(var j=0;j<headers.length;j++){
                    obj[headers[j]] = currentline[j];
                }

                result.push(obj);
            }

            /* Convert the final array to JSON */
            console.log(result)
            window.views[id].csv = { data: result, message: "Data converted successfully!" }
            toParam({ id, e, string: options.loaded, mount: true })
        };

        // start reading the file. When it is done, calls the onload event defined above.
        reader.readAsBinaryString(e.target.files[0]);
    }
}