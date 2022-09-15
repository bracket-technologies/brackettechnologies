self.addEventListener("fetch", event => {
  // This is a dummy event listener
  // just to pass the PWA installation criteria on 
  // some browsers
});
self.onmessage = function(e) {
  console.log('Message received from main script');
  var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
  console.log('Posting message back to main script');
  postMessage(workerResult);
}