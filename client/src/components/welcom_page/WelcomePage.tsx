import React from 'react';
import { ITrip } from './../../../../server/src/collections/trip'
import { connect } from 'react-redux';
import { getTripsFromServer, enterToAdminPageAction,  connectSocketAction } from './../../redux/actions';
import { State } from './../../redux/store';
import { Route, Redirect, Switch } from 'react-router-dom'
import { PrivateRoute } from './../PrivateRoute';
import { MessageComponent } from './../MessageComponent/MessageComponent';
import { checkLocalStorageAction } from '../../redux/actions';
import { HomePage } from '../HomePage/HomePage';
import { Registration } from '../Registration/Registration';
import { Login } from '../Login/Login';
import { Charts } from '../Charts/Charts';


interface WelcomePageProps {
    trips: ITrip[],
    getTrip(): void,
    isLoggedIn: boolean,
    enterToAdminPage(): void,
    admin: boolean,
    modal: boolean,
    authorization: string,
    isNewMessage: Boolean,
    checkLocalStorage(): void,
    connectSocket(): void,
}

class _WelcomePage extends React.Component<WelcomePageProps> {
    async componentDidMount() {
        const { getTrip, checkLocalStorage, connectSocket } = this.props;
        await getTrip();
        checkLocalStorage();
        connectSocket();
    }
    render() {
        const { admin, isLoggedIn, authorization, isNewMessage } = this.props;
        return (
            <div id="welcomePage">
                {isNewMessage ? <MessageComponent /> : null}
                {isLoggedIn ? <Redirect to='/profile' /> : null}
                <Switch>
                    <Route exact path='/' component={HomePage} />
                    {(isLoggedIn && admin) ? <Route exact path='/charts' component={Charts} /> : null}
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Registration} />
                    <PrivateRoute authLevel={authorization} path='/profile' />
                </Switch>
            </div>
        )
    }
}



const mapStateToProps = (state: State) => ({
    authorization: state.authorization,
    trips: state.trips,
    isLoggedIn: state.isLoggedIn,
    admin: state.admin,
    modal: state.modal,
    isNewMessage: state.isNewMessage
})

const mapDispatchToProps = {
    getTrip: getTripsFromServer,
    enterToAdminPage: enterToAdminPageAction,
    checkLocalStorage: checkLocalStorageAction,
    connectSocket: connectSocketAction,
}

export const WelcomePage = connect(mapStateToProps, mapDispatchToProps)(_WelcomePage)