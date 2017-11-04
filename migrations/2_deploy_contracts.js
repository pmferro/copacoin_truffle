var ERC20Basic = artifacts.require("./ERC20Basic.sol");
var Ownable = artifacts.require("./Ownable.sol");
var Utils = artifacts.require("./Utils.sol");
var CopaCoin = artifacts.require("./CopaCoin.sol");
var Ballot = artifacts.require("RecuperarClase");

module.exports = function(deployer) {
  deployer.deploy(ERC20Basic);
  deployer.link(ERC20Basic, Ownable);
  deployer.deploy(Ownable);
  deployer.deploy(CopaCoin);
  deployer.deploy(Utils);
  //deployer.link(CopaCoin, Ballot);
  deployer.deploy(Ballot);
};
