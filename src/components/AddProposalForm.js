import React, { Component } from 'react'

export default class AddProposalForm extends Component {
    
      constructor(props) {
        super(props)
        this.state = {
          proposalName: '',
        }
      }
    
      onProposalInputNameChange(event) {
        const { target } = event
        const { value } = target
        this.setState({
          ...this.state,
          proposalName: value,
        })
      }
    
      onAddButtonClick(event) {
        const { proposalName } = this.state
        const { onProposalAdded } = this.props
        if (proposalName !== "") {
          onProposalAdded(proposalName)
          this.clearForm()
        }
      }
    
      clearForm() {
        this.setState({
          proposalName: '',
        })
      }
    
      render() {
        return (
          <div>
            <input type="text" value={this.state.proposalName} onChange={this.onProposalInputNameChange.bind(this)} placeholder="Nueva propuesta" />
            <br/><br/>
            <button onClick={this.onAddButtonClick.bind(this)}>Agregar</button>
          </div>
        )
      }
    }