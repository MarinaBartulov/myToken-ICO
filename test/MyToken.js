import { EVM_REVERT } from './helpers'

const MyToken = artifacts.require("./MyToken");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract("MyToken", (accounts) => {
	let myToken

	beforeEach(async () => {
		myToken = await MyToken.new(1000000)
	})

	describe('testing MyToken contract', () => {
		describe('success', () => {
			it('checking total supply...', async () => {
				expect(Number(await myToken.totalSupply())).to.eq(1000000)
			})

			it('checking admin balance...', async () => {
				expect(Number(await myToken.balanceOf(accounts[0]))).to.eq(1000000)
			})

			it('checking myToken name...', async() => {
				expect(await myToken.name()).to.be.eq("MyToken")
			})

			it('checking myToken symbol...', async() => {
				expect(await myToken.symbol()).to.be.eq("MYT")
			})

			it('checking myToken standard...', async() => {
				expect(await myToken.standard()).to.be.eq("MyToken v1.0")
			})

			it('checking accounts balances...', async() => {
				const receipt = await myToken.transfer(accounts[1], 250000, { from: accounts[0]});
				expect(Number(await myToken.balanceOf(accounts[1]))).to.eq(250000)
				expect(Number(await myToken.balanceOf(accounts[0]))).to.eq(750000)
				expect(receipt.logs.length).to.eq(1)
				expect(receipt.logs[0].event).to.be.eq('Transfer')
				expect(receipt.logs[0].args._from).to.be.eq(accounts[0])
				expect(receipt.logs[0].args._to).to.be.eq(accounts[1])
				expect(Number(receipt.logs[0].args._value)).to.eq(250000)
			})

			it('checking return value of transfer function...', async() => {
				const success = await myToken.transfer.call(accounts[1], 250000, { from: accounts[0]});
				expect(success).to.eq(true)
			})

			it('testing approving tokens for delegated transfer...', async() => {
				const success = await myToken.approve.call(accounts[1], 100);
				expect(success).to.eq(true)
				const receipt = await myToken.approve(accounts[1], 100, { from: accounts[0]});
				expect(receipt.logs.length).to.eq(1)
				expect(receipt.logs[0].event).to.be.eq('Approval')
				expect(receipt.logs[0].args._owner).to.be.eq(accounts[0])
				expect(receipt.logs[0].args._spender).to.be.eq(accounts[1])
				expect(Number(receipt.logs[0].args._value)).to.eq(100)
				expect(Number(await myToken.allowance(accounts[0], accounts[1]))).to.eq(100)
			})

			it('testing delegated transfer...', async() => {
				const fromAccount = accounts[2];
				const toAccount = accounts[3];
				const spendingAccount = accounts[4];
				// I need to transfer some tokens to fromAccount
				await myToken.transfer(fromAccount, 100, { from: accounts[0]});
				// Approve spendingAccount to spend 10 tokens from fromAccount
				await myToken.approve(spendingAccount, 10, { from: fromAccount});
				//this doesn't change the state of blockchain
				const success = await myToken.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount});
				expect(success).to.eq(true)
				//this changes the state of blockchain
				const receipt = await myToken.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
				expect(receipt.logs.length).to.eq(1)
				expect(receipt.logs[0].event).to.be.eq('Transfer')
				expect(receipt.logs[0].args._from).to.be.eq(accounts[2])
				expect(receipt.logs[0].args._to).to.be.eq(accounts[3])
				expect(Number(receipt.logs[0].args._value)).to.eq(10)
				expect(Number(await myToken.balanceOf(fromAccount))).to.eq(90)
				expect(Number(await myToken.balanceOf(toAccount))).to.eq(10)
				expect(Number(await myToken.allowance(fromAccount, spendingAccount))).to.eq(0)

			})

		})

		describe('failure', () => {
			it('transfer function should be rejected...', async() => {
				await myToken.transfer.call(accounts[1], 99999999999).should.be.rejectedWith(EVM_REVERT)
			})

			it('delegated transfer should be rejected...', async() => {
				const fromAccount = accounts[2];
				const toAccount = accounts[3];
				const spendingAccount = accounts[4];
				// I need to transfer some tokens to fromAccount
				await myToken.transfer(fromAccount, 100, { from: accounts[0]});
				// Approve spendingAccount to spend 10 tokens from fromAccount
				await myToken.approve(spendingAccount, 10, { from: fromAccount});
				await myToken.transferFrom(fromAccount, toAccount, 9999, {from: spendingAccount}).should.be.rejectedWith(EVM_REVERT);
				await myToken.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount}).should.be.rejectedWith(EVM_REVERT);
			})
		})
	})

})