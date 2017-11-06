import React, { Component } from 'react'

export default class LogsList extends Component {

    render() {
        return (
            <div>
                <h3>Logs</h3>
                <ul>
                    { this.props.logs.map((log, index) => <li key={index}>{log}</li>) }
                </ul>
            </div>
        )
    }

}