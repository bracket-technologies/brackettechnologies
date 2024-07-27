const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const Imap = require('imap-simple');
const { simpleParser } = require('mailparser');

app.use(express.json());  // To parse JSON bodies

// IMAP configuration
const imapConfig = {
    imap: {
        user: '<user@example.com>', // Email address
        password: '<password>',     // Email password
        host: '<imap.example.com>', // IMAP server
        port: 3000,                // IMAP port
        tls: true,                // Use TLS
        authTimeout: 3000
    }
};

// Route to get emails
const emailDirectories = {
    INBOX: path.join(__dirname, 'inbox'),
    Sent: path.join(__dirname, 'sent'),
    Junk: path.join(__dirname, 'junk')
};

// Ensure the directory exists
Object.values(emailDirectories).map(emailDirectory => !fs.existsSync(emailDirectory) && fs.mkdirSync(emailDirectory))

/*
// Fetch emails from the inbox
async function fetchEmails(emailDirectory, box) {
    try {
        const connection = await Imap.connect(imapConfig);
        await connection.openBox(box);

        const searchCriteria = ['ALL'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false
        };

        const messages = await connection.search(searchCriteria, fetchOptions);

        for (const message of messages) {
            const all = message.parts.find(part => part.which === 'HEADER');
            const id = message.attributes.uid;
            const idHeader = "Imap-Id: " + id + "\r\n";
            const parsed = await simpleParser(idHeader + all.body);

            const emailData = {
                id: id,
                from: parsed.from.text,
                to: parsed.to.text,
                subject: parsed.subject,
                text: parsed.text,
                html: parsed.html,
                date: parsed.date,
                emailId: parsed.messageId
            };

            // Save email to local file
            const emailFilePath = path.join(emailDirectory, `${id}.json`);

            if (fs.existsSync(emailFilePath)) {
                const emailStatus = JSON.parse(fs.readFileSync(emailFilePath, 'utf-8'));
                Object.assign(emailStatus, {
                    read: message.attributes.flags.includes('\\Seen'),
                    flagged: message.attributes.flags.includes('\\Flagged')
                });
                fs.writeFileSync(emailFilePath, JSON.stringify(emailStatus, null, 2));
            } else fs.writeFileSync(emailFilePath, JSON.stringify(emailData, null, 2));
        }

        connection.end();
        console.log('Emails fetched and stored.');
    } catch (error) {
        console.error('Error fetching emails:', error);
    }
}

// Fetch emails periodically (e.g., every 5 minutes)
setInterval(fetchEmails, 5 * 60 * 1000);

const fetchAllEmails = () => {
    Object.entries(emailDirectories).map(([box, emailDirectory]) => fetchEmails(emailDirectory, box))
}
*/

// Route to get emails from a specified folder
app.get('/inbox', (req, res) => {
    getEmailsFromFolder(emailDirectories.INBOX, res);
});

app.get('/sent', (req, res) => {
    getEmailsFromFolder(emailDirectories.Sent, res);
});

app.get('/junk', (req, res) => {
    getEmailsFromFolder(emailDirectories.Junk, res);
});

function getEmailsFromFolder(directory, res) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error('Error reading email directory:', err);
            return res.status(500).send('Internal Server Error');
        }

        const emails = files.map(file => {
            const filePath = path.join(directory, file);
            const emailData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            return emailData;
        });

        // Sort emails by date, most recent first
        emails.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(emails);
    });
}

// Route to update the read status of an email
app.post('/markAsRead', (req, res) => {
    const { id, folder } = req.body;

    const emailFilePath = path.join(emailDirectories[folder], `${id}.json`);
    if (fs.existsSync(emailFilePath)) {
        const emailData = JSON.parse(fs.readFileSync(emailFilePath, 'utf-8'));
        emailData.read = true;  // Update read status

        fs.writeFileSync(emailFilePath, JSON.stringify(emailData, null, 2));
        res.send('Email marked as read');
    } else {
        res.status(404).send('Email not found');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
