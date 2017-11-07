pragma solidity ^0.4.17;

library Utils {

  function stringsEqual(string _a, string _b) public pure returns (bool) {
		bytes32 hashA = keccak256(_a);
		bytes32 hashB = keccak256(_b);
		return hashA == hashB;
	}
}
