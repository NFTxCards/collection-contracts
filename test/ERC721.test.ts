import { ethers } from "hardhat";
import { expect } from "chai";
import { ERC721Preset } from "../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Block } from "@ethersproject/abstract-provider";
import {
    DomainERC721,
    ERC721Permit,
    ERC721PermitAll,
    TypesAllERC721,
    TypesERC721,
} from "./utils/permits";
import { increaseTime, signMessage } from "./utils";
import { Signature } from "ethers";

describe("Test ERC721Preset contract", function () {
    let owner: SignerWithAddress, other: SignerWithAddress;
    let token: ERC721Preset;

    this.beforeEach(async function () {
        [owner, other] = await ethers.getSigners();

        const TokenFactory = await ethers.getContractFactory("ERC721Preset");
        token = (await TokenFactory.deploy("TestToken", "TT", "base/")) as ERC721Preset;
    });

    it("Name and symbol are correct", async function () {
        expect(await token.name()).to.equal("TestToken");
        expect(await token.symbol()).to.equal("TT");
    });

    it("Only minter can mint", async function () {
        await expect(token.connect(other).mint(other.address, 1)).to.be.revertedWith(
            "Caller is not minter",
        );
    });

    it("Minter and only minter can multi-mint", async function () {
        await expect(token.connect(other).multiMint([other.address])).to.be.revertedWith(
            "Caller is not minter",
        );

        await token.multiMint([owner.address, other.address]);
        expect(await token.ownerOf(0)).to.equal(owner.address);
        expect(await token.balanceOf(owner.address)).to.equal(1);
        expect(await token.ownerOf(1)).to.equal(other.address);
        expect(await token.balanceOf(other.address)).to.equal(1);
        expect(await token.totalSupply()).to.equal(2);
    });

    it("Token URI is correct", async function () {
        await token.mint(owner.address, 1);
        expect(await token.tokenURI(0)).to.equal("base/0");
    });

    it("Owner and only owner can set base URI", async function () {
        await expect(token.connect(other).setBaseURI("newbase/")).to.be.revertedWith(
            "Ownable: caller is not the owner",
        );

        await token.setBaseURI("newbase/");
        await token.mint(owner.address, 1);
        expect(await token.tokenURI(0)).to.equal("newbase/0");
    });

    it("Owner and only owner can set minter", async function () {
        await expect(token.connect(other).setMinter(other.address)).to.be.revertedWith(
            "Ownable: caller is not the owner",
        );

        await token.setMinter(other.address);
        expect(await token.minter()).to.equal(other.address);
    });

    describe("Permit", function () {
        let block: Block, permit: ERC721Permit, sig: Signature;

        this.beforeEach(async function () {
            await token.mint(owner.address, 1);

            block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber());

            permit = {
                owner: owner.address,
                spender: other.address,
                tokenId: 0,
                deadline: block.timestamp + 50,
                nonce: 0,
            };
            sig = await signMessage(owner, DomainERC721(token), TypesERC721, permit);
        });

        it("Nonce is basically valid", async function () {
            expect(await token.nonceOf(owner.address)).to.equal(0);
        });

        it("Can't permit with expired signature", async function () {
            await increaseTime(100);
            await expect(
                token
                    .connect(other)
                    .permit(
                        owner.address,
                        other.address,
                        0,
                        block.timestamp + 50,
                        sig.v,
                        sig.r,
                        sig.s,
                    ),
            ).to.be.revertedWith("ERC721Permit: expired deadline");
        });

        it("Can't permit with wrong signer", async function () {
            sig = await signMessage(other, DomainERC721(token), TypesERC721, permit);
            await expect(
                token
                    .connect(other)
                    .permit(
                        owner.address,
                        other.address,
                        0,
                        block.timestamp + 50,
                        sig.v,
                        sig.r,
                        sig.s,
                    ),
            ).to.be.revertedWith("ERC721Permit: invalid signature");
        });

        it("Can't permit if token is not owned by signer", async function () {
            permit.owner = other.address;
            sig = await signMessage(other, DomainERC721(token), TypesERC721, permit);

            await expect(
                token
                    .connect(other)
                    .permit(
                        other.address,
                        other.address,
                        0,
                        block.timestamp + 50,
                        sig.v,
                        sig.r,
                        sig.s,
                    ),
            ).to.be.revertedWith("ERC721Permit: signer is not owner nor approved for all");
        });

        it("Can permit with valid sig", async function () {
            await token
                .connect(other)
                .permit(owner.address, other.address, 0, block.timestamp + 50, sig.v, sig.r, sig.s);

            expect(await token.getApproved(0)).to.equal(other.address);
        });
    });

    describe("Permit all", function () {
        let block: Block, permit: ERC721PermitAll, sig: Signature;

        this.beforeEach(async function () {
            await token.mint(owner.address, 1);

            block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber());

            permit = {
                owner: owner.address,
                spender: other.address,
                deadline: block.timestamp + 50,
                nonce: 0,
            };
            sig = await signMessage(owner, DomainERC721(token), TypesAllERC721, permit);
        });

        it("Can't permit with expired signature", async function () {
            await increaseTime(100);
            await expect(
                token
                    .connect(other)
                    .permitAll(
                        owner.address,
                        other.address,
                        block.timestamp + 50,
                        sig.v,
                        sig.r,
                        sig.s,
                    ),
            ).to.be.revertedWith("ERC721Permit: expired deadline");
        });

        it("Can't permit with wrong signer", async function () {
            sig = await signMessage(other, DomainERC721(token), TypesAllERC721, permit);
            await expect(
                token
                    .connect(other)
                    .permitAll(
                        owner.address,
                        other.address,
                        block.timestamp + 50,
                        sig.v,
                        sig.r,
                        sig.s,
                    ),
            ).to.be.revertedWith("ERC721Permit: invalid signature");
        });

        it("Can permit with valid sig", async function () {
            await token
                .connect(other)
                .permitAll(owner.address, other.address, block.timestamp + 50, sig.v, sig.r, sig.s);

            expect(await token.isApprovedForAll(owner.address, other.address)).to.be.true;
        });
    });
});
