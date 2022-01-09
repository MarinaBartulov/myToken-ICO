import { useState, useEffect } from 'react';
import './App.css';
import CustomNavbar from './CustomNavbar';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar'; 
import Web3 from 'web3';
import MyToken from '../abis/MyToken.json';
import MyTokenSale from '../abis/MyTokenSale.json';


function App() {

const [web3, setWeb3] = useState('undefined');
const [netId, setNetId] = useState('');
const [account, setAccount] = useState('');
const [tokenSymbol, setTokenSymbol] = useState('');
const [tokenPrice, setTokenPrice] = useState(0);
const [myTokenSale, setMyTokenSale] = useState(null)

const [numberOfTokens, setNumberOfTokens] = useState(0);
const [tokensSold, setTokensSold] = useState(0);
const [tokensAvailable, setTokensAvailable] = useState(750000);
const [tokensSoldPercentage, setTokensSoldPercentage] = useState(70);

const [numberOfTokensToBuy, setNumberOfTokensToBuy] = useState('');

useEffect(() => {
  loadBlockchainData();
},[])

const loadBlockchainData = async () => {
  if(typeof window.ethereum !== 'undefined'){
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable(); 
      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts()
      if(typeof accounts[0] !== 'undefined'){
        setAccount(accounts[0])
        setWeb3(web3)
        setNetId(netId)
      }else{
        window.alert('Please login with MetaMask')
      }

      try{
        const myToken = new web3.eth.Contract(MyToken.abi, MyToken.networks[netId].address)
        const myTokenSale = new web3.eth.Contract(MyTokenSale.abi, MyTokenSale.networks[netId].address)
        setMyTokenSale(myTokenSale)
        //Get number of tokens for the current account
        const tokens = await myToken.methods.balanceOf(accounts[0]).call()
        setNumberOfTokens(tokens)
        const tokenSymbol = await myToken.methods.symbol().call()
        setTokenSymbol(tokenSymbol)
        const tokenPrice = await myTokenSale.methods.tokenPrice().call()
        setTokenPrice(web3.utils.fromWei(tokenPrice))
        const tokensSold = await myTokenSale.methods.tokensSold().call()
        setTokensSold(tokensSold)
        const tokensSoldPercentage = (tokensSold / tokensAvailable).toFixed(2)*100;
        setTokensSoldPercentage(tokensSoldPercentage)

        //Listen for Sell event
        myTokenSale.events.Sell({
          fromBlock: 'latest',
        }, (error, event) => {
          console.log(event)
          reloadContractsData(myToken, myTokenSale, accounts[0], web3)
        })

      } catch(e){
        console.log('Error',e)
        window.alert('Contracts not deployed to the current network')
      }
  }else{   
    window.alert("Please install MetaMask")
  }
}

const reloadContractsData = async (myToken, myTokenSale, account, web3) => {
  //Get number of tokens for the current account
  const tokens = await myToken.methods.balanceOf(account).call()
  setNumberOfTokens(tokens)
  const tokenSymbol = await myToken.methods.symbol().call()
  setTokenSymbol(tokenSymbol)
  const tokenPrice = await myTokenSale.methods.tokenPrice().call()
  setTokenPrice(web3.utils.fromWei(tokenPrice))
  const tokensSold = await myTokenSale.methods.tokensSold().call()
  setTokensSold(tokensSold)
  const tokensSoldPercentage = (tokensSold / tokensAvailable).toFixed(2)*100;
  setTokensSoldPercentage(tokensSoldPercentage)
  setNumberOfTokensToBuy('')
}

const buyTokens = async (e) => {
  e.preventDefault();
  console.log(numberOfTokensToBuy)
  try{
    await myTokenSale.methods.buyTokens(numberOfTokensToBuy).send({from: account, value: numberOfTokensToBuy * web3.utils.toWei(tokenPrice), gas: 500000})
  }catch(e){
    console.log('Error, buyTokens: ', e)
  }
}

  return (
    <div className="App">
      <CustomNavbar>
      </CustomNavbar>
      <Container>
        <Card bg="warning" className="mt-3">
          <h1>MyToken ICO sale</h1>
        </Card>
      </Container>
      <Container>
        <Card bg="warning" className="mt-3">
          <b>Introducing "MyToken" (MYT)!</b>
           <b>Token price is {tokenPrice} ETH. </b>
           <b>You currently have {numberOfTokens} {tokenSymbol}.</b>
          <br></br>
          How many tokens do you want to buy?
          <div className="form-div">
            <form onSubmit={(e) => buyTokens(e)}>
              <div className="form-group mr-sm-2">
              <br></br>
                <input
                  id="numberOfTokens"
                  step="1"
                  type="number"
                  className="form-control form-control-md"
                  placeholder="Number of tokens..."
                  required
                  value={numberOfTokensToBuy}
                  onChange={event => setNumberOfTokensToBuy(event.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3 mb-3">BUY TOKENS</button>
            </form>
            <ProgressBar className="mb-3" now={tokensSoldPercentage} label={`${tokensSoldPercentage}%`}/>
            <p>Current account connected:</p>
            <p>{account}</p>
            <p>{tokensSold}/{tokensAvailable} tokens sold</p>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default App;
