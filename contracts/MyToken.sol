pragma solidity ^0.5.16;

contract MyToken {

	uint256 public totalSupply; //comes from ERC20 standard

	constructor() public {
		totalSupply = 1000000; //1 milion tokens available
	}
}

