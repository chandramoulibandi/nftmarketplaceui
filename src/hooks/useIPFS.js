import { useMoralisFile } from "react-moralis";
import Moralis from "moralis";
import {ABI,smartcontractaddress} from "../helpers/nftsmartcontract";

export const useIPFS = () => {
  const abi = ABI
  const {
    error,
    isUploading,
    moralisFile,
    saveFile,
  } = useMoralisFile();

  // Format the IPFS url
  const resolveLink = (url) => {
    if (!url || !url.includes("ipfs://")) return url;
    return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
  };

  // Upload image to IPFS
  const uploadImage = async (imageFile,name, description) => {
    const file = await saveFile(imageFile.name, imageFile, { saveIPFS: true })
    const ipfsdata= file.ipfs();
    const cidHash = await uploadMetadata(name, description, ipfsdata);
    
    return file;
    
  };

  // Upload metadata to IPFS
  const uploadMetadata = async (name, description, imageURL) => {
    

    const metadata = {
        "name": name,
        "description": description,
        "image": imageURL
      }
      
    const buff = btoa(JSON.stringify(metadata))
    const file = await saveFile("0x00.json", {base64: buff}, {saveIPFS: true});
    return file.hash();
};

  // Mint NFT
  const mintNft = async (name, description, imageFile) => {
      const image = await uploadImage(imageFile,name, description);
      console.log(`Hash Name : ${JSON.stringify(image.url())}`);
      const imagehash= `${JSON.stringify(image.url()).split('/').pop().split('.')[0]}`;
      const minter =  Moralis.executeFunction({
        functionName: "mint",
        abi,
        contractAddress: smartcontractaddress,
        params: {
         imageurl:`${JSON.stringify(image.url())}`,
         to: "0xDC4b7965b2054130b48361e879d0b8306a11b0A8",
         amount:1,
         imghash:imagehash
        }
      })

      return minter;
  };

  return { resolveLink, isUploading, error, moralisFile, mintNft };
};
