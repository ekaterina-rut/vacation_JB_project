import React, { ChangeEvent, FormEvent } from 'react'
import { connect } from 'react-redux';
import './Registration.css';
import { Navigation } from '../Navigation/Navigation';
import { clearErrorAction, sendUserToServer } from '../../redux/actions';
import { ErrorComponent } from '../ErrorComponent/ErrorComponent';

interface RegisrationProps {
    userDetails(firstName: string, secondName: string, userPassword: string, userName: string): void,
    clearError(): void

}

interface RegistrationState {
    firstName: string,
    secondName: string,
    userName: string,
    userPassword: string,
}

class _Registration extends React.Component<RegisrationProps, RegistrationState> {
    state: RegistrationState = {
        firstName: '',
        secondName: '',
        userName: '',
        userPassword: ''
    }
    render() {
        const { secondName, firstName, userName, userPassword } = this.state
        return (
            <div onClick={this.onClickFuction} id='registration-page'>
                <Navigation />
                <form id='registration-form' onSubmit={this.submitForm}>
                    <h3 id='registration-title'>REGISTRATION</h3>
                    <p>First Name</p>
                    <input name="firstName" value={firstName} onChange={this.getDetails} /><br></br>
                    <p>Second Name</p>
                    <input name="secondName" value={secondName} onChange={this.getDetails} /><br></br>
                    <p>Nick Name</p>
                    <input name="userName" value={userName} onChange={this.getDetails} /><br></br>
                    <p>Password</p>
                    <input name="userPassword" type="password" value={userPassword} onChange={this.getDetails} /><br></br>
                    <button id='registration-btn' type="submit">start dreaming</button>
                </form>
                <ErrorComponent />
            </div >
        )
    }

    onClickFuction = () => {
        const { clearError } = this.props;
        clearError();
    }

    getDetails = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        this.setState({
            [name]: value,
        } as any)
    };

    submitForm = (e: FormEvent) => {
        e.preventDefault();
        const { firstName, secondName, userName, userPassword } = this.state;
        const { userDetails } = this.props;
        userDetails(firstName, secondName, userName, userPassword);
    }
}

const mapDispatchToProps = {
    userDetails: sendUserToServer,
    clearError: clearErrorAction
}

export const Registration = connect(undefined, mapDispatchToProps)(_Registration)



