const MailConfig = {
    connection: {
        host: 'w01553e9.kasserver.com',
            port: 465,
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false,
        },
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'm04542e1',
            pass: 'JDZu-fdGUacP.r8xwG',
        },
    },
    templatePath: '/home/user7p/projekte/mas-checkout/src/mail/templates'
}

export { MailConfig }