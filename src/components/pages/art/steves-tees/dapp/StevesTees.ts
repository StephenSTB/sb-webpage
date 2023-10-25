import { MnemonicManager, encryptedMnemonic } from '@sb-labs/mnemonic-manager';
import promptImport from "prompt-sync";
import Web3 from 'web3';
import bip39 from 'bip39';
import { DeployedContracts  } from '@sb-labs/web3-data/networks/DeployedContracts'
import { providers } from '@sb-labs/web3-data/networks/Providers.js';
import HDKey from 'hdkey'
import { ContractFactoryV2, contractFactoryV2 } from '@sb-labs/contract-factory-v2';
import deployedContracts from './DeployedContracts.json' assert {type: "json"}
import { Contract } from '@sb-labs/web3-data';
import * as fs from 'fs'

const __dirname = new URL('.', import.meta.url).pathname;

const deployed = deployedContracts as DeployedContracts

let prompt : any;

let network : string;

let chain_id = 1337;

let web3 : Web3;

let mnemonic : string;

let private_key : string;

let wallet: any

let account : any

let utils = Web3.utils;

let contract_factory: ContractFactoryV2;

let MockUSDC: Contract;

let StevesTees: Contract;

let exit: boolean = true;

// BASE USDC 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

const web3_options = {
    //timeout: 30000, // ms

    // Useful for credentialed urls, e.g: ws://username:password@localhost:8545

    clientConfig: {
      // Useful if requests are large
      //maxReceivedFrameSize: 100000000,   // bytes - default: 1MiB
      //maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

      // Useful to keep a connection alive
      keepalive: true,
      keepaliveInterval: 10000 // ms
    },

    // Enable auto reconnection
    reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false
    }
};

interface ProductInfo{
    price : Number;
    inventory: Number;
}


const main = async () =>{
    prompt = await promptImport();

    let args = process.argv;

    if(args.length < 4){
        console.log('\x1b[31m%s\x1b[0m', `Invalid Number of Arguments Given to Dapp.`)
        process.exit(1);
    }

    console.log("Enter password to access owner account.")
    //let password = (prompt("Password: ", {echo: "*"})).toString();

    let password = "start.process(88)";

    mnemonic = await MnemonicManager("decrypt", encryptedMnemonic, password) as string
    //console.log(mnemonic?.length)

    network = args[2]

    await initWeb3()

    await initWallet();

    await initStevesTees();

    switch(args[3]){
        case "Deploy" : await deploy(); break;
        case "Account" : await account_balance(); break;
        case "View" :  await view(); break;
    }

    if(exit){
        process.exit(0);
    }
}

const initWallet = async () => {
    if(!bip39.validateMnemonic(mnemonic)){
        console.log('\x1b[31m%s\x1b[0m', `Invalid mnemonic given decrypt to execute dapp methods.'${mnemonic}'`);
        process.exit(1)
    }
    let seed = bip39.mnemonicToSeedSync(mnemonic);
    let hdkey = HDKey.fromMasterSeed(seed);

    let key = hdkey.derive("m/44'/60'/0'/0/0");
    let privateKey = "0x" + key.privateKey.toString('hex')
    await web3.eth.accounts.wallet.add(privateKey);

    wallet = web3.eth.accounts.wallet;
  
    account = wallet[0]

    private_key = BigInt(wallet[0].privateKey).toString()

    let balance = utils.fromWei((await web3.eth.getBalance(account.address)).toString(), "ether");

    console.log(`Account Address: ${account.address}, Balance: ${balance}`);
}

const initWeb3 = async () =>{
    while(true){
        switch(network){
            case "Ganache": web3 = new Web3(providers["Ganache"].url, web3_options as any); break;
            case "Goerli" : web3 = new Web3(providers["Goerli"].url, web3_options as any); break;
            case "Ethereum" : web3 = new Web3(providers["Ethereum"].url, web3_options as any); break;
            case "Hyperspace": web3 = new Web3(providers["Hyperspace"].url, web3_options as any); web3.eth.transactionBlockTimeout = 150; break;
            case "Filecoin": web3 = new Web3(providers["Filecoin"].url, web3_options as any); web3.eth.transactionBlockTimeout = 150; break;
            case "Base" : web3 = new Web3(providers["Base"].url, web3_options as any); break;
            case "BaseGoerli" : web3 = new Web3(providers["BaseGoerli"].url, web3_options as any); break;
            default: console.log('\x1b[31m%s\x1b[0m', "Invalid Network") ; process.exit(1);
        }
        try{
            chain_id = await web3.eth.getChainId();
            console.log('\x1b[32m%s\x1b[0m', `Chain ID: ${chain_id}`)
            contract_factory = contractFactoryV2(web3);
            return;
        }catch{
            console.log('\x1b[31m%s\x1b[0m', `Error Connecting to network: ${network}`)
            let response = prompt("Retry connection? Y/n: ")
            if(response !== "Y"){
                process.exit(1)
            }
        }
    }

    
}

