import React from 'react';
import { connect } from 'react-redux';
import './UserPage.css'
import { ITrip } from '../../../../server/src/collections/trip';
import { Navigation } from '../Navigation/Navigation';
import { MessageComponent } from '../MessageComponent/MessageComponent';
import { TripCard } from '../TripCard/TripCard';
import { State } from '../../redux/store';
import { IUser } from '../../../../server/src/collections/user';

interface UserPageProps {
    followedTrips: ITrip[],
    isLoggedIn: boolean,
    admin: boolean,
    trips: ITrip[],
    user: IUser | null,
    isNewMessage: boolean,
    followed_trips: string[] | null

}

class _UserPage extends React.Component<UserPageProps> {
    render() {
        const { trips, isLoggedIn, user, isNewMessage, followedTrips } = this.props;
        const unfollowedTrips = trips.filter(({ name: id1 }) => !followedTrips.some(({ name: id2 }) => id2 === id1));


        return (
            <div id="user-page">
                <Navigation />
                {isNewMessage ? <MessageComponent /> : null}
                <h1 id='user-page-title'>WELLCOME , {user!.first_name.toUpperCase()}</h1>

                {followedTrips.map((trip, i) => <TripCard follow={true} key={i}{...trip} />)}

                {unfollowedTrips.map((trip, i) => <TripCard follow={false} key={i}{...trip} />)}
            </div>
        )
    }
}

const mapStateToProps = (state: State) => ({
    followed_trips: state.user!.followed_trips,
    followedTrips: state.followedTrips,
    isLoggedIn: state.isLoggedIn,
    admin: state.admin,
    trips: state.trips,
    user: state.user,
    isNewMessage: state.isNewMessage
})

export const UserPage = connect(mapStateToProps)(_UserPage)