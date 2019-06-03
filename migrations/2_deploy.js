const epinglage = artifacts.require("epinglage");
//const Illustrateur = artifacts.require("Illustrateur");

module.exports = function(deployer) {
  deployer.deploy(epinglage);

};
