const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const apollo = require('./apollo')

const start = options => {
    return new Promise((resolve, reject) => {
        if (!options.port)
            return reject(new Error("Please provide server port."))

        if (!options.repo)
            return reject(new Error("Please provide repository."))

        const app = express()
        app.use(morgan('dev'))
        app.use(helmet())

        app.use((err, req, res, next) => {
            reject(err);
            res.status(500).json({
                error: err.message,
                stack: err.stack
            })
        })

        const apolloServer = apollo.create(options);
        apolloServer.applyMiddleware({ app })

        const server = app.listen(options.port, () => {
            console.log(`Server is running on port ${options.port}...`)
            resolve(server)
        })
    })
}

module.exports = {
    start
}