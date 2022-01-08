pragma solidity ^0.5.16;

import './MyToken.sol';

contract MyTokenSale {

	address admin; // don't want to expose the admin address
	MyToken public tokenContract;
	uint256 public tokenPrice;

	constructor(MyToken _tokenContract, uint256 _tokenPrice) public {
		admin = msg.sender;
		tokenContract = _tokenContract;
		tokenPrice = _tokenPrice;
	}
}