const initStevesTees = async () =>{
    MockUSDC = contract_factory["MockUSDC"];
    if(deployed[network]["MockUSDC"] !== undefined){
        MockUSDC.options.address = deployed[network]["MockUSDC"].address;
    }
    
    StevesTees = contract_factory["StevesTees"];

    if(deployed[network]["StevesTees"] !== undefined){
        StevesTees.options.address = deployed[network]["StevesTees"].address
    }
}

const account_balance = async () =>{
    let balance = await web3.eth.getBalance(account.address)
    console.log(balance)
}

const deploy = async () =>{
    try{
        let gasPrice = Number(await web3.eth.getGasPrice())
        let gasPriceG = Number(utils.fromWei(gasPrice.toString(), "gwei"))

        if(gasPriceG > 30){
            console.log('\x1b[31m%s\x1b[0m', `Gas price of ${gasPrice} is to high for deployment.`)
            return
        }

        let tHash : string = "";

        if(deployed[network]["MockUSDC"] === undefined){

            MockUSDC = contract_factory["MockUSDC"];

            //console.log(MockUSDC.methods)

            let gas = await MockUSDC.deploy({data: MockUSDC.options.data as string, arguments: []}).estimateGas({from: account.address})
            console.log(gas)
            console.log(gasPrice)
            
            let totalEther = utils.fromWei((gas * gasPrice).toString())

            console.log('\x1b[33m%s\x1b[0m', `MockUSDC contract gas estimate: ${gas}, gas price in gwei: ${gasPriceG}, total cost estimate: ${totalEther} `)
            let response = prompt(`Would you like to deploy MockUSDC to ${network} network Y/n ? `)
            if(response !== "Y"){
                console.log('\x1b[31m%s\x1b[0m', "Canceled Deployment.")
                return
            }

            await MockUSDC.deploy({data: MockUSDC.options.data as string, arguments: []}).send({from: account.address, gas, gasPrice: gasPrice.toString()},
            function(error, transactionHash){ tHash = transactionHash}).then(function(contractInstance){
                MockUSDC = contractInstance
            })

            let transaction = await web3.eth.getTransaction(tHash)
            
            deployed[network]["MockUSDC"] = {address: MockUSDC.options.address, block: transaction.blockNumber as number};
            console.log('\x1b[32m%s\x1b[0m', `MockUSDC Deployed to: ${network} at: ${MockUSDC.options.address}`)
        }

        if(deployed[network]["StevesTees"] !== undefined){
            let response = prompt(`Would you like to overwrite the contract ${deployed[network]["StevesTees"].address} for ${network} network Y/n ? `)
    
            if(response !== "Y"){
                console.log('\x1b[31m%s\x1b[0m', "Canceled Deployment.")
                return
            }
        }

        StevesTees = contract_factory["StevesTees"]

        let gas = await StevesTees.deploy({data: StevesTees.options.data as string, arguments: [["Made_To_Party"], [{price: 2000000, inventory: 10} as ProductInfo], MockUSDC.options.address] }).estimateGas({from: account.address})

        let totalEther = utils.fromWei((gas * gasPrice).toString())

        console.log('\x1b[33m%s\x1b[0m', `Steves Tees contract gas estimate: ${gas}, gas price in gwei: ${gasPriceG}, total cost estimate: ${totalEther} `)

        let response = prompt("Would you like to continue deployment? Y/n: ")
    
        if(response !== "Y"){
            console.log('\x1b[31m%s\x1b[0m', "Canceled Deployment.")
            return
        }

        
        await StevesTees.deploy({data: StevesTees.options.data as string, arguments: [["Made_To_Party"], [{price: 2000000, inventory: 10} as ProductInfo], MockUSDC.options.address] })
        .send({from: account.address, gas}, function(error, transactionHash){ tHash = transactionHash} ).then(function(contractInstance){
            StevesTees = contractInstance
        })

        let transaction = await web3.eth.getTransaction(tHash)

        deployed[network]["StevesTees"] = {address: StevesTees.options.address, block: transaction.blockNumber as number};

        fs.writeFileSync(__dirname + "DeployedContracts.json", JSON.stringify(deployed, null, 4))
    }
    catch(e){
        console.log("Deployment threw error", e)
    }
}

const view = async () =>{
    let Products = await StevesTees.methods.Products().call({from: account.address});

    console.log(Products)
}

main();