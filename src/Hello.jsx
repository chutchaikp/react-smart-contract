// import { useState } from 'react';
import './Hello.scss';
import { useEffect, useState } from 'react';
import erc20abi from './erc20ABI.json';
import { ethers } from 'ethers';

function Hello() {
  // const [address, setAddress] = useState('');
  const [error, setError] = useState(null);
  const [txs, setTxs] = useState([]);
  // [
  //   {
  //     txHash: '',
  //     from: '',
  //     to: '',
  //     amount,
  //   }
  // ]

  const [contractInfo, setContractInfo] = useState({
    address: '0xf935801D7664C6c9aBA03F2c830830C350216E36',
    tokenName: '-',
    tokenSymbol: '-',
    totalSupply: '0',
  });
  const [balanceInfo, setBalanceInfo] = useState({
    address: '',
    balance: '',
  });

  useEffect(() => {
    if (contractInfo.address !== '-') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const erc20 = new ethers.Contract(
        contractInfo.address,
        erc20abi,
        provider
      );

      // TODO: events how to
      // https://docs.ethers.org/v5/api/providers/provider/#Provider--events
      erc20.on('Transfer', (from, to, amount, event) => {
        console.log('-------');
        console.log(from, to, amount, event);
        console.log('-------');

        setTxs((prev) => {
          return [
            ...prev,
            {
              txHash: event.transactionHash,
              from,
              to,
              amount: String(amount),
            },
          ];
        });
      });
    }
  }, [contractInfo.address]);

  // useEffect(() => {
  //   async function connect() {
  //     try {
  //       return;
  //       const provider = new ethers.providers.Web3Provider(
  //         window.ethereum,
  //         'any'
  //       );
  //       debugger;
  //       // const provider = new ethers.BrowserProvider(window.ethereum);
  //       let accounts = await provider.send('eth_requestAccounts', []);
  //       let account = accounts[0];
  //       provider.on('accountsChanged', function (accounts) {
  //         account = accounts[0];
  //         console.log(address); // Print new address
  //       });

  //       const signer = provider.getSigner();
  //       const address = await signer.getAddress();

  //       console.log(account);
  //       console.log(address);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   connect();
  // }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const data = new FormData(e.target);
      const address = data.get('address');
      if (!address) return;

      // Changed
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const erc20 = new ethers.Contract(
        data.get('address'),
        erc20abi,
        provider
      );

      const tokenName = await erc20.name();
      const tokenSymbol = await erc20.symbol();
      const totalSupply = await erc20.totalSupply();

      setContractInfo({
        address: data.get('address'),
        tokenName,
        tokenSymbol,
        totalSupply: String(totalSupply),
      });
    } catch (error) {
      console.log('error');
    }
  };

  const getMyBalance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const erc20 = new ethers.Contract(
        contractInfo.address,
        erc20abi,
        provider
      );
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      const balance = await erc20.balanceOf(signerAddress);

      setBalanceInfo({
        address: signerAddress,
        balance: String(balance),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleTransfer = async (e) => {
    try {
      e.preventDefault();

      const _form = new FormData(e.target);
      const _to = _form.get('to');
      const _amount = _form.get('amount');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const singer = await provider.getSigner();
      const erc20 = new ethers.Contract(contractInfo.address, erc20abi, singer);
      await erc20.transfer(_to, _amount);
    } catch (error) {
      debugger;
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="operator">
        <div className="address-data">
          <p>contract address: 0xf935801D7664C6c9aBA03F2c830830C350216E36</p>
          <p>account1: 0xb0eeD01d200AC0B9fB393F72eCf53d9dE5B14fB5</p>
          <p>account2: 0xC6CC647c08a0EbDB2977c2c7e9E2bd08D3f85454</p>
        </div>

        <form onSubmit={handleSubmit}>
          <h3>Read from smart contract</h3>
          {/* <input type="text" 
        onChange={(e) => setAddress(e.target.value) } 
        value={address} /> */}
          <input type="text" name="address" />
          {/* <button onClick={handleSubmit}>GET TOKEN INFO</button> */}
          <input type="submit" value={'GET TOKEN INFO'} />
        </form>
        <div className="contract-info">
          <p>
            <i className="address">Address: {contractInfo.address}</i>
          </p>
          <p>
            <span className="token-name">NAME: {contractInfo.tokenName}</span>
            <span className="token-symbol">
              SYMBOL: {contractInfo.tokenSymbol}
            </span>
            <span className="total-supply">
              TOTAL SUPPLY: {contractInfo.totalSupply}
            </span>
          </p>
        </div>

        <div className="balance">
          <button onClick={getMyBalance}>GET MY BALANCE</button>
          <p>MY ADDRESS: {balanceInfo.address}</p>
          <p>BALANCE: {balanceInfo.balance}</p>
        </div>

        <form className="transfer" onSubmit={handleTransfer}>
          <h3>Write to contract</h3>
          <input type="text" name="to" placeholder="to address" />
          <input type="text" name="amount" placeholder="amount" />
          <input type="submit" value="TRANSFER" />
        </form>
      </div>

      <div className="log">log me</div>
    </div>
  );
}

export default Hello;
