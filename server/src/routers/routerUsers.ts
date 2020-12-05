import { Router } from 'express';
import { User } from '../collections/user';

const bcrypt = require('bcrypt');


const jwt = require("jsonwebtoken");

const { JWT_SECRET = 'secret' } = process.env;

export const routerUser = Router();
const secretKey = "my-vacation";
routerUser


routerUser.post('/registrate', async (req, res) => {
    console.log('start registration')
    const { firstName, secondName, username, userPassword } = req.body;
    console.log({ user_name: username })
    const user = await User.find({ user_name: username }).exec();
    const hashedPassword = await bcrypt.hash(req.body.userPassword, 10)
    if (!user.length) {
        try {
            const user = new User({
                user_name: username,
                password: hashedPassword,
                first_name: firstName,
                last_name: secondName,
                admin: false,
                followed_trips: []
            })
            await user.save();

        } catch (err) {
            res.status(403).send(err.message)
        }
        const [new_user] = await User.find({ user_name: username }).exec();
        const token = jwt.sign({ name: firstName, id: userPassword }, JWT_SECRET);
        res.send({ response: true, user: new_user, msg: 'you may start dreaming', token: token })
        return
    }

    if (user.length) {
        res.send({ response: false, msg: 'this user name is taken, pls try another one' })
    }
})

// LOGIN================================

routerUser.post('/login', async (req, res) => {
    const { username, userPassword } = req.body;
    const user = await User.find({ user_name: username }).exec();
    console.log({ logedin_user: user })
    if (!user.length) {
        res.send({ response: false, msg: `there is no such account, join us` })
        return
    }

    const logedin_user = user[0];
    console.log("line 60: ", logedin_user)
    const hashedPassword = logedin_user.password;
    const isValid_password = await bcrypt.compare(userPassword, hashedPassword)
    if (!isValid_password) {
        console.log("password is not valid")
        res.send({ response: false, msg: 'user and password don\'t match' })
        return
    }
    const user_id = logedin_user._id

    console.log("line 67: ",  user_id)

    const token = jwt.sign({ user_id }, JWT_SECRET);
    console.log({ token: token })

    res.send({
        response: true,
        user: logedin_user,
        msg: `welcome back ${logedin_user.user_name}`,
        token: token,
        authorisation: 'user',

    })
})
