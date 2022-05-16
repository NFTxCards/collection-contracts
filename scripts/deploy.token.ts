import { ethers } from "hardhat";
import "cross-fetch/polyfill";

import pinataSDK from "@pinata/sdk";
import { Signature } from "ethers";
import { parseUnits } from "ethers/lib/utils";

import { signMessage } from "../test/utils";

const day = 24 * 60 * 60;
const ipfsHash = "QmaR8tnh9avGRVyd6ZwAYRHUincMfBKssPAVJypmRCWnAb";

const whitelist = [
  {
    address: "0x817E4317e50eF0E4721d020bd8b5AB775D207D6D",
    amount: 2,
  },
  {
    address: "0x27E82Ba6AfEbf3Eee3A8E1613C2Af5987929a546",
    amount: 3,
  },
  {
    address: "0x8531f6D1A8d38dbE5903516c7E313662816c5807",
    amount: 1,
  },
  {
    address: "0xa915fbCFbCE6DD99056f54d80c7789b3402dF671",
    amount: 1,
  },
  {
    address: "0x1445f31fb5F2a858865715CA14CC3A0fa910F07c",
    amount: 1,
  },
  {
    address: "0xF39598EF3e216cf052a45dA5f163D2b4bD21469E",
    amount: 5,
  },
  {
    address: "0x1a5245ea5210C3B57B7Cfdf965990e63534A7b52",
    amount: 1,
  },
  {
    address: "0xe79900C684CFD1d997f1a04a1ba516C66fb3791d",
    amount: 2,
  },
];

async function signWhitelist(account: string, verifyingContract: string, amount: number = 1,) {
  const [sender] = await ethers.getSigners();

  const TypesTrader = {
    Whitelist: [
      { name: "account", type: "address" },
      { name: "amount", type: "uint256" },
    ],
  }

  const network = await ethers.provider.getNetwork()
  console.log('network', network)

  return await signMessage(
    sender,
    {
      chainId: network.chainId,
      verifyingContract,
    },
    TypesTrader,
    { account, amount },
  );
}

async function main() {
  const [sender] = await ethers.getSigners();
  console.log("Sender: ", sender.address);

  // console.log("start deploy token");
  // We get the contract to deploy
  const TokenImplementation = await ethers.getContractFactory("ERC721Preset");
  const tokenImpl = await TokenImplementation.deploy(
    "Mock", // name
    "MCKX", // symbol
    `ipfs://${ipfsHash}/`, // uri
  );
  await tokenImpl.deployed();
  console.log("token deployed", tokenImpl.address);

  const pinata = pinataSDK(
    "e570cac578ba3585a96e",
    "5892be7cf9e86ca25d27afcee520eb898a9dfd5c43e5d8aba4baa79c1215a386",
  );

  console.log("start deploy trader");

  // We get the contract to deploy
  const TraderImplementation = await ethers.getContractFactory("TokenTrader");

  const traderParams = [
    tokenImpl.address, // collection
    parseUnits("0.069"), // price
    // 3 * day, // whitelistDuration
    0,
    sender.address, // signer him generate the signs
  ]

  const traderImpl = await TraderImplementation.deploy(...traderParams);
  await traderImpl.deployed();
  console.log("trader deployed", traderImpl.address);

  console.log("setMinter");
  const setMinterResult = await tokenImpl.setMinter(traderImpl.address);
  await setMinterResult.wait();

  const whitelistObject: Record<string, { signature: Signature; amount: number }> = {};
  await pinata.testAuthentication();

  for (const wl of whitelist) {
    const sig = await signWhitelist(wl.address, traderImpl.address, wl.amount);
    whitelistObject[wl.address] = {
      signature: sig,
      amount: wl.amount
    };
  }

  const resPinJSON = await pinata.pinJSONToIPFS(whitelistObject);
  console.log("resPinJSON", resPinJSON);

  console.log("setSigListIpfsHash");
  const setSigListIpfsHashResult = await traderImpl.setSigListIpfsHash(resPinJSON.IpfsHash);
  await setSigListIpfsHashResult.wait();

  // let TokenImplementation = await ethers.getContractAt("ERC721Preset", "0xa995FB61e7b2ab929fBc45b5c350B59471042952");
  //
  //
  // TokenImplementation = TokenImplementation.connect(sender)
  // await TokenImplementation.setBaseURI(`ipfs://${ipfsHash}/`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
