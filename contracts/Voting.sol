pragma solidity ^0.4.4;

import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./ClassCoin.sol";
import "./Utils.sol";

contract Voting is Ownable {

    using Utils for Utils;

    //bytes32[] public proposals;
    uint256[] public votes;
    address owner;

    event NewProposal(bytes32 proposal);
    event NewVote(uint256 votesCount, uint256 index, bytes32 proposal);

    struct Proposal {
        bytes32 name;
        uint8 votesCount;
    }
    Proposal[] public proposals;
    mapping (address => bool) voters;
    ClassCoin coinContract;

    function Voting() public {
        coinContract = new ClassCoin();
    }

    function getProposals() public constant returns (bytes32[]) {
      bytes32[] memory strings = new bytes32[](proposals.length);
      for (uint i = 0; i < proposals.length; i++) {
        strings[i] = proposals[i].name;
      }
      return strings;
    }

    modifier proposalNotExists(bytes32 _proposal) {
        for (uint256 i = 0; i < proposals.length ; i++) {
            require(_proposal != proposals[i].name);
        }
        _;
    }

    function addProposal(bytes32 _proposal) public onlyOwner proposalNotExists(_proposal) {
        proposals.push(Proposal({name: _proposal, votesCount: 0}));
    }

    function addVoter(address _voter) public onlyOwner {
      coinContract.mintOne(_voter);
    }

    function bytes32ToString(bytes32 x) public returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

    function getProposal(uint256 _index) public constant returns (string proposal) {
        return bytes32ToString(proposals[_index].name);
    }

    function getProposalVotesCount(uint256 _index) public constant returns (uint8 proposal) {
        return proposals[_index].votesCount;
    }

    function getProposalsCount() public constant returns (uint256) {
        return proposals.length;
    }

    // Helper function, to interact from Truffle
    function balanceOf(address _voter) public constant returns (uint) {
      return coinContract.balanceOf(_voter);
    }

    function updateProposal(uint _index) public {
        proposals[_index].votesCount = proposals[_index].votesCount + 1;
    }

    function voteProposals(address _voter, uint256[] _indexes) public {
        require(voters[_voter] == false);
        require(coinContract.balanceOf(_voter) > 0);
        require(coinContract.spend(1));
        for (uint i = 0; i < _indexes.length; i++) {
            uint index = _indexes[i];
            updateProposal(index);
        }
        voters[_voter] = true;
    }

}
