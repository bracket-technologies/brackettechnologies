const { SMTPServer } = require('smtp-server');
const simpleParser = require('mailparser').simpleParser;
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const server = new SMTPServer({
    authOptional: true,
    onData(stream, session, callback) {
        simpleParser(stream)
            .then(parsed => {
                // inbox
                console.log('Email received:');
                console.log('From:', parsed.from.text);
                console.log('To:', parsed.to.text);
                console.log('Subject:', parsed.subject);
                console.log('Text:', parsed.text);
            })
            .catch(err => {
                console.error('Error parsing email:', err);
            })
            .finally(() => {
                callback(null, 'Message accepted');
            });
    }
});

server.listen(587, () => {
    console.log('SMTP server is listening on port 587');
});

//sendEmail().catch(console.error);
/* 
DNS records:

MX Record:
    Host: @
    Priority: 10
    Mail Server: mail.<mydomain.com>

SPF Record:
    Name: @
    Type: TXT
    Value: v=spf1 ip4:<ipAddress> include:spf.<mydomain.com> ~all

DKIM Record:
    Name: default._domainkey
    Type: TXT
    Value: v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtEV2RZRfN1IeDaBTPcqgVVbNknBsV1uGGzfWY9BHR1lQ/0VUJE5tS7s7UKYIgr682VknoklceBgZ5vRtrvDEVEIHla0KnNnLCbabCib9FDaBWjeRYKhCi0tiQG218HO0CRPfnEkhacVy7GWb8GShIGRum3CTyQO1nd0LDth3FRMss2wTuD6nQjO3NkOmQvxlZwcBLcgQ4NGNTG/D3xBst6OMMDkDfqpDyO5hqBWgkXUVT/ijCPGECkSEIXH5N4z/U1sHEf/VHj57ruMLzD1Z0n4yFntO3D0dDZmtfZ4ocTY3K8YcLJKaG+LygFaxg0GQOWwAkTMeR1rCBr21T/5vlQIDAQAB

DMARC Record:
    Name: _dmarc
    Type: TXT
    Value: v=DMARC1; p=none; rua=mailto:dmarc-reports@<mydomain.com>; ruf=mailto:dmarc-failures@<mydomain.com>; sp=none; adkim=s; aspf=s

SRV Record (Optional):
    Service: _imap
    Protocol: _tcp
    Name: <example.com>
    Priority: 10
    Weight: 5
    Port: 3000
    Target: mail.<example.com>
*/