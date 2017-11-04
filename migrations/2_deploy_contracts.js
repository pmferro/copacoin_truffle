var Utils = artifacts.require("./Utils.sol");
var CopaCoin = artifacts.require("./CopaCoin.sol");
var RecuperarClase = artifacts.require("./RecuperarClase");

module.exports = function(deployer) {
  deployer.deploy(CopaCoin);
  deployer.deploy(Utils);
  deployer.deploy(RecuperarClase);
};
