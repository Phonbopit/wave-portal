import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { format } from 'date-fns';

import './App.css';

import Header from './components/Header';
import Loading from './components/Loading';
import SkeletonContent from './components/SkeletonContent';

import abi from './utils/WavePortal.json';

const contractABI = abi.abi;
const contractAddress = '0x6914794128792d7de3a902E6ce1cD4f6c4ca1dE9'; // contract address on rinkeby

const FORMAT_DATE = 'dd MMM yyyy HH:mm:ss';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [account, setAccount] = useState('');
  const [waves, setWaves] = useState([]);
  const [message, setMessage] = useState('');

  const handleOnNewWave = (address, message, timestamp) => {
    console.log('NewWave :', address, message, timestamp);

    const newWave = {
      address,
      message,
      timestamp,
      createdAt: format(new Date(timestamp * 1000), FORMAT_DATE)
    };

    console.log('handleNewWave > ', newWave);

    setWaves((prevState) => {
      let newAllWaves = [...prevState, newWave].sort(
        (a, b) => b.timestamp - a.timestamp
      );
      return newAllWaves;
    });
  };

  const sortingWaves = (allWaves) => {
    let waves = allWaves.map((wave) => ({
      address: wave.waver,
      message: wave.message,
      timestamp: wave.timestamp,
      createdAt: format(new Date(wave.timestamp * 1000), FORMAT_DATE)
    }));

    let sortedWaves = waves.sort((a, b) => b.timestamp - a.timestamp);
    console.log('sortedWaves => ', sortedWaves);
    return sortedWaves;
  };

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const allWaves = await wavePortalContract.getAllWaves();
        let sortedWaves = sortingWaves(allWaves);
        setWaves(sortedWaves);

        // event lisenter from Contract#Event
        wavePortalContract.on('NewWave', handleOnNewWave);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalWaves = async () => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      let count = await wavePortalContract.getTotalWaves();
      console.log('total count', count.toNumber());
      setCount(count.toNumber());
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log('total count', count, count.toNumber());

        let waveMessage = message ? message : 'Ahoy!!';

        let waveTxn = await wavePortalContract.wave(waveMessage, {
          gasLimit: 300000
        });
        console.log('mining....', waveTxn);

        setIsLoading(true);

        await waveTxn.wait();
        console.log('Mined ---');

        setIsLoading(false);
        setMessage('');

        count = await wavePortalContract.getTotalWaves();
        console.log('total wave count', count.toNumber());
        setCount(count.toNumber());
      }
      console.log('waved!');
    } catch (error) {
      // reset state when error.
      setIsLoading(false);
      setMessage('');
      console.log('waved error', error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Please install metamask');
      return;
    } else {
      console.log('Cool!', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length) {
      const account = accounts[0];
      console.log('accounts', accounts);
      setAccount(account);

      // when user sign in, then we fetch all waves to display.
      getTotalWaves();
      getAllWaves();
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Please install metamask');
        return;
      }

      if (account) {
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccount(accounts[0]);
      console.log('set accounts', accounts);
      checkIfWalletIsConnected(); // initial the waves data.
    } catch (error) {
      console.log(error);
    }
  };

  const formatAddress = (address) => {
    if (!address) {
      return 'N/A';
    }
    return address.substr(0, 6) + '...' + address.substr(-4);
  };

  const handleMessage = (event) => {
    const value = event.target.value;
    setMessage(value);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="wave-main">
      <Header />
      <div className="container mx-auto py-24">
        <div className="header"></div>

        <section className="text-center">
          <h1 className="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center">
            👋 Hey there!
          </h1>

          <p className="mt-6 mb-24 max-w-3xl mx-auto text-lg">
            I am{' '}
            <a
              href="https://twitter.com/Phonbopit"
              className="text-sky-600"
              target="_blank"
            >
              Chai Phonbopit
            </a>{' '}
            from Thailand 🇹🇭
          </p>

          {!account ? (
            <div className="inset-x-0 flex justify-center pt-8 mb-16">
              <button
                className="bg-slate-800 hover:bg-slate-600 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <p className="mt-4 mb-8 mx-auto">
              <strong>Hello, </strong> {account}
            </p>
          )}
        </section>

        <div className="max-w-xl mx-auto">
          <textarea
            rows="4"
            onChange={handleMessage}
            value={message}
            placeholder="Please leave a message before waving at me"
            className="p-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
          ></textarea>

          <div className="text-right mt-4">
            {isLoading ? (
              <Loading />
            ) : (
              <button
                className="rounded-md py-2 px-4 border-transparent bg-indigo-700 hover:bg-indigo-600 text-slate-200 font-medium disabled:bg-indigo-200"
                onClick={wave}
                disabled={!account}
              >
                Wave at me
              </button>
            )}
          </div>
        </div>

        {!account ? (
          <SkeletonContent />
        ) : (
          <>
            <div className="grid place-items-center mt-16">
              <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                We have <span className="text-4xl">{count}</span>
                {` `} waves and counting...
              </h1>
            </div>

            <div className="flex flex-col justify-center items-center">
              {waves.map(({ address, message, createdAt }) => {
                return (
                  <div
                    className="shadow-sm bg-slate-100 rounded-lg p-4 my-4 w-2/3"
                    key={`${address}_${createdAt}`}
                  >
                    <div className="flex flex-row">
                      <div className="basis-2/4 md:basis-1/4">
                        <h2 className="font-bold text-slate-800">
                          {formatAddress(address)}
                        </h2>
                        <span className="text-sm text-slate-600">
                          {createdAt}
                        </span>
                      </div>
                      <p className="py-2 text-slate-700 basis-2/4 md:basis-3/4">
                        {message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <footer className="pt-16 text-center leading-4 text-slate-700">
          <p>
            Build a Web3 App with Solidity + Ethereum Smart Contracts by{' '}
            <a className="text-indigo-500" href="https://buildspace.so/">
              Buildspace
            </a>{' '}
            {` | `}{' '}
            <a
              className="text-teal-500"
              href="https://github.com/Phonbopit/wave-portal"
            >
              Source Code
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
