import axios from 'axios';
import { Actions, } from './store';
import { ITrip } from './../../../server/src/collections/trip'
import { Dispatch } from 'redux';
import { Action } from './store';
import { getToken, clearToken } from './../components/token'

export function checkLocalStorageAction() {
    const athorisation = localStorage.getItem('user');
    if (!athorisation) {
        return (dispatch: Dispatch) => {
            dispatch({
                type: {},
                payload: {}
            })
        }
    };
    if (athorisation) {
        const user = JSON.parse(athorisation);
        let aouthorization: string;
        if (user.admin) {
            aouthorization = "admin"
        };
        if (!user.admin) {
            aouthorization = "user"
        }
        return (dispatch: Dispatch) => {
            dispatch({
                type: Actions.Login,
                payload: {
                    msg: 'stay conected',
                    userId: user.id,
                    admin: user.admin,
                    authorization: aouthorization,
                    user: user
                }
            })
        }
    }

}



export const getTripsFromServer = () => {

    return async (dispatch: Dispatch<Action>) => {
        try {
            const response = await axios.get<ITrip[]>(
                "http://localhost:4000/trips", {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            }
            );
            const trips = response.data;
            dispatch({
                type: Actions.GetTrips,
                payload: { trips }
            })

            localStorage.setItem('trips', JSON.stringify(trips as any));


        }
        catch (err) {
            if (err.response) {
            }
            dispatch({
                type: Actions.ShowError,
                payload: {
                    msg: err.msg
                }
            })
        }
    }
}
// -----------------------SOCKET----------------------------------
export function connectSocketAction() {
    const ws = new WebSocket('ws://localhost:4000');
    return (dispatch: Dispatch<Action>) => {
        ws.addEventListener('open', () => {
            dispatch({
                type: Actions.ConnectSocket,
                payload: {
                    ws: ws
                }
            })

            ws.addEventListener('message', ({ data }) => {
                const action = JSON.parse(data);
                dispatch(action)
            });

        });
    }
}

export function sendInfoBySocket(info: any) {
    return (dispatch: Dispatch<Action>, getState: any) => {
        const { ws } = getState();
        ws.send(JSON.stringify(info));
        ws.addEventListener('message', ({ data }: any) => {
            const action = JSON.parse(data);
            dispatch(action)

        })
    }
}
// --------------------------TRIPS-------------------------------------

export function editTripAction(updatedTrip: ITrip) {
    return async (dispatch: Dispatch) => {
        try {
            await axios.post<any>('http://localhost:4000/trips/editTrip',
                {
                    updatedTrip: updatedTrip
                },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    }
                }
            );


        }
        catch (err) {
            dispatch({
                type: Actions.ShowError,
                payload: {
                    msg: 'SORRY, THERE IS NO RESPONSE FROM SERVER, WAKE UP'
                }
            })
        }
    }
}

