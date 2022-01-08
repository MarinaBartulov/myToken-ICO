pragma solidity ^0.5.16;

import './MyToken.sol';

contract MyTokenSale {

	address admin; // don't want to expose the admin address
	MyToken public tokenContract;
	uint256 public tokenPrice;
	uint256 public tokensSold;

	event Sell(address _buyer, uint256 _amount);

	constructor(MyToken _tokenContract, uint256 _tokenPrice) public {
		admin = msg.sender;
		tokenContract = _tokenContract;
		tokenPrice = _tokenPrice;
	}

	// pure - not doing any transaction, not interacting with blockchain
	function multiply(uint x, uint y) internal pure returns (uint z){
		require(y == 0 || (z = x * y) / y == x);
	}

	//payable - want someone to be able to send ether via transaction with this function
	function buyTokens(uint256 _numberOfTokens) public payable {
		// require that value is equal to tokens cost
		require(msg.value == multiply(_numberOfTokens, tokenPrice), 'Error, not enough ether sent.');

		// require that the contract has enough tokens
		require(tokenContract.balanceOf(address(this))>=_numberOfTokens, 'Error, not enough tokens available.');

		// require that a transfer is successful - to revert if it doesn't happen
		require(tokenContract.transfer(msg.sender, _numberOfTokens), 'Error, transaction for buying tokens failed.');

		// keep track of tokensSold
		tokensSold += _numberOfTokens;

		// trigger Sell Event
		emit Sell(msg.sender, _numberOfTokens);
	}
}