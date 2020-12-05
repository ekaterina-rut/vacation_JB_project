import React from 'react';
import './Charts.css';
import { connect } from 'react-redux';
import {Bar} from 'react-chartjs-2'
import { ITrip } from '../../../../server/src/collections/trip';
import { Navigation } from '../Navigation/Navigation';
import { State } from '../../redux/store';
import { getDataAction } from '../../redux/actions';

interface ChartsProps {
    trips: ITrip[],
    followedTrips: ITrip[];
    getData(trips: ITrip[]): void;
    followedTripsData: any
}




export class _Charts extends React.Component<ChartsProps> {
    componentDidMount() {
        const { trips, followedTrips, getData } = this.props;
        getData(trips);
    }
    render() {
        const { followedTripsData } = this.props;
        return (
            <div id='charts-body'>
                <div id='charts'>
                    <Navigation />
                  
                    <Bar
                        data={followedTripsData}
                        options={{
                            title: {
                                display: true,
                                text: 'The Most Followed Trips',
                                colorScale: 'black',
                                fontSize: 25,
                                fontColor: "black"
                            }
                        }}
                    />
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state: State) => ({
    trips: state.trips,
    followedTrips: state.followedTrips,
    followedTripsData: state.followedTripsData
})

const mapDispatchToProps = {
    getData: getDataAction
}

export const Charts = connect(mapStateToProps, mapDispatchToProps)(_Charts)

