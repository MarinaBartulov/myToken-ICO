pragma solidity ^0.5.16;

contract MyToken {

	uint256 public totalSupply; //comes from ERC20 standard
	string public name = "MyToken";
	string public symbol = "MYT";
	string public standard = "MyToken v1.0"; //not part of ERC20 standard

	mapping(address => uint256) public balanceOf;
	mapping(address => mapping(address => uint256)) public allowance;
	//First address: Account A
	//Second address: Account B, Account C, Account D,...
	//I (Account A) approve Account B to spend uint256 tokens on my behalf

	event Transfer(address indexed _from, address indexed _to, uint256 _value);
	event Approval(address indexed _owner, address indexed _spender, uint256 _value);

	constructor(uint256 _initialSupply) public {
		// allocate initial supply to admin
		balanceOf[msg.sender] = _initialSupply;
		totalSupply = _initialSupply;  
	}

	function transfer(address _to, uint256 _value) public returns (bool success){
		require(balanceOf[msg.sender] >= _value, 'Error, not enough tokens to transfer.');
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;	
		emit Transfer(msg.sender, _to, _value);
		return true;
	}

	// delegated transfers
	// 2 step process:
	// one function will allow our account to approve a transfer
	// another function will handle the delegated transfer 

	// I want to approve account _spender to spend _value on my behalf
	function approve(address _spender, uint256 _value) public returns (bool success){
		allowance[msg.sender][_spender] = _value;
		emit Approval(msg.sender, _spender, _value);
		return true;
	}

	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
		require(balanceOf[_from] >= _value, 'Error, there is no enough amount to transfer.');
		require(allowance[_from][msg.sender] >= _value, 'Error, allowance is not big enough for transfer'); //msg.sender is third-party
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;
		allowance[_from][msg.sender] -= _value;
		emit Transfer(_from, _to, _value);
		return true;
	}

}

