import React from 'react'
import { connect } from 'react-redux'
import { State } from '../../redux/store'
import './ErrorComponent.css'

interface ErrorPros {
    msg: string | null
}

class _Error extends React.Component<ErrorPros> {

    render() {
        const { msg } = this.props
        return (
            <div id='error-component'>{msg}</div>
        )
    }
}

const mapStateToProps = (state: State) => ({
    msg: state.msg
})

export const ErrorComponent = connect(mapStateToProps)(_Error)