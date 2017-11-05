import React, { Component } from 'react'
import RecuperarClaseContract from '../build/contracts/RecuperarClase.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const Contract = props => {
  const { contract } = props
  const abiMethods = contract.abi.map(a => a.name).filter(m => m !== undefined).join(', ')
  return (
    <div>
      <h3>Contract Info</h3>
      <div className="pure-g">
        <div className="pure-u-1-1"><b>Address:</b> {contract.address}</div>
        <div className="pure-u-1-1"><b>API:</b> {abiMethods}</div>
      </div>
    </div>
  )
}

const ContractState = props => {
  return (
    <div>
      <h3>Contract State</h3>
      <div className="pure-g">
        <div className="pure-u-1-1"><b>Numero de Propuestas:</b> {props.getProposalsCount.toString()}</div>
        <div className="pure-u-1-1"><b>Propuesta Ganadora (indice):</b> {props.getWinningProposal.toString()}</div>
        <div className="pure-u-1-1">
          <ul>
            <table className="pure-table">
              <thead>
                  <tr>
                      <th>From</th>
                      <th>Value</th>
                      <th>Transaction</th>
                      <th>Block Number</th>
                  </tr>
              </thead>

              <tbody>
                  { props.logs.map(log => {
                      return (
                        <tr key={log.transactionHash}>
                          <td>{log.args._from}</td>
                          <td>{log.args._value.toString()}</td>
                          <td>{log.transactionHash}</td>
                          <td>{log.blockNumber}</td>
                        </tr>
                      )
                    })
                  }
              </tbody>
          </table>
          </ul>
        </div>
      </div>
    </div>
  )
}

class ContractUpdate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: undefined
    }
  }

  validateInput(val) {
    const parsed = parseInt(val, 0)
    if(isNaN(parsed) || parsed < 0) this.setState({error: "Value should be greater or equal than zero"})
    else {
      this.setState({ error: undefined });
      this.refs.input.value = "";
      this.props.onValidInput(val)
    }
  }

  errorLabel() {
    if(this.state.error) return (<label>{this.state.error}</label>)
  }

  render() {
    return (
      <div>
        <h3>Contract Actions</h3>
        <div className="pure-g">
          <div className="pure-u-1-1">
            <div className={`input-group ${this.state.error ? "error" : ""}`}>
              <label>Number *</label>						
              <input type="number" ref="input"/>
              <div className="error-message">{this.errorLabel()}</div>
            </div>
          </div>
          <div className="pure-u-1-1">
            <button disabled={this.props.disabled} className="button-warning pure-button" onClick={() => this.validateInput.bind(this)(this.refs.input.value)}>Update!</button>
          </div>
        </div>
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      contractData: null,
      contract: null,
      logs: [],
      web3: null
    }
  }

  async refreshContractData() {
    const contractData = await this.getContractData(this.state.contract);
    this.setState({
      contractData
    })
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    const getSenderAccount = (web3) => {
      const promise = new Promise( (resolve, reject) => {
        web3.eth.getAccounts( (e, accounts) => {
          if(e) reject(e);
          else resolve(accounts[0]);
        });
      });
      return promise;
    }

    const initialize = async () => {
      const { web3 } = await getWeb3
      const contract = await this.instantiateContract(web3);
      const sender = await getSenderAccount(web3);

      const self = this;
      const updateLogs = (error, logs) => {
        self.setState({
          logs: self.state.logs.concat([logs])
        })
        self.refreshContractData();
      };

      const filter = contract.Updated({}, {fromBlock: 0, toBlock: 'latest'});
      filter.watch(updateLogs);
      this.setState({
        contract,
        web3,
        sender
      });
      this.refreshContractData();
    }

    initialize().catch(err => {
      console.log('Error initializing: ', err)
    })
  }

  async getContractData(recuperarClaseInstance) {
    const proposalsCount = await recuperarClaseInstance.getProposalsCount();
    const winningProposal = await recuperarClaseInstance.getWinningProposal();

    return {
      proposalsCount,
      winningProposal
    }
  }

  async instantiateContract(web3) {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    const contract = require('truffle-contract');
    const recuperarClase = contract(RecuperarClaseContract);
    recuperarClase.setProvider(web3.currentProvider);

    const recuperarClaseInstance = await recuperarClase.deployed();
    return recuperarClaseInstance;
  }

  updateVal(val) {
    this.setState({ sendingTx: true })
    this.state.contract
      //.voteProposal(val) //.voteProposal(val, {from: this.state.sender})
      .addProposal("Martes 7")
      .addProposal("Viernes 10")
      .then(() => {
        this.setState({ sendingTx: false })
      })
  }

  render() {
    if(!this.state.contractData) return (<h1>Loading ...</h1>);

    const {contractData, contract, logs, sender} = this.state;
    
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">RecuperarClase.sol</a>
        </nav>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Let's do some coding!</h1>
              <p>This web app interacts with a contract named RecuperarClase.sol:</p>
              <ul>
                <li>Anyone can store a value calling set(value)</li>
                <li>Stored value can be queried using get(value)</li>
                <li>Everytime a value is changed a counter is incremented by 1</li>
                <li>Call count can be queried by getCallCount()</li>
              </ul>
              <p><i>The code is based on <a href="http://truffleframework.com/boxes/react">the React Truffle box</a>.</i></p>
              <h2>Recuperar Clase</h2>
              <p>Sender is: {sender}</p>

            </div>
          </div>
        </main>
      </div>
    );
  }
}
export default App