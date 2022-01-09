const MyToken = artifacts.require("MyToken");
const MyTokenSale = artifacts.require("MyTokenSale");

module.exports = async function (deployer) {
  await deployer.deploy(MyToken, 1000000);
  const token = await MyToken.deployed()
  // Token price is 0.001 Ether
  let tokenPrice = 1000000000000000;
  let tokensAvailabe = 750000;
  const myTokenSale = await deployer.deploy(MyTokenSale, token.address, tokenPrice);
  // Provision tokens to token sale contract
  await token.transfer(myTokenSale.address, tokensAvailabe)
};