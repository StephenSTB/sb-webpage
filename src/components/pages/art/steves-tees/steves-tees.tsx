import { Button, Icon } from "@sb-labs/basic-components/dist"

import {wallet } from "@sb-labs/images";

import { useEffect, useState } from "react";

import Web3 from 'web3';

import { networkData as NetData} from "@sb-labs/web3-data/networks/NetworkData.js";

const networkData : any = NetData;

export interface SwitchError{
	code: number
}

interface StevesTeesProps{
    theme: string
}

export function StevesTees(props: StevesTeesProps){

    const [connect, setConnect] = useState(false)

    const [selectedAccount, setSelectedAccount] = useState("Connect Wallet")

    const [account, setAccount] = useState(0)

    useEffect(() =>{

        if(connect){

            const updateWeb3 = async () =>{
                //console.log("updateWeb3")
                if (window.ethereum) {
                    
                    //console.log("update web3")
            
                    try{
                    
                        await window.ethereum.request({ method: 'eth_requestAccounts' });
                    }
                    catch(error){
                        console.error("error", error);
                        return;
                    }
                    
                    const web3  = new Web3(window.ethereum);
            
                    const chainID = Number(await web3.eth.getChainId());
            
                    let connected = chainID === 8453 ? true : chainID === 1337 ? true : chainID === 5 ? true : false

                    if(!connected){
                    
                        try{
                            await window.ethereum.request({
                                "method": "wallet_switchEthereumChain",
                                "params": [{ "chainId": "0x2105" }],
                            });
                        }
                        catch(swtichError){
                            let error = swtichError as SwitchError
                            if(error.code === 4902){
                                try{
                                window.ethereum.request({
                                    method: "wallet_addEthereumChain",
                                    params: networkData["8453"],
                                });
                                }
                                catch(error){
                                console.log(error)
                                }
                            }
                        }
                        setConnect(false)
                        return;
                    }else{
            
                        const accounts = await web3.eth.getAccounts();
            
                        const account = accounts[0];
            
                        const selectedAccount = account.slice(0,5) + "..." + account.slice(38);
            
                        let network = chainID ===  5 ? "Goerli" : chainID === 8453 ? "Base" : "Ganache";
            
                        let asset = networkData[chainID].nativeCurrency.symbol

                        //let deployed = deployedContracts as DeployedContracts

                        //deployed[network]["StevesTees"]
                        
                    }

                    window.ethereum.on('accountsChanged', (accounts: string[]) => {
                        // Handle the new accounts, or lack thereof.
                        // "accounts" will always be an array, but it can be empty.
                        window.location.reload()
                        //setState(state =>({...state, connect: true}))
                        //setConnect(true);
                    });
            
                    window.ethereum.on('chainChanged', (chainId : number) => {
                        // Handle the new chain.
                        // Correctly handling chain changes can be complicated.
                        // We recommend reloading the page unless you have good reason not to.
                        window.location.reload();
                        //setState(state => ({...state, connect: true}))
                        //setConnect(true)
                    });
            
                }
            }
            
            updateWeb3();
        }

    }, [connect])

    return(
        <>
            <Button text={selectedAccount} icon={<Icon src={wallet} round={false}/>} size="large" onClick={() => setConnect(true)} theme={props.theme} transacting={false}/>
        </>
    )
}

function items(){
    return(
        <>
            <div className="tee-name"></div>
            <div className="tee-price"></div>
            <div className="tee-buy"></div>
        </>
    )
}