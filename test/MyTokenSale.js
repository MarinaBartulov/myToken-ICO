import { EVM_REVERT } from './helpers'

const MyTokenSale = artifacts.require("MyTokenSale");
const MyToken = artifacts.require("MyToken");

contract("MyTokenSale", (accounts) => {
	let myTokenSale, myToken
	let admin = accounts[0] //contains all tokens at the beginning 
	let buyer = accounts[1]
	let tokenPrice = 1000000000000000; // in wei, this is 0.001 ETH, each token will cost 0.001 ETH
	let tokensAvailabe = 750000;

	beforeEach(async () => {
		myToken = await MyToken.new(1000000) 
		myTokenSale = await MyTokenSale.new(myToken.address, tokenPrice)
		// Provision 75% of all tokens to the token sale
		await myToken.transfer(myTokenSale.address, tokensAvailabe, { from: admin})

	})

	describe('testing MyTokenSale contract', () => {
		describe('success', () => {
			it('checking MyTokenSale contract address...', async () => {
				expect(myTokenSale.address).not.eq(0x0)
			})
			it('checking MyToken contract address in MyTokenSale contract...', async () => {
				expect(await myTokenSale.tokenContract()).to.be.eq(myToken.address)
			})
			it('checking MyToken price...', async () => {
				expect(Number(await myTokenSale.tokenPrice())).to.eq(tokenPrice)
			})
			
		})
	})

	describe('testing tokens buying...', () => {
		describe('success', () => {
			it('checking tokens sold number...', async () => {
				let numberOfTokens = 10;
				let value = numberOfTokens * tokenPrice;
				const receipt = await myTokenSale.buyTokens(numberOfTokens, { from: buyer, value: value})
				expect(Number(await myTokenSale.tokensSold())).to.eq(numberOfTokens);
				expect(receipt.logs.length).to.eq(1)
				expect(receipt.logs[0].event).to.be.eq('Sell')
				expect(receipt.logs[0].args._buyer).to.be.eq(buyer)
				expect(Number(receipt.logs[0].args._amount)).to.eq(numberOfTokens)	
				// number of buyer's tokens should increase
				expect(Number(await myToken.balanceOf(buyer))).to.eq(numberOfTokens)
				// number of available tokens should decrease
				expect(Number(await myToken.balanceOf(myTokenSale.address))).to.eq(tokensAvailabe - numberOfTokens)		
			})
			
		})

		describe('failure', () => {
			let numberOfTokens = 10;
			it("testing buying tokens different from the ether value...", async () => {
				let value = numberOfTokens * tokenPrice; // how much wei is sent
				// try with 1 wei to buy 10 tokens
				await myTokenSale.buyTokens(numberOfTokens, { from: buyer, value: 1}).should.be.rejectedWith(EVM_REVERT); 
			})

			it("testing buying tokens more than available...", async () => {
				let value = numberOfTokens * tokenPrice; 
				await myTokenSale.buyTokens(800000, { from: buyer, value: value}).should.be.rejectedWith(EVM_REVERT); 
			})
		})
	})
})