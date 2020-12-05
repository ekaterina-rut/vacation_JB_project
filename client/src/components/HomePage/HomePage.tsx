import React from 'react'
import {ITrip} from './../../../../server/src/collections/trip'
import {State} from './../../redux/store'
import { connect } from 'react-redux'
import './HomePage.css'
import { Navigation } from '../Navigation/Navigation';
import { TripCard } from '../TripCard/TripCard'

interface HomePageProps {
    trips: ITrip[],
}

class _HomePage extends React.Component<HomePageProps> {
    render() {
        const { trips } = this.props
        return (
            <div id="homePage">
                <Navigation />
               
                {trips.map(trip => <TripCard follow={false} key={trip._id} {...trip} />)}

            </div>
        )
    }
}

const mapStateToProps = (state: State) => ({
    trips: state.trips
})

export const HomePage = connect(mapStateToProps)(_HomePage)