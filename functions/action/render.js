const { toView } = require("./toView");
const { addresser } = require("./addresser");
const { logger } = require("./logger");
const { toAwait } = require("./toAwait");
const { getData } = require("./database");

require("dotenv").config();

const render = async ({ _window, id, req, res, stack, address, lookupAction, data }) => {
}

module.exports = { render }

/* 
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.0/html2pdf.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.0/html2pdf.bundle.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.0/html2pdf.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.0/html2pdf.min.js"></script>
*/