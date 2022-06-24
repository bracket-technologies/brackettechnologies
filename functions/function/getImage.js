module.exports = {
    getImage: async ({ req, res }) => {
  
        //
        var string = decodeURI(req.headers.search), params = {}
        string = toCode({ _window, string })
        
        if (string) params = toParam({ _window, string, id: "" })
        var search = params.search || {}
        var url = search.url
        
        var image = await require("axios").get(url, {
            timeout: 1000 * 10
          })
          .then(res => res.doesNotExist.throwAnError)
          .catch(err => err);

        // convert base64 to buffer
        var buffer = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(image, "base64").toString('base64')
        res.send(buffer)
    }
}