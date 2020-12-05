import {createStore as createReduxStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import { reducer } from './reducer'
import {ITrip} from './../../../server/src/collections/trip'
import {IUser} from './../../../server/src/collections/user'



export interface State {
  ws: WebSocket | null,
  trips: ITrip[],
  msg: string | null,
  isLoggedIn: boolean,
  isGettingTrips: boolean,
  tripsFromServer: boolean,
  followedTrips: ITrip[] | [],
  userId: number | null,
  admin: boolean,
  msgFromSocket: string,
  modal: boolean,
  tripToEdit: ITrip | null,
  onNewTrip: boolean,
  authLevel: string,
  isChartsOn: boolean,
  followedTripsData: any,
  authorization: string,
  isNewMessage: boolean,
  user: IUser | null,
  
  
}


export const initialState: State = {
  authorization: '',
  ws: null,
  trips: [],
  msg: null,
  isLoggedIn: false,
  isGettingTrips: false,
  tripsFromServer: false,
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
  isNewMessage: false,
  user: null,


}




export interface Action {
  type: string;
  payload: Record<string, any>;
}

export enum Actions {
  GetTrips = 'GET_TRIPS',
  GetTripsPanding = 'GET_TRIPS_PENDING',
  Registration = 'REGISTRATION',
  Login = 'LOGIN',
  GetTripById = 'GET_TRIPS_BY_ID',
  FollowTrip = 'FOLLOW_TRIP',
  UnfollowTrip = 'UNFOLLOW_TRIP',
  AddTrip = 'ADD_TRIP',
  UpdateTrip = 'TRIP_UPDATE',
  DeletTrip = 'DELETE_TRIP',
  LogOut = 'lOG_OUT',
  ShowError = 'ERROR',
  GetReport = 'GET_REPORT',
  ConnectSocket = 'CONNECT_SOCKET',
  EnterToAdminPage = 'ENTER_TO_ADMIN_PAGE',
  NewUpdate = 'NEW_UPDATE',
  OpenModal = 'OPEN_MODAL',
  CloseEditTripForm = 'CLOSE_EDIT_TRIP_FORM',
  OpenNewTripForm = 'OPEN_NEW_TRIP_FORM',
  CloseNewTripForm = 'CLOSE_NEW_TRIP_FORM',
  ShowCharts = 'SHOW_CHARTS',
  ChartsData = 'CHARTS_DATA',
  CloseMessage = 'CLOSE_MESSAGE',
  ClearError = 'CLEAR_ERROR',
  UpdateLocalStorage = 'UNDATE_LOCAL_STORAGE'
}



export function createStore() {
    const logger = createLogger();
    const middleware = composeWithDevTools(applyMiddleware(logger, thunk));
    return createReduxStore(reducer, middleware)
}