export function sendNewTripToServer(newTrip: ITrip) {
    return async (dispatch: Dispatch) => {
        try {
            await axios.post<any>('http://localhost:4000/trips/addNewTrip',
                {
                    trip: newTrip
                }, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
        }
        catch (err) {

            dispatch({
                type: Actions.ShowError,
                payload: {
                    msg: 'the trip is allready exist'
                }
            })
        }
    }
}


export function deleteTripAction(name: string, id: string) {
    return async (dispatch: Dispatch) => {
        try {
            await axios.delete<any>(`http://localhost:4000/trips/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    }
                })
        }
        catch (err) {
            dispatch({
                type: Actions.ShowError,
                payload: {
                    msg: 'SORRY, THERE IS NO RESPONSE FROM SERVER, TRY LATTER'
                }
            })
        }

    }
}

export function followTripAction(trip_id: string, user_id: any) {

    return async (dispatch: Dispatch) => {
        try {
            const response = await axios.post<any>('http://localhost:4000/trips/follow', {
                trip_id: trip_id,
                user_id: user_id
            }, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
            const action = response.data.action;


            dispatch(action);
        }
        catch (err) {

            dispatch({
                type: Actions.ShowError,
                payload: {
                    msg: 'SORRY, THERE IS NO RESPONSE FROM SERVER, TRY LATTER'
                }
            })
        }
    }
}

export function unfollowTripAction(user_id: string, trip_id: string) {
    return async (dispatch: Dispatch) => {
        try {
            const response = await axios.post<any>('http://localhost:4000/trips/unfollow', {
                user_id, trip_id
            }, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
            const action = response.data.action;
            dispatch(action);
        }
        catch (err) {
            dispatch({
                type: Actions.ShowError,
                payload: {
                    msg: 'SORRY, THERE IS NO RESPONSE FROM SERVER, TRY LATTER'
                }
            })
        }
    }
}



export function closeMessageAction() {
    return (dispatch: Dispatch) => {
        dispatch({
            type: Actions.CloseMessage,
            payload: {}
        })
    }
}

export function clearErrorAction() {
    return (dispatch: Dispatch) => {
        dispatch({
            type: Actions.ClearError,
            payload: {}
        })
    }
}

export function openNewTripFormAction() {
    return (dispatch: Dispatch) => {
        dispatch({
            type: Actions.OpenNewTripForm,
            payload: {}
        })
    }
}

export function closeNewTripAction() {
    return (dispatch: Dispatch) => {
        dispatch({
            type: Actions.CloseNewTripForm
        })
    }
}

export function closeEditFormAction() {
    return (dispatch: Dispatch) => {
        dispatch({
            type: Actions.CloseEditTripForm
        })
    }
}



// -------------------------USER------------------------
export interface userForLocalStorageProps {
    id: number,
    admin: boolean,
    userName: string,
    password: string,
    followedTrips: ITrip[],
    authorization: string
}

export const logIn = (username: string, userPassword: string) => {
    return async (dispatch: Dispatch<Action>) => {
        try {
            const response = await axios.post<any>('http://localhost:4000/user/login', {
                username,
                userPassword
            });

            const data = response.data;
            const user_from_data = data.user;



            const isPasswordMatch = response.data.response
            if (!isPasswordMatch) {
                return dispatch({
                    type: Actions.ShowError,
                    payload: {
                        msg: "user name and password don't match"
                    }
                })
            }
            const token = response.data.token;
            const userId = response.data.user._id;
            const admin = response.data.user.admin;
            const followedTrips = response.data.user.followed_trips;
            const user = response.data.user
          
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user as any));

            if (admin) {
                await dispatch({
                    type: Actions.Login,
                    payload: {
                        msg: response.data.msg,
                        userId: userId,
                        followedTrips: followedTrips,
                        admin: true,
                        authorization: 'admin',
                        user: user_from_data
                    }
                })
            };
            if (!admin) {
                await dispatch({
                    type: Actions.Login,
                    payload: {
                        msg: response.data.msg,
                        userId: userId,
                        followedTrips: followedTrips,
                        admin: false,
                        authorization: 'user',
                        user: user_from_data
                    }
                })

            }
        }
        catch (err) {
        }
    }
}

export const sendUserToServer = (firstName: string, secondName: string, username: string, userPassword: string) => {
    return async (dispatch: Dispatch<Action>) => {
        try {
            const response = await axios.post<any>('http://localhost:4000/user/registrate', {
                firstName,
                secondName,
                username,
                userPassword,
            });
            const token = response.data.token;
            const user = response.data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', user)
            dispatch({
                type: Actions.Registration,
                payload: {
                    msg: "user is created",
                    user: user,
                    authorization: 'user',
                    userName: username
                }
            })
        }
        catch (e) {
            dispatch({
                type: Actions.ShowError,
                payload: {
                    msg: "user is exist"
                }
            })
        }
    }
}


export function logOutAction() {
    clearToken();
    localStorage.removeItem('user');
    localStorage.removeItem('state');
    localStorage.removeItem('trips');
    return (dispatch: Dispatch) => {
        dispatch({
            type: Actions.LogOut,
            payload: {}
        })
    }
}

// -------------------------------ADMIN-----------------------------
export function enterToAdminPageAction() {
    return (dispatch: Dispatch<Action>) => {
        dispatch({
            type: Actions.EnterToAdminPage,
            payload: {
                msg: 'ADMIN IN'
            }
        })
    }
}



export function openModalAction(tripTpEdit: {}) {
    return (dispatch: Dispatch<Action>) => {

        dispatch({
            type: Actions.OpenModal,
            payload: {
                editTrip: tripTpEdit
            }
        })
    }
}

// ----------------------CHARTS------------------------

export function showChartsAction() {
    return (dispatch: Dispatch<Action>) => {
        dispatch({
            type: Actions.ShowCharts,
            payload: {}
        })
    }
}

export function getDataAction(trips: ITrip[]) {
    const temp: any[] = [];
    const tripNames: string[] = [];
    const totalFollowers: number[] = [];
  
    trips.map(trip => {
        if (trip.followers > 0) {
            temp.push(trip);
            tripNames.push(trip.name);
            totalFollowers.push(trip.followers)
        }
    })

    return (dispatch: Dispatch<Action>) => {
        dispatch({
            type: Actions.ChartsData,
            payload: {
                followedTripTotal: temp,
                tripNames: tripNames,
                followers: totalFollowers,
            }
        })
    }
}