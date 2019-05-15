const dotenv = require('dotenv').config()
const { EventEmitter } = require('events')
const mediator = new EventEmitter()
const config = require('./config')
const repository = require('./repository/repository')
const server = require('./server')

mediator.on('db.ready', repo => {
    repository.connect(repo).then(repo => {
        server.start({
            port: config.serverSettings.port,
            repo
        }).then(_ => {
            mediator.emit('server.ready')
        })
    })
});

mediator.on('db.error', err => {
    console.log(err)
    process.exit(1)
});

config.db.connect(config.dbSettings, mediator);

mediator.emit('boot.ready');