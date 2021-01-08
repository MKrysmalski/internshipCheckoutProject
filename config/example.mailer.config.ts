let MailConfig = {
    connection: {
        host: 'w01553e9.kasserver.com',
            port: 465,
        tls: {
            ciphers: 'SSLv3',
        },
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'm04542e1',
            pass: 'JDZu-fdGUacP.r8xwG',
        },
    },
    templatePath: '/home/michael/projects/grpc/Checkout/src/mail/templates'
}

export { MailConfig }