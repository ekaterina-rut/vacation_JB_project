import React from 'react'
import { State } from './../../redux/store';
import { connect } from 'react-redux'
import './MessageComponent.css'
import { closeMessageAction } from './../../redux/actions'

interface MessageComponentProps {
    msg: string,
    closeMessage(): void;
}

class _MessageComponent extends React.Component<MessageComponentProps> {
    render() {
        const { msg } = this.props
        return (
            <div id='message-component'>
                    <button className='close-btn' onClick={this.onClickCloseBtn}></button>
                <p>
                    {msg}
                </p>
            </div>
        )
    }
    onClickCloseBtn = () => {
        const { closeMessage } = this.props;
        closeMessage();
    }
}

const mapStateToProps = (state: State) => ({
    msg: state.msgFromSocket
})

const mapDispatchToProps = {
    closeMessage: closeMessageAction
}

export const MessageComponent = connect(mapStateToProps, mapDispatchToProps)(_MessageComponent)