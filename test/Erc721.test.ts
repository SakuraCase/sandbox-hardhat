import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Erc721", async () => {
  let erc721: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("Erc721", owner);
    const contract = await ContractFactory.deploy();
    await contract.deployed();
    erc721 = await ContractFactory.attach(contract.address);
  });

  it("mint", async () => {
    await erc721.safeMint(owner.address, 0);
    expect(await erc721.totalSupply()).to.equal(1);
    expect(await erc721.balanceOf(owner.address)).to.equal(1);
    expect(await erc721.balanceOf(addr1.address)).to.equal(0);
    expect(await erc721.ownerOf(0)).to.equal(owner.address);
    expect(await erc721.tokenURI(0)).to.equal(
      "https://raw.githubusercontent.com/SakuraCase/sandbox-solidity/main/metadata/erc721/0.json"
    );
  });
});
