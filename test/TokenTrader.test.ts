import { ethers, network } from "hardhat";
import { expect } from "chai";
import { ERC721Preset, TokenTrader } from "../types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { increaseTime, signMessage } from "./utils";
import { Contract } from "ethers";

const { parseUnits } = ethers.utils;
const chainId = network.config.chainId!;

describe("Test TokenTrader contract", function () {
    let owner: SignerWithAddress, other: SignerWithAddress, signer: SignerWithAddress;
    let nft: ERC721Preset;
    let trader: TokenTrader;

    async function signWhitelist(account: string) {
        const TypesTrader = {
            Whitelist: [{ name: "account", type: "address" }],
        };
        return await signMessage(
            signer,
            {
                chainId,
                verifyingContract: trader.address,
            },
            TypesTrader,
            { account },
        );
    }

    this.beforeEach(async function () {
        [owner, other, signer] = await ethers.getSigners();

        const ERC721PresetFactory = await ethers.getContractFactory("ERC721Preset");
        nft = (await ERC721PresetFactory.deploy(
            "NFT",
            "NFT",
            "base/",
            owner.address,
        )) as ERC721Preset;

        const TokenTraderFactory = await ethers.getContractFactory("TokenTrader");
        trader = (await TokenTraderFactory.deploy(
            nft.address,
            parseUnits("0.1"),
            3 * 24 * 60 * 60,
            signer.address,
            "hash",
        )) as TokenTrader;

        await nft.setMinter(trader.address);
    });

    it("Can't buy before timelock passes without whitelist", async function () {
        await expect(trader.buy(1)).to.be.revertedWith("Only whitelisted can buy now");
    });

    it("Can't buy with unsuficcient message value", async function () {
        await increaseTime(3 * 24 * 60 * 60);
        await expect(trader.buy(1)).to.be.revertedWith("Value passed is too low");
    });

    it("Can buy ERC721 with correct arguments", async function () {
        await increaseTime(3 * 24 * 60 * 60);
        await expect(trader.buy(1, { value: parseUnits("0.1") })).to.emit(trader, "TokenBought");

        expect(await nft.ownerOf(0)).to.equal(owner.address);
        expect(await ethers.provider.getBalance(trader.address)).to.equal(parseUnits("0.1"));
    });

    it("Can buy multiple ERC721 with correct arguments", async function () {
        await increaseTime(3 * 24 * 60 * 60);
        await expect(trader.buy(2, { value: parseUnits("0.2") })).to.emit(trader, "TokenBought");

        expect(await nft.ownerOf(0)).to.equal(owner.address);
        expect(await nft.ownerOf(1)).to.equal(owner.address);
        expect(await ethers.provider.getBalance(trader.address)).to.equal(parseUnits("0.2"));
    });

    it("Can buy before timelock passes with whitelist signature", async function () {
        const sig = await signWhitelist(owner.address);

        await trader.buyWhitelist(1, sig.v, sig.r, sig.s, { value: parseUnits("0.1") });
        expect(await nft.ownerOf(0)).to.equal(owner.address);
    });

    it("Can't buy before timelock with wrong whitelist sig", async function () {
        const sig = await signWhitelist(other.address);

        await expect(
            trader.buyWhitelist(1, sig.v, sig.r, sig.s, { value: parseUnits("0.1") }),
        ).to.be.revertedWith("Invalid signature");
    });

    it("Owner and only owner can withdraw", async function () {
        await increaseTime(3 * 24 * 60 * 60);
        await trader.buy(1, { value: parseUnits("0.1") });

        await expect(trader.connect(other).withdraw()).to.be.revertedWith(
            "Ownable: caller is not the owner",
        );

        await trader.withdraw();
        expect(await ethers.provider.getBalance(trader.address)).to.equal(0);
    });

    it("Owner and only owner can set price", async function () {
        await expect(trader.connect(other).setPrice(parseUnits("1"))).to.be.revertedWith(
            "Ownable: caller is not the owner",
        );

        await trader.setPrice(parseUnits("1"));
        expect(await trader.price()).to.equal(parseUnits("1"));
    });
});
