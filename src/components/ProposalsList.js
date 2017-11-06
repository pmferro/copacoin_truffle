import React, { Component } from 'react'

export default class ProposalsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      proposalName: '',
    } 
  }

  onVoteClicked(event) {
    const { proposalName } = this.state
    const { onVote } = this.props
    //if (proposalName !== "") {
      onVote([proposalName])
      this.clearForm()
    //}
  }

  render() {
    return (
      <div>
        <h3>Propuestas</h3>
        <ul>
          {this.props.proposals.map((proposal, index) => <li key={index}>{proposal} <button index={index} onClick={this.onVoteClicked.bind(this)}>Vote</button></li>)}
        </ul>
      </div>
    )
  }
}
