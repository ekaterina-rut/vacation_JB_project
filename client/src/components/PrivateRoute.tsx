
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteProps } from 'react-router-dom';
import { AdminPage } from './AdminPage/AdminPage';
import { State } from './../redux/store';
import { UserPage } from './UserPage/UserPage';

interface PrivateRouteProps extends RouteProps {
    authLevel: string,
    isLoggedIn: boolean;
    isAdmin: boolean;
}



class _PrivateRoute extends React.Component<PrivateRouteProps>{
    render() {
        const { isLoggedIn, isAdmin, authLevel, path , ...rest } = this.props;
        if (!isLoggedIn) {
            return <Redirect to="/login" />
             
        }

        if (!isAdmin && authLevel === 'user') {
            return<UserPage/>
        }
    
        if (isAdmin && authLevel === 'admin') {
            return <AdminPage/>
        }     
    }
}


const mapStateToProps = (state: State) => ({
    isLoggedIn: state.isLoggedIn,
    isAdmin: state.admin,
});

export const PrivateRoute = connect(mapStateToProps)(_PrivateRoute);
