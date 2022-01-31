import "reflect-metadata";

import express from 'express';
import RandomUser from "./services/randomUser";

import { createConnection, getConnection } from "typeorm";
import { User } from "./Models/User";
import { Message } from "./Models/Message";

import * as bodyParser from 'body-parser'
import * as sha512 from 'js-sha512'
import * as jwt from 'jsonwebtoken'
import { userInfo } from "os";
// import * as jwtexpress from 'express-jwt'

var jwtexpress = require('express-jwt');

const app = express();
const port = 3009;

app.use(bodyParser.json())

app.use(jwtexpress({ secret: 'ThisIsMySecretSentenceBlaBlaBla', algorithms: ['HS256'] }).unless({
    path: [
        '/auth',
        '/inscription',
        '/message',
        '/message/content'

    ]
}));

createConnection({
    type: "mysql",
    host: "localhost",
    port: 8889,
    username: "root",
    password: "root",
    database: "node",
    entities: [
        User,
        Message
        // __dirname + "/Models/*.ts"
    ],
    synchronize: true,
    logging: false
})

app.get('/', async (req, res) => {

    // let user = new User();
    // user.firstname = "John"
    // user.lastname = "Doe"

    // let result = await getConnection().manager.save(user)

    // let result = await User.findOne({where: { firstname: "John" }})

    let result = await User.find()


    res.json({ status: 200, data: result })

});

app.post('/auth', async (req, res) => {
    console.log({
        email: req.body.email,
        password: sha512.sha512(req.body.password)
    })
    let user = await User.findOne({
        where: {
            email: req.body.email,
            password: sha512.sha512(req.body.password)
        }
    })

    let token = jwt.sign({ id: user.id }, 'ThisIsMySecretSentenceBlaBlaBla');

    res.json({ status: 200, data: token })

})

app.get('/test', (req, res) => {
    res.json({ status: 200, data: "URL de TEST" })
})

app.get('/users/me', async (req, res) => {
    // @ts-ignore
    let user = await User.findOne({ where: { id: req.user.id } })

    res.json({ status: 200, data: user })
})
app.post('/inscription', async (req, res) => {
    // @ts-ignore
    let newUser = new User()
    newUser.firstname = req.body.firstname
    newUser.lastname = req.body.lastname
    newUser.email = req.body.email
    newUser.password = sha512.sha512(req.body.password)
    newUser.save()
    res.json({ status: 200 })
})
app.post('/message', async (req, res) => {
    let newMessage = new Message()
    newMessage.content = req.body.content
    newMessage.user = req.body.user
    newMessage.save()
    res.json({ status: 200 })

})
app.get('/message/content', async (req, res) => {
    // @ts-ignore
    let message = await Message.find()
    res.json({ status: 200, data: message })
})
app.listen(port);