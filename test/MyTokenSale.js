const MyTokenSale = artifacts.require("MyTokenSale");
const MyToken = artifacts.require("MyToken");

contract("MyTokenSale", (accounts) => {
	let myTokenSale, myToken
	let tokenPrice = 1000000000000000; // in wei, this is 0.001 ETH, each token will cost 0.001 ETH

	beforeEach(async () => {
		myToken = await MyToken.new(1000000) 
		myTokenSale = await MyTokenSale.new(myToken.address, tokenPrice)
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
})