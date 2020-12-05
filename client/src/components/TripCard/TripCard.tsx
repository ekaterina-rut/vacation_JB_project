import React from 'react';
import { State } from './../../redux/store'
import { connect } from 'react-redux';
import { deleteTripAction, followTripAction, openModalAction, unfollowTripAction } from './../../redux/actions';
import './TripCard.css';
import moment from 'moment';
import { IUser } from '../../../../server/src/collections/user';

export interface TripProps {
    _id: string;
    name: string;
    contry: string;
    description: string;
    img: string;
    start_date: Date;
    end_date: Date;
    price: number;
    // follow: boolean;
    user_id: string;
    isLoggedIn: boolean;
    authorization: string;
    followers: number;
    followTrip(trip_id: string, user_id: any): void;
    setIsOpen?: any,
    openModal(tripToEdit: {}): void,
    deleteTrip(name: string, id: string): void,
    follow: boolean,
    user: IUser | null,
    unfollowTrip(userId: string, tripId: string): void,


}
class _TripCard extends React.Component<TripProps>{
    render() {
        const { follow, isLoggedIn, name, description, contry, img, price, start_date, end_date, authorization, followers } = this.props;
        const formatedstart_date = moment(start_date).format('DD-MM-yyyy');
        const formatedEndtDate = moment(end_date).format('DD-MM-yyyy');
        return (
            <div className='trip-card'>
                {isLoggedIn && authorization === 'admin' ?
                    <button className='delete-btn' onClick={this.deleteBtnClick}></button> : null
                }
                {isLoggedIn && authorization === 'admin' ?
                    <button className='edit-btn' onClick={this.editBtnClick}></button> : null
                }
                <div className='title-name'><label id="label_name">{name.toLocaleUpperCase()}</label></div>
                <img className="trip-img" src={img} alt="#" />
                <h4 id="h4_trip_card">{contry.toLocaleUpperCase()}</h4>
                <div className='description'>{description}</div>
                <p>PRICE: {price}$</p>
                <p>from: {formatedstart_date} to: {formatedEndtDate}</p>
                {(isLoggedIn && authorization === 'admin') && follow ?
                    <p> followers: {followers}</p> :
                    null
                }

                {(isLoggedIn && authorization === 'user') && follow ?
                    <button className='unfollow-btn' onClick={this.unfollowBtnClick} type="button"></button>
                    :
                    null
                }
                {(isLoggedIn && authorization === 'user') && !follow ?
                    <button className='follow-btn' onClick={this.followBtnClick} type="button"></button> :
                    null
                }
            </div>
        )
    }


    followBtnClick = () => {

        const { followTrip } = this.props;
        const { user_id } = this.props;
        const { _id } = this.props;
    
        followTrip(_id, user_id)
    }


    unfollowBtnClick = () => {
        const { unfollowTrip } = this.props;
        const { user, _id } = this.props;
        const user_id = user!._id

        unfollowTrip(user_id, _id)

    }

    editBtnClick = () => {
        const { _id, name, description, contry, img, price, start_date, end_date } = this.props;
        const tripToEdit = {
            name,
            description,
            contry,
            img,
            price,
            start_date,
            end_date,
            _id
        }

        const { openModal } = this.props
        openModal(tripToEdit);
    }

    deleteBtnClick = () => {
        const { name, _id, deleteTrip } = this.props;

        deleteTrip(name, _id)

    }

}

const mapStateToProps = (state: State) => ({
    user_id: state.user?._id,
    isLoggedIn: state.isLoggedIn,
    authorization: state.authorization,
    user: state.user

})

const mapDispatchToProps = {
    followTrip: followTripAction,
    openModal: openModalAction,
    deleteTrip: deleteTripAction,
    unfollowTrip: unfollowTripAction,

}

export const TripCard = connect(mapStateToProps, mapDispatchToProps)(_TripCard)

