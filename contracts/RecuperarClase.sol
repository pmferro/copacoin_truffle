pragma solidity ^0.4.4;

import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./CopaCoin.sol";
import "./Utils.sol";

contract RecuperarClase is Ownable {

    using Utils for Utils;

    struct Proposal {
        bytes32 name;
        uint8 votesCount;
    }
    Proposal[] public proposals;
    mapping (address => bool) voters;
    CopaCoin copaCoinContract;

    function RecuperarClase() public {
        copaCoinContract = new CopaCoin();
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

        //    Este guion bajo se reemplaza por el cuerpo de la funcion
        //    que esta aplicando el modifier

        _;
    }

    function addProposal(bytes32 _proposal) public onlyOwner proposalNotExists(_proposal) {
        proposals.push(Proposal({name: _proposal, votesCount: 0}));
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

    modifier hasCoins {
        require(copaCoinContract.balanceOf(msg.sender) > 0);
        _;
    }

    function voteProposals(uint256[] _indexes) public {
        require(voters[msg.sender] == false);
        require(copaCoinContract.balanceOf(msg.sender) > 0);
        require(copaCoinContract.spend(1));
        for (uint i = 0; i < _indexes.length; i++) {
          uint index = _indexes[i];
          proposals[index].votesCount = proposals[index].votesCount + 1;
        }
        voters[msg.sender] = true;
    }

}
