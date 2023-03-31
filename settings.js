module.exports = {
    adminAuth: {
        type: "credentials",
        users: [
            {
                username: require("fs").readFileSync('/run/secrets/nodered-admin-creds').toString().split(':')[0],
                password: require("fs").readFileSync('/run/secrets/nodered-admin-creds').toString().split(':')[1].replace('$2y$','$2b$'),
                permissions: "*"
            },
            {
                username: require("fs").readFileSync('/run/secrets/nodered-readonly-creds').toString().split(':')[0],
                password: require("fs").readFileSync('/run/secrets/nodered-readonly-creds').toString().split(':')[1].replace('$2y$','$2b$'),
                permissions: "read"
            }
        ]
    },
}