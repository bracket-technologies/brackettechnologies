const { toArray } = require("./toArray")
const readFile = require("./readFile");

module.exports = {
    mail: async ({ _window, req, res, id, data, __, dots, ...params }) => {

        var { subject, content, text, html, recipient, attachments, recipients = [] } = data
        
        const { google } = _window.__package__.googleapis
        const nodemailer = _window.__package__.nodemailer
        const OAuth2 = google.auth.OAuth2;
        var data = req.body.data
        var global = _window.global
        var project = global.data.project

        // no recipient
        if (!data.recipient) return res.send({ success: false, message: `Missing recipient!` })
        
        if (project.mail) {

            const OAuth2_client = new OAuth2(project.mail.clientId, project.mail.clientSecret);
            OAuth2_client.setCredentials({ refresh_token: project.mail.refreshToken })

            const accessToken = OAuth2_client.getAccessToken();
            const transporter = nodemailer.createTransport({
                service: project.mail.service,
                auth: {
                    type: project.mail.authType,
                    user: project.mail.user,
                    clientId: project.mail.clientId,
                    clientSecret: project.mail.clientSecret,
                    refreshToken: project.mail.refreshToken,
                    accessToken: accessToken
                },
            });

            const msg = {
                from: `"Bracket Technologies" <${project.mail.user}>`,
                to: `${toArray(recipient || recipients).map(r => r).join(", ")}`,
                subject: subject || "Test Email",
                text: text || "Hello World!",
                html: html || "<b>Hello World!</b>",
            }

            if (attachments) msg.attachments = attachments

            const info = await transporter.sendMail(msg);

            global.mail = { success: true, message: `Email sent successfully!` }

        } else global.mail = { success: false, message: `No mail api exists!` }

        // await params
        if (params.asyncer) require("./toAwait").toAwait({ _window, id, ...params, req, res, __, _: global.mail, dots })
    }
}