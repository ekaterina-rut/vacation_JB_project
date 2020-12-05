import { Router } from 'express';
// import { followTrip, unfollowTrip, addTrip, updateTrip, deleteTrip, deletTripFromFollowedTrips, getTripsFromData, updateFollowedTrips, tripNameById, checkTripValidation } from './queries'
import WebSocket, { Server } from 'ws';
import http from 'http';
import { wss } from './../server'
import { Trip } from '../collections/trip';
import { User } from './../collections/user'




export const routerTrips = Router();

function sendAllClients(msg: any) {
    const json = JSON.stringify(msg);
    console.log(msg)

    wss.clients.forEach(client => {
        client.send(json);
    });
}


// add trip


routerTrips.post<any>('/addNewTrip', async (req, res) => {
    const { trip } = req.body;
    console.log("line28: ", { newTrip: trip })
    // to add validation
    const isExist = await Trip.find({ name: trip.name }).exec();
    if (isExist.length) {
        res.status(400).send({
            success: false,
            msg: 'this trip is allready exist'
        });
        return
    }

    // name: '',
    // description: '',
    // location: '',
    // price: 0,
    // startDate: null,
    // endDate: null,
    // image: '',
    // file: null

    const new_trip = await new Trip({
        name: trip.name,
        contry: trip.location,
        description: trip.description,
        img: trip.image,
        start_date: trip.startDate,
        end_date: trip.endDate,
        price: trip.price,
        followers: 0
    })

    await new_trip.save();


    console.log("line 59: ", new_trip)

    const updatedTrips = await Trip.find().exec();
    console.log("line 62: ", updatedTrips)


    const messeageFromSocket = {
        type: 'ADD_TRIP',
        payload: {
            msg: `check out a new trip ${trip.name} `,
            updatedTrips: updatedTrips,
            newTrip: trip,
            tripId: new_trip._id
        }
    }

    console.log("line 79", { messeageFromSocket: messeageFromSocket })
    sendAllClients(messeageFromSocket);

    res.send({ success: true })
})

// follow trip ----------------------------

routerTrips.post<any>('/follow', async (req, res) => {
    const { trip_id, user_id } = req.body;
    console.log({ followedtrip: trip_id, user: user_id })
    const followed_trip = await Trip.find({ _id: trip_id }).exec();
    const trip_followers = followed_trip[0].followers + 1;
    console.log("trip to follow", followed_trip[0])
    console.log("line 90: ", followed_trip, "total followers", trip_followers)
    if (!followed_trip) {
        return res.send({ success: false, msg: 'this trip is no longer exist' })
    }
    await Trip.updateOne({ _id: trip_id }, { $set: { followers: trip_followers } });
    await User.updateOne({ _id: user_id }, { $push: { followed_trips: trip_id } });
    const [user] = await User.find({ _id: user_id }).exec();
    console.log("user", user)

    const messeageFromSocket = {
        type: 'NEW_UPDATE',
        payload: {
            msg: `new trip is followed ${followed_trip[0].name}`
        }
    }
    sendAllClients(messeageFromSocket);

    const action = {
        type: 'FOLLOW_TRIP',
        payload: {
            msg: 'added to your followed trips',
            followedTrip: followed_trip[0],
            user: user
        }
    }
    res.send({ success: true, action: action })
    // res.send({ success: true })
})

// -------------UNFOLLOW TRIP-------------------

routerTrips.get<any, getTripsProps>('/:id/followedTrips', async (req, res) => {
    const { userID } = req.query;

    res.send({
        success: true,
        msg: 'you are following the bellow trips'
    })
})

routerTrips.post<any>('/unfollow', async (req, res) => {
    const { user_id, trip_id } = req.body;
    console.log({ upfollowed_trip: trip_id, user: user_id })
    // const tripName = await tripNameById(tripId);
    // const updatedFollowedTrips = await unfollowTrip(tripId, userId);
    // console.log({ updatedFollowedTripname: tripName[0].name });
    const [unfollowed_trip] = await Trip.find({ _id: trip_id }).exec();
    const trip_followers = unfollowed_trip.followers - 1;
    if (!unfollowed_trip) {
        return res.send({ success: false, msg: 'this trip is no longer exist' })
    }
    await Trip.updateOne({ _id: trip_id }, { $set: { followers: trip_followers } });
    await User.updateOne({ _id: user_id }, { $pull: { followed_trips: trip_id } });
    const [user] = await User.find({ _id: user_id }).exec();
    console.log("user", user)

    const messeageFromSocket = {
        type: 'NEW_UPDATE',
        payload: {
            msg: ` ${unfollowed_trip.name} is unfollowed `
        }
    }
    sendAllClients(messeageFromSocket);

    const action = {
        type: 'UNFOLLOW_TRIP',
        payload: {
            msg: 'unfollow trip',
            unfollowed_trip: unfollowed_trip,
            user: user
        }
    }
    res.send({ success: true, action: action })
})


// -------------EDIT TRIP-------------------


routerTrips.post<any>('/editTrip', async (req, res) => {
    const { updatedTrip } = req.body;
    console.log({ updatedTrip: updatedTrip, time: updatedTrip.startDate })
    await Trip.updateOne({ _id: updatedTrip._id }, {
        $set:
        {
            contry: updatedTrip.contry,
            img: updatedTrip.img,
            name: updatedTrip.name,
            price: updatedTrip.price,
            description: updatedTrip.description,
            start_date: updatedTrip.startDate,
            end_date: updatedTrip.endDate
        }
    });
    const updatedTrips = await Trip.find().exec();    
    console.log("line 188",  updatedTrips)



    // await updateTrip(updatedTrip);
    // const updatedTrips = await getTripsFromData();
    // await updateFollowedTrips(updatedTrip);


    // console.log(id);

    const messeageFromSocket = {
        type: 'TRIP_UPDATE',
        payload: {
            msg: `${updatedTrip.name} is updated`,
            updatedTrips: updatedTrips,
            updatedTrip: updatedTrip,
        }
    }

    sendAllClients(messeageFromSocket);
    res.send({
        success: true,
    })
})


// -------------DELETE TRIP-------------------


routerTrips.delete<any>('/:id', async (req, res) => {
    const { id } = req.params;
    console.log({ tripToDeleteId: id });
    const trip_to_delete = await Trip.find({_id: id}).exec();    
    const tripName = trip_to_delete[0].name

    await Trip.remove({_id: id}).exec();    
    const updatedTrips = await Trip.find().exec();    


    // const tripName = await tripNameById(id);
    // await deleteTrip(id);
    // await deletTripFromFollowedTrips(id);



    const mmesseageFromSockete = {
        type: 'DELETE_TRIP',
        payload: {
            // tripId: id,
            msg: `trip  ${tripName} was deleted`,
            updatedTrips: updatedTrips
        }
    }
    console.log({ deletedTripName: tripName })

    sendAllClients(mmesseageFromSockete)
})


function sendBySocket(wss: WebSocket, msg: any) {
    wss.send(JSON.stringify(msg));
}




