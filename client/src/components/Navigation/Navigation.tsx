import React from 'react'
import {State} from '../../redux/store'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './Navigation.css'
import {ITrip} from '../../../../server/src/collections/trip'
import { logOutAction, openNewTripFormAction } from '../../redux/actions'
import { IUser } from '../../../../server/src/collections/user'


interface PrivetPageProps {
    isLoggedin: boolean,
    user: IUser | null,
    logOut(): void,
    admin: boolean,
    adminTrips: ITrip[],
    modal: boolean,
    tripToEdit: {} | null,
    openNewTripForm(): void,
    onNewTrip: boolean,
}

class _Navigation extends React.Component<PrivetPageProps> {
    render() {
        const {  admin, isLoggedin } = this.props
        return (
            <div>
                <nav className='nav-for-charts'>
                    <ul id='ul-nav' className='ul-for-charts'>
                        <li>
                            {(!isLoggedin) ? <Link to='/'>Home Page</Link> : null}

                        </li>
                        <li>
                            {(isLoggedin) ? <Link to='/profile'>Trips</Link> : null}
                        </li>
                        <li>
                            {isLoggedin && admin ? <Link to='/charts'>Total Dreamers</Link> : null}
                        </li>
                        <li>
                            {(!isLoggedin) ? <Link to='/login'>Log In</Link> : null}
                        </li>
                        <li>
                            {(!isLoggedin) ? <Link to='/register'>Join Us</Link> : null}
                        </li>
                        <li>
                            {(isLoggedin && admin) ? <button className='control-btn' onClick={this.onAddBtnClick}>Add New Trip</button> : null}
                        </li>
                      
                        <li>
                            {isLoggedin ? <button className='control-btn' onClick={this.onLogoutClick}>Log Out</button> : null}
                        </li>
                    </ul>
                </nav >
            </div >
        )

    }
    onLogoutClick = () => {
        const { logOut } = this.props;
        logOut();
    }


    onAddBtnClick = () => {
        const { openNewTripForm } = this.props;
        openNewTripForm();

    }
}

const mapStateToProps = (state: State) => ({
    isLoggedin: state.isLoggedIn,
    user: state.user,
    admin: state.admin,
    adminTrips: state.trips,
    modal: state.modal,
    tripToEdit: state.tripToEdit,
    onNewTrip: state.onNewTrip,

})

const mapDispatchToProps = {
    logOut: logOutAction,
    openNewTripForm: openNewTripFormAction,
}

export const Navigation = connect(mapStateToProps, mapDispatchToProps)(_Navigation)