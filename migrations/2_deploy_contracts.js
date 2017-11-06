var Utils = artifacts.require("./Utils.sol");
var ClassCoin = artifacts.require("./ClassCoin.sol");
var Voting = artifacts.require("./Voting.sol");

module.exports = function(deployer) {
  deployer.deploy(ClassCoin);
  deployer.deploy(Utils);
  //deployer.link(ClassCoin, Voting);
  deployer.deploy(Voting);
};
