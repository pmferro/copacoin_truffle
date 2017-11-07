import React, { Component } from 'react'

export default class ProposalsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: []
    }
  }

  onVoteClicked(event) {
    const { onVote } = this.props
    console.log(this.state)
    if (this.state.values.length !== 0) {
      onVote(this.state.values)
      this.clearForm()
    }
  }

  handleChange(event) {
    let checked = event.target.checked;
    console.log(event.target.id);
    if (checked) {
      this.state.values.push(event.target.id);
    } else {
      var index = this.state.values.indexOf(event.target.id);
      this.state.values.splice(index, 1);
    }
    console.log(this.state.values);
  }

  clearForm() {
    this.setState({
      values: []
    })
  }

  render() {
    return (
      <div>
        <h3>Propuestas</h3>
        <ul>
          {this.props.proposals.map((proposal, index) => <li key={index}>{proposal} <input type="checkbox" id={index} onChange={this.handleChange.bind(this)}/></li>)}
        </ul>
        <button index="vote_button" onClick={this.onVoteClicked.bind(this)}>Vote</button>
      </div>
    )
  }
}
