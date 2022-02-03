import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Erc721A", async () => {
  let erc721A: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("Erc721A", owner);
    const contract = await ContractFactory.deploy();
    await contract.deployed();
    erc721A = await ContractFactory.attach(contract.address);
  });

  it("mint", async () => {
    await erc721A.safeMint(owner.address, 5);
    expect(await erc721A.totalSupply()).to.equal(5);
    expect(await erc721A.balanceOf(owner.address)).to.equal(5);
    expect(await erc721A.balanceOf(addr1.address)).to.equal(0);
    expect(await erc721A.ownerOf(0)).to.equal(owner.address);
    expect(await erc721A.ownerOf(4)).to.equal(owner.address);
    await erc721A.safeMint(owner.address, 3);
    expect(await erc721A.totalSupply()).to.equal(8);
    // const tokenURI = await erc721A.tokenURI(1);
    // console.log(tokenURI);
  });

  it("transfer", async () => {
    await erc721A.safeMint(owner.address, 5);
    expect(await erc721A.totalSupply()).to.equal(5);
    await erc721A.transferFrom(owner.address, addr1.address, 2);
    expect(await erc721A.ownerOf(0)).to.equal(owner.address);
    expect(await erc721A.ownerOf(1)).to.equal(owner.address);
    expect(await erc721A.ownerOf(2)).to.equal(addr1.address);
    expect(await erc721A.ownerOf(3)).to.equal(owner.address);
    expect(await erc721A.ownerOf(4)).to.equal(owner.address);
  });
});
