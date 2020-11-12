let MailConfig = {
    connection: {
        host: '',
            port: 465,
        tls: {
            ciphers: 'SSLv3',
        },
        secure: true, // true for 465, false for other ports
        auth: {
            user: '', // generated ethereal user
            pass: '', // generated ethereal password
        },
    },
    templatePath: ''
}

export { MailConfig }