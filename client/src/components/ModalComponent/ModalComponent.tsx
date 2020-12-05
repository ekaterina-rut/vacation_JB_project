import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import './ModalComponent.css';
import moment from 'moment';
import { ITrip } from '../../../../server/src/collections/trip';
import { State } from '../../redux/store';
import { closeEditFormAction, editTripAction } from '../../redux/actions';

interface ModalComponentProps {
    tripToEdit: ITrip | any,
    editTrip(arg: {}): void,
    closeEditForm(): void
}

class _ModalComponent extends React.Component<ModalComponentProps>{
    state = {
        editMode: false
    }
    render() {
        const { tripToEdit } = this.props;
        moment(tripToEdit.startDate).format('DD-MM-YYYY');

        return (
            <div >
                <div className='admin-edit-card'>
                    <form id='edit-form' onSubmit={this.onSaveClick}>
                        <button className='close-btn' onClick={this.onCloseBtnClick}></button>
                        <p>Edit Trip Name:
                            <input name="name" type="text" defaultValue={tripToEdit.name} />
                        </p>
                        <p>Edit Trip Location:
                            <input name="contry" type="text" defaultValue={tripToEdit.contry} />
                        </p>
                        <p>Edit Trip Description:
                        <textarea className='edit-description' name="description" defaultValue={tripToEdit.description} />
                        </p>
                        <p> Change a picture:
                        <input name="img" defaultValue={tripToEdit.img} type="text" />
                        </p>
                        <p> Edit price:
                            <input name="price" type="number" defaultValue={tripToEdit.price} />
                        </p>
                        <p>Edit STart Date:
                        <input name="start_date" type="date" defaultValue={tripToEdit.start_date} required />
                        </p>
                        <p>Edit End Date:
                        <input name="end_date" type="date" defaultValue={tripToEdit.end_date} required />
                        </p>
                        <button className='save-btn' type="submit">Save</button>
                    </form>
                </div>
            </div>
        )
    }
    onSaveClick = (e: any) => {
        e.preventDefault();
        const { tripToEdit, editTrip, closeEditForm } = this.props;
        const _id = tripToEdit._id
        const form = e.target;
        const name = form.name.value;
        const contry = form.contry.value;
        const description = form.description.value;
        const price = form.price.value;
        const img = form.img.value;
        const start_date = new Date(form.start_date.value);
        const end_date = new Date(form.end_date.value);
        const updatedTrip = {

            _id,
            name,
            contry,
            description,
            price,
            img,
            startDate: moment(start_date).format('YYYY-MM-DD HH:mm'),
            endDate: moment(end_date).format('YYYY-MM-DD HH:mm')
        }
        editTrip(updatedTrip);
        closeEditForm();
    }

    onCloseBtnClick = () => {
        const { closeEditForm } = this.props;
        closeEditForm();
    }


    changeEditMode = () => {
        this.setState({
            editMode: !this.state.editMode
        })
    }

    onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const key = e.target.name;
        this.setState({
            [key]: e.target.value
        });
    }
}

const mapStateToProps = (state: State) => ({
    tripToEdit: state.tripToEdit
})

const matDispatchToProps = {
    editTrip: editTripAction,
    closeEditForm: closeEditFormAction
}

export const ModalComponent = connect(mapStateToProps, matDispatchToProps)(_ModalComponent)