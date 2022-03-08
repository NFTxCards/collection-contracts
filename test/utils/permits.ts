import { BigNumberish } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import { network, ethers } from "hardhat";
import { signMessage } from ".";
import { ERC721Preset } from "../../types";

const chainId = network.config.chainId!;

export const DomainERC721 = (nft: Contract) => ({
    name: "ERC721Permit",
    version: "1",
    chainId,
    verifyingContract: nft.address,
});

export const TypesERC721 = {
    Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "deadline", type: "uint256" },
        { name: "nonce", type: "uint256" },
    ],
};

export const TypesAllERC721 = {
    PermitAll: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "deadline", type: "uint256" },
        { name: "nonce", type: "uint256" },
    ],
};

const EncodingTypesERC721 = [
    "bool forAll",
    "uint256 tokenId",
    "uint256 deadline",
    "tuple(uint8 v, bytes32 r, bytes32 s) sig",
];

export type ERC721Permit = {
    owner: string;
    spender: string;
    tokenId: BigNumberish;
    deadline: BigNumberish;
    nonce: BigNumberish;
};

export async function signPermitERC721(
    signer: SignerWithAddress,
    token: ERC721Preset,
    permit: ERC721Permit,
) {
    const sig = await signMessage(signer, DomainERC721(token), TypesERC721, permit);
    const coder = new ethers.utils.AbiCoder();
    return coder.encode(EncodingTypesERC721, [false, permit.tokenId, permit.deadline, sig]);
}

export type ERC721PermitAll = {
    owner: string;
    spender: string;
    deadline: BigNumberish;
    nonce: BigNumberish;
};

export async function signPermitAllERC721(
    signer: SignerWithAddress,
    token: ERC721Preset,
    permit: ERC721PermitAll,
) {
    const sig = await signMessage(signer, DomainERC721(token), TypesAllERC721, permit);
    const coder = new ethers.utils.AbiCoder();
    return coder.encode(EncodingTypesERC721, [true, 0, permit.deadline, sig]);
}
