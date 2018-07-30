const AngelToken = artifacts.require("./AngelToken");
const SendABox = artifacts.require("./SendABox");
const SimpleStorage = artifacts.require("./SimpleStorage");


module.exports = function(deployer) {
  /*
  deployer.deploy(AngelToken).then ( function() {
    return deployer.deploy(SendABox , AngelToken.address);
  }
  );

  deployer.deploy(SimpleStorage);
  */
  deployer.deploy(SendABox);

};
