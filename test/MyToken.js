const MyToken = artifacts.require("./MyToken");

contract("MyToken", (accounts) => {
	let myToken

	beforeEach(async () => {
		myToken = await MyToken.new()
	})

	describe('testing myToken contract', () => {
		describe('success', () => {
			it('checking total supply...', async () => {
				expect(Number(await myToken.totalSupply())).to.eq(1000000)
			})
		})
	})

})