import { initialState } from "./store";
import { Actions } from './store'

export interface IState {
    counter: number;
    isLoadingValue: boolean;
}

export interface Action {
    type: string;
    payload: Record<string, any>;
}

export enum ActionType {
    IncrementStart = 'INCREMENT_START',
    IncrementSuccess = 'INCREMENT_SUCCESS',
}


export const reducer = (state = initialState, action: Action) => {
    switch (action.type) {

        case Actions.ClearError: {
            return {
                ...state,
                msg: null
            }
        }

        // ----------------------USER------------------
        case Actions.Registration: {
            const { msg, user, authorization, userName } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                msg: msg,
                user: user,
                authorization: authorization,
            }
        }

        case Actions.Login: {
            const { msg, userId, admin, user, authorization } = action.payload;
            const trips_id = user.followed_trips;
            const followed_trip_by_user = new Array;
            const trips = state.trips;
            trips.map(trip => {
                for (let i = 0; i <= trips_id.length; i++) {
                    if (trips_id[i] === trip._id) {
                        followed_trip_by_user.push(trip)
                    }
                }
            })


            return {
                ...state,
                isLoggedIn: true,
                msg: msg,
                userId: userId,
                followedTrips: followed_trip_by_user,
                admin: admin,
                user: user,
                authorization: authorization
            }
        }

        case Actions.ShowError: {
            const { msg } = action.payload;
            return {
                ...state,
                msg: msg
            }
        }

        case Actions.LogOut: {
            return {
                ...state,
                authorization: '',
                ws: null,
                msg: '',
                isLoggedIn: false,
                user: '',
                isGettingTrips: false,
                followedTrips: [],
                userId: null,
                admin: false,
                msgFromSocket: '',
                modal: false,
                tripToEdit: null,
                onNewTrip: false,
                authLevel: '',
                isChartsOn: false,
                followedTripsData: {},
            }
        }

        case Actions.ChartsData: {
            const { tripNames, followers } = action.payload;
            const data = {
                labels: tripNames,
                datasets: [
                    {
                        label: 'followers',
                        fontSize: 25,
                        fontColor: "black",
                        data: followers,
                        backgroundColor: 'yellow',
                        minBarLength: 2
                    }
                ]
            }
            return {
                ...state,
                followedTripsData: data
            }
        }


        case Actions.CloseEditTripForm: {
            return {
                ...state,
                modal: false
            }
        }

        case Actions.UpdateTrip: {
            const { updatedTrip, updatedTrips, msg } = action.payload;
            return {
                ...state,
                trips: updatedTrips,
                msgFromSocket: msg,
                isNewMessage: true


            }
        }

        case Actions.DeletTrip: {
            const { msg, updatedTrips } = action.payload;
            return {
                ...state,
                msgFromSocket: msg,
                trips: updatedTrips,
                isNewMessage: true
            }
        }

        case Actions.AddTrip: {
            const { msg, updatedTrips } = action.payload;
            return {
                ...state,
                trips: updatedTrips,
                isNewMessage: true,
                msgFromSocket: msg,

            }
        }

        case Actions.OpenModal: {
            const { editTrip } = action.payload;
            return {
                ...state,
                modal: true,
                tripToEdit: editTrip
            }
        }

        case Actions.GetTrips: {
            const { trips } = action.payload
            return {
                ...state,
                isGettingTrips: false,
                tripsFromServer: true,
                trips: trips
            }
        }

        case Actions.ConnectSocket: {
            const { ws } = action.payload;
            return {
                ...state,
                ws: ws
            }
        }


        case Actions.FollowTrip: {
            const { user, followedTrip, msg } = action.payload;
            if (state.followedTrips.length) {
                const tempFollowedTrips = state.followedTrips.slice()
                tempFollowedTrips.push(followedTrip);
                const trips = state.trips.slice();
                trips.map(trip => {
                    if (trip._id === followedTrip._id) {
                        trip.followers = trip.followers + 1
                    }
                })
                localStorage.setItem('user', JSON.stringify(user as any));
                localStorage.setItem('trips', JSON.stringify(trips as any));

                return {
                    ...state,
                    trips: trips,
                    followedTrips: tempFollowedTrips,
                    msg: msg,
                    user: user
                }
            }
            if (!state.followedTrips.length) {
                const trips = new Array;
                trips.push(followedTrip);
                trips.slice()
                return {
                    ...state,
                    followedTrips: trips
                }
            }
        }

        case Actions.UnfollowTrip: {
            const { unfollowed_trip, msg, user } = action.payload;
            localStorage.setItem('user', JSON.stringify(user as any));

            const trips_id = user.followed_trips;
            const followed_trip_by_user = new Array;
            const trips = state.trips.slice();
            trips.map(trip => {
                if (trip._id === unfollowed_trip._id) {
                    trip.followers = trip.followers - 1
                }
            })

            trips.map(trip => {
                for (let i = 0; i <= trips_id.length; i++) {
                    if (trips_id[i] === trip._id) {
                        followed_trip_by_user.push(trip)
                    }
                }
            })


            if (state.user) {
                return {
                    ...state,
                    user: user,
                    followedTrips: followed_trip_by_user,
                    msg: msg,
                    trips: trips
                }
            }


        }
        // ------------ADMIN------------
        case Actions.EnterToAdminPage: {
            const { msg } = action.payload;
            return {
                ...state,
                msg: msg,

            }
        }

        case Actions.OpenNewTripForm: {
            return {
                ...state,
                onNewTrip: true
            }
        }

        case Actions.CloseNewTripForm: {
            return {
                ...state,
                onNewTrip: false
            }
        }

        case Actions.CloseMessage: {
            return {
                ...state,
                isNewMessage: false
            }
        }

        case Actions.GetReport: {
            const { ws } = action.payload;
            return {
                ...state,
                ws: ws
            }
        }

        case Actions.NewUpdate: {
            const { msg } = action.payload;
            return {
                ...state,
                msgFromSocket: msg,
                isNewMessage: true
            }
        }
        default: {
            return state;
        }
    }
}
