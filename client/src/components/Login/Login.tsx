import React, { ChangeEvent, FormEvent } from 'react';
import { connect } from 'react-redux';
import { clearErrorAction, connectSocketAction, logIn } from '../../redux/actions';
import { State } from '../../redux/store';
import { ErrorComponent } from '../ErrorComponent/ErrorComponent';
import { Navigation } from '../Navigation/Navigation';
import './Login.css'

interface LoginProps {
    logeIndetails(
        username: string,
        userPassword: string,
    ): void,
    authorization: string,
    connectSocket(): void,
    clearError(): void;
}

interface LoginState {
    username: string,
    userPassword: string,
}

class _Login extends React.Component<LoginProps, LoginState> {
    state: LoginState = {
        username: '',
        userPassword: '',
    }
    render() {
        const { username, userPassword } = this.state;
        return (
            <div onClick={this.onClickInput} id='login-page'>
                <Navigation />
                <div className="login_div">
                    <h1 className="login-title"> LOG IN</h1>
                    <form id='login-form' onSubmit={this.submitForm}>
                        <p>Nick Name</p>
                        <input name="username" value={username} onChange={this.getDetails} required /><br></br>
                        <p>Password</p>
                        <input name="userPassword" value={userPassword} type="password" onChange={this.getDetails} required /><br></br>
                        <button className='login-btn' type="submit">
                            Log In
                    </button>
                    </form>
                    <ErrorComponent />
                </div>
         

            </div>
        )
    }

    getDetails = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        this.setState({
            [name]: value,
        } as any)
    };

    submitForm = (e: FormEvent) => {
        e.preventDefault();
        const { username, userPassword } = this.state;
        const { logeIndetails, connectSocket } = this.props;
        logeIndetails(username, userPassword);
        connectSocket();
    }

    onClickInput = () => {
        const { clearError } = this.props;
        clearError()
    }
}
const mapStateToProps = (state: State) => ({
    authorization: state.authorization
})

const mapDispatchToProps = {
    logeIndetails: logIn,
    connectSocket: connectSocketAction,
    clearError: clearErrorAction
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login)
