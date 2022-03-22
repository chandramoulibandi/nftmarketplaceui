import { Image } from "antd";
import { useMoralisWeb3Api,useMoralisWeb3ApiCall } from "react-moralis";
import { useMoralis } from "react-moralis";
import {ABI,smartcontractaddress} from "../helpers/nftsmartcontract";

export default function Mint() {
    const { native } = useMoralisWeb3Api();
    const { Moralis } = useMoralis();
    
    const abi = ABI;


       const options = {
         chain: "rinkeby",
         address: smartcontractaddress,
         function_name: "GetAllNFT",
         abi: abi,
       };
    
      const {  data } = useMoralisWeb3ApiCall(
        native.runContractFunction,
        { ...options }
      );
      
      console.log(JSON.stringify(data));
    function handleMint (tokenid)  {
       
        let amounttotranfer= document.getElementById('input_amounttomint').value
        alert(amounttotranfer);
        const minter =  Moralis.executeFunction({
            functionName: "managenft",
            abi,
            contractAddress: smartcontractaddress,
            params: {
                to: "0xDC4b7965b2054130b48361e879d0b8306a11b0A8",
                id: tokenid,
                amount:amounttotranfer
            }
          })

          console.log(minter);

    }

   
    return(
        <div>
            
        {
           
           data?.map((nft,index)=>(
               <div>
            <Image
            preview={false}
            src={data[index][1].replaceAll('"', '') || "error"}
            alt=""
            height="200px"
          />
          <br/>
          Current Amount : <input className="form-control" type="text" id="input_amount" value={data[index][2]} name="amount"  placeholder="Current Amount"/>
          <br/>
          Amount To Mint: <input className="form-control" type="text" id="input_amounttomint"  name="amounttomint"  placeholder="Amount"/>
          <br/>
          <button className="btn btn-primary btn-lg btn-block" id="load_button" onClick={() => handleMint(data[index][0])}>Mint</button>
          </div>
           )) 
        }        


    </div>
       
    )

}