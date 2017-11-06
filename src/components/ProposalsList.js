import React, { Component } from 'react'

export default class ProposalsList extends Component {
  constructor(props) {
    super(props)
  }

  onVoteClicked(event) {
    const button = event.target
    
  }

  render() {
    return (
      <div>
        <h3>Propuestas</h3>
        <ul>
          {this.props.proposals.map((proposal, index) => <li key={index}>{proposal} <button index={index} onClick={this.onVoteClicked}>Vote</button></li>)}
        </ul>
      </div>
    )
  }
}
