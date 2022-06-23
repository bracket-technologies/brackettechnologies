self.addEventListener('fetch', function(event) {
    const newRequest = new Request(event.request, {
        headers: {
            "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Access-Control-Allow-Origin",
            "Access-Control-Allow-Origin": "*"
        },
        mode: "no-cors"
    })
    return fetch(newRequest)
})

self.addEventListener('foreignfetch', function(event) {
    const newRequest = new Request(event.request, {
        headers: {
            "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Access-Control-Allow-Origin",
            "Access-Control-Allow-Origin": "*"
        },
        mode: "no-cors"
    })
    return fetch(newRequest)
})