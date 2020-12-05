import React, { ChangeEvent, FormEvent } from 'react';
import { connect } from 'react-redux';
import { closeNewTripAction, sendNewTripToServer } from '../redux/actions';
import { State } from '../redux/store';
import './NewTrip.css';

interface NewTripProps {
    addNewTrip(newTrip: {}): void,
    closeNewTrip(): void,
    isNewMessage: boolean,
}

interface NewTripState {
    name: string;
    description: string;
    location: string;
    price: number;
    startDate: Date | null;
    endDate: Date | null;
    image: string;
    file: {} | null
}

export class _NewTrip extends React.Component<NewTripProps>{
    state: NewTripState = {
        name: '',
        description: '',
        location: '',
        price: 0,
        startDate: null,
        endDate: null,
        image: '',
        file: null

    }
    render() {
        return (
            <div id='new-trip-div'>
                <form id='new-trip-form' onSubmit={this.onSubmitForm}>
                    <button className='close-btn' onClick={this.onClickCloseBtn}></button>
                    <p className='new-trip-label'> name:<br></br>
                        <input className="new-trip-input" name="name" onChange={this.onChange} type="text" required />
                    </p>
                    <p className='new-trip-label'>location:<br></br>
                        <input className="new-trip-input" name="location" onChange={this.onChange} type="text" required />
                    </p>
                    <p className='new-trip-label'>description:<br></br>
                        <textarea id="new-trip-text-aria" name="description" onChange={this.onChange} rows={4} cols={50} required>
                        </textarea>
                    </p>
                    <p className='new-trip-label'>add pic http/:<br></br>
                        <input className="new-trip-input" name="image" onChange={this.onChange} type="url"required />
                    </p>
                    <p className='new-trip-label'>price:<br></br>
                        <input className="new-trip-input" name="price" onChange={this.onChange} type="number" required />
                    </p><br></br>
                    <p className='new-trip-label'>from<br></br>
                        <input className="new-trip-input" name="startDate" onChange={this.onChange} type="date" required />
                    </p>
                    <p className='new-trip-label'>to<br></br>
                        <input className="new-trip-input" name="endDate" onChange={this.onChange} type="date" required />
                    </p><br></br>
                    <button className='save-new-trip-btn' type="submit">Save</button><br></br>
                </form>
            </div>

        )
    }
    onSelectedHandle = (e: any) => {
        const pic = e.target.files[0];
        const fileName = e.target.files[0].name;
        this.setState({
            image: fileName,
            file: pic,

        })
    }

    onClickCloseBtn = () => {
        const { closeNewTrip } = this.props;
        closeNewTrip();
    }

    onSubmitForm = (e: FormEvent) => {
        const {closeNewTrip} = this.props;
        e.preventDefault();
        const newTrip = this.state;
        const { addNewTrip } = this.props;
        addNewTrip(newTrip);
        closeNewTrip();
        

    }

    onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const key = e.target.name;
        this.setState({
            [key]: e.target.value
        });
    }
}

const mapStateToProps = (state: State)=>({
    isNewMessage: state.isNewMessage
})

const mapDispatchToProps = {
    addNewTrip: sendNewTripToServer,
    closeNewTrip: closeNewTripAction
}

export const NewTrip = connect(mapStateToProps, mapDispatchToProps)(_NewTrip)