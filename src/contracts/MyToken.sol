pragma solidity ^0.5.16;

contract MyToken {

	uint256 public totalSupply; //comes from ERC20 standard
	string public name = "MyToken";
	string public symbol = "MYT";
	string public standard = "MyToken v1.0"; //not part of ERC20 standard

	mapping(address => uint256) public balanceOf;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	constructor(uint256 _initialSupply) public {
		balanceOf[msg.sender] = _initialSupply;
		totalSupply = _initialSupply; 
		// allocate initial supply to admin 
	}

	function transfer(address _to, uint256 _value) public returns (bool success){
		require(balanceOf[msg.sender] >= _value, 'Error, not enough tokens to transfer.');
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;	
		emit Transfer(msg.sender, _to, _value);
		return true;
	}
}

