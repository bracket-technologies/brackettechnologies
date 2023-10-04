const { toParam } = require("./function");
const { toCode } = require("./toCode");
const vCards = require('vcards-js');
const QRCode = require('qrcode');

const generateQRCode = async ({ req, res, _window }) => {

    var params = req.url.split("/").slice(2).join("/")
    params = toCode({ _window, string: toCode({ _window, string: decodeURI(params) }), start: "'", end: "'" })
    params = toParam({ _window, req, res, string: params })
    
    if (params.secretKey === "BracketTechnologies") {

        var data = await QRCode.toDataURL('https://brackettechnologies.com' + req.url.replace("generateQRCode/secretKey=BracketTechnologies;", "contactNumber/"))
        res.send(`<div style="height:100vh; width:100vw; display:flex; align-items:center; justify-content:center"><img src="${data}"/></div>`)

    } else res.send("Missing Data!")
}

const contactNumberHandler = ({ req, res, _window }) => {

    var params = req.url.split("/").slice(2).join("/")
    params = toCode({ _window, string: toCode({ _window, string: decodeURI(params) }), start: "'", end: "'" })
    params = toParam({ _window, req, res, string: params })
    
    if (params.firstName && params.lastName && params.workPhone) {

        // create a new vCard
        const vCard = vCards();
      
        vCard.firstName = params.firstName || "";
        vCard.middleName = params.middleName || "";
        vCard.lastName = params.lastName || "";
        if (params.photo) vCard.photo.attachFromUrl(params.photo)
        if (params.logo) vCard.logo.attachFromUrl(params.logo)
        
        if (params.birthday && params.birthday.split("/")[0] !== undefined && params.birthday.split("/")[1] !== undefined && params.birthday.split("/")[2] !== undefined) 
            vCard.birthday = new Date(parseInt(params.birthday.split("/")[2]), parseInt(params.birthday.split("/")[1] - 1), parseInt(params.birthday.split("/")[0]));

            delete params.firstName
            delete params.lastName
            delete params.middleName
            delete params.photo
            delete params.logo
            delete params.birthday

        Object.entries(params).map(([key, value]) => {
            vCard[key] = value
        })
      
        res.set('Content-Type', 'text/vcard; name="contact.vcf"');
        res.set('Content-Disposition', 'inline; filename="contact.vcf"');
        
        res.send(vCard.getFormattedString());

    } else res.send("Missing Info!")
}

module.exports = { contactNumberHandler, generateQRCode }
// https://brackettechnologies.com/generateQRCode/secretKey=BracketTechnologies;firstName=Mohamad;lastName=Obeid;organization=Bracket Technologies;workPhone=0096181026725;title='Inv.';url='https://brackettechnologies.com';note='Nice to meet you!'