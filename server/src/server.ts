import express from 'express';
import cors from 'cors';
import expressJwt from 'express-jwt';

import { routerUser } from './routers/routerUsers';
import WebSocket from 'ws';
import http from 'http';
import { connectDb } from './mongodb';
import { routerTrips } from './routers/routerTrips';
import { Trip } from './collections/trip';



const port = 4000;
const app = express();
app.use(express.json());
const { JWT_SECRET = 'secret' } = process.env;
const server = http.createServer(app);
export const wss = new WebSocket.Server({ server })


//API_____________________________________________________________________
app.use(cors());
// app.use(expressJwt({ secret: JWT_SECRET }).unless({ path: ['/trips', /^\/user\//] }));
app.use(expressJwt({ secret: JWT_SECRET }).unless({ path: ['/','/trips','/user/login','/user/registrate' ]}));
// app.use(expressJwt({ secret: JWT_SECRET }).unless({ path: '/user/registrate' }));



app.use("/user", routerUser);
app.use("/privetPage", routerUser);
app.use("/trips", routerTrips);


app.get('/', (req, res) => {

    res.send("hello");
})



// // comment out this line if you want to bypass JWT check during development
// // app.use(expressJwt({ secret: JWT_SECRET }).unless({ path: '/' }));

app.get('/', (req, res) => {
    res.send('Hi there!');
});

app.get('/trips', async (req, res) => {
    const trips = await Trip.find().exec();    

    if (!trips.length) {
        res.status(500).send({ response: false,  msg: 'There is no trips to show, come back latter' });
        return
    };
    res.send(trips);
 })





// startServer();

// async function startServer() {
//     await connectDb();
//     console.log('line 95')
//     app.listen(port, () => console.log(`Server is up at ${port}`));
// }

wss.on('connection', (ws: WebSocket) => {
    console.log("ws is connected");
    ws.send('ws is connected')

})


server.listen(port, () => {
    connectDb();
    console.log("server is up...")
})

