// Libraries
import React, { Component } from 'react'
import Contract from 'truffle-contract'

// Contract Abis
import Voting from '../build/contracts/Voting.json'

// Utils
import getWeb3 from './utils/getWeb3'
import promisify from './utils/promisify'

// Components
import AddProposalForm from './components/AddProposalForm'
import Header from './components/Header'
import LogsList from './components/LogsList'
import ProposalsList from './components/ProposalsList'

const styles = {
  main: {
    'maxWidth': '80%',
    'margin': '0 auto',
  },
}

export default class App extends Component {
  constructor(props) {
    super(props)

    // Set default state
    this.state = {
      proposals: [],
      logs: [],
      defaultAccount: undefined,
      votingInstance: undefined,
      errorMessage: undefined,
      web3: undefined,
    }
  }

  componentWillMount() {
    this.initialize()
      .then(() => {
        this.watchNewProposals()
        this.watchNewVotes()
      })
  }

  async initialize() {
    const { web3 } = await getWeb3

    // Create voting entity from contract abi
    const voting = Contract(Voting)
    voting.setProvider(web3.currentProvider)

    const accounts = await promisify(web3.eth.getAccounts)
    const defaultAccount = accounts[0]

    const votingInstance = await voting.deployed()

    this.setState({
      ...this.state,
      web3,
      defaultAccount,
      votingInstance,
    })

    this.loadProposals()
  }

  async loadProposals() {
    const { web3, votingInstance, defaultAccount } = this.state

    console.log(`It's about to load proposals from account ${defaultAccount}`)
    console.log(`Voting instance address: ${votingInstance.address}`)

    try {
      const proposalsInBytes32 = await votingInstance.getProposals.call(defaultAccount)
      const proposals = proposalsInBytes32.map((proposal) => web3.toAscii(proposal).replace(/\u0000/g, ''))
      this.setState({
        ...this.state,
        proposals,
      })
    } catch (error) {
      console.log(`Error loading proposals: ${error}`)
    }
  }

  watchNewProposals() {
    const { web3, votingInstance } = this.state

    votingInstance.NewProposal().watch((error, result) => {
      if (error) {
        console.log(`Nooooo! ${error}`)
      } else {
        console.log(`Result ${JSON.stringify(result.args)}`)
        const proposalInBytes32 = result.args.proposal
        const proposal = web3.toAscii(proposalInBytes32).replace(/\u0000/g, '')
        this.setState({...this.state, proposals: [...this.state.proposals, proposal]})
        this.log(`New proposal added: ${proposal}`)
      }
    })
  }

  watchNewVotes() {
    const { web3, votingInstance } = this.state

    votingInstance.NewVote().watch((error, result) => {
      if (error) {
        console.log(`Nooooo! ${error}`)
      } else {
        console.log(`Result ${JSON.stringify(result.args)}`)
        const { votesCount, index, proposal } = result.args
        this.log(`${proposal} has ${votesCount} votes`)
      }
    })
  }

  log(text) {
    this.setState({...this.state, logs: [...this.state.logs, text]})
  }

  onProposalAdded(proposal) {
    const { votingInstance, defaultAccount } = this.state
    console.log(`
    It's about upload a new proposal: ${proposal}.
    The default account is ${defaultAccount}
    The voting instance address is ${votingInstance.address}
    `)
    votingInstance.addProposal(proposal, { from: defaultAccount })
  }

  onVote(proposals) {
    const { votingInstance, defaultAccount } = this.state
    votingInstance.voteProposals({ from: defaultAccount }, proposals)
  }

  render() {
    return (
      <div style={styles.main}>
        <Header/> <hr/>
        { this.state.errorMessage ? <h3>{this.state.errorMessage}</h3> : <ProposalsList proposals={this.state.proposals} onVote={this.onVote.bind(this)}/> }
        <hr/>
        <AddProposalForm onProposalAdded={this.onProposalAdded.bind(this)} />
        <hr/>
        <LogsList logs={this.state.logs} />
      </div>
    )
  }
}
