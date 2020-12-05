import React from 'react';
import { connect } from 'react-redux';
import { ITrip } from '../../../../server/src/collections/trip';
import { MessageComponent } from '../MessageComponent/MessageComponent';
import { Navigation } from '../Navigation/Navigation';
import './AdminPage.css';
import { State } from '../../redux/store';
import { openNewTripFormAction } from '../../redux/actions';
import { NewTrip } from '../../NewTrip/NewTrip';
import { ModalComponent } from '../ModalComponent/ModalComponent'
import { TripCard } from '../TripCard/TripCard';
import { IUser } from '../../../../server/src/collections/user';



interface AdminPageProps {
    adminTrips: ITrip[],
    modal: boolean,
    tripToEdit: {} | null,
    openNewTripForm(): void,
    onNewTrip: boolean,
    isNewMessage: boolean,
    trips: ITrip[],
    user: IUser | null,

}

class _AdminPage extends React.Component<AdminPageProps> {
    render() {
        const { trips, modal, isNewMessage, onNewTrip, user } = this.props;
        return (
            <div id="admin-page">

                {isNewMessage ? <MessageComponent /> : null}
                <Navigation />
                <h1 id='admin-page-title'>WELCOME BACK ADMIN</h1>
                {onNewTrip ? <NewTrip /> : null}
                {modal ? <ModalComponent /> : null}
                {trips.map(trip => <TripCard follow={false} key={trip._id} {...trip} />)}
            </div>
        )
    }


    onAddBtnClick = () => {
        const { openNewTripForm } = this.props;
        openNewTripForm();
    }
}

const mapStateToProps = (state: State) => ({
    adminTrips: state.trips,
    modal: state.modal,
    tripToEdit: state.tripToEdit,
    onNewTrip: state.onNewTrip,
    isNewMessage: state.isNewMessage,
    trips: state.trips,
    user: state.user


})

const mapDistachToProps = {
    openNewTripForm: openNewTripFormAction,
}
export const AdminPage = connect(mapStateToProps, mapDistachToProps)(_AdminPage);


