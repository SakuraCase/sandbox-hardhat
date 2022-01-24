import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Erc721 } from "../typechain";

describe("Erc721", async () => {
  let contract: Erc721;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("Erc721");
    contract = await Contract.deploy();
    await contract.deployed();
    [owner, addr1] = await ethers.getSigners();
    contract.connect(owner);
  });

  it("mint", async () => {
    await contract.safeMint(owner.address, 0);
    expect(await contract.totalSupply()).to.equal(1);
    expect(await contract.balanceOf(owner.address)).to.equal(1);
    expect(await contract.balanceOf(addr1.address)).to.equal(0);
    expect(await contract.ownerOf(0)).to.equal(owner.address);
    expect(await contract.tokenURI(0)).to.equal(
      "https://github.com/SakuraCase/sandbox-solidity/tree/main/metadata/erc721/0.json"
    );
  });
});
