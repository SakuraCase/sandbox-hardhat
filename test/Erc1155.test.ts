import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Erc1155", async () => {
  let erc1155: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("Erc1155", owner);
    const contract = await ContractFactory.deploy();
    await contract.deployed();
    erc1155 = await ContractFactory.attach(contract.address);
  });

  it("mint", async () => {
    await erc1155.mint(owner.address, 0, 100, "0x");
    expect(await erc1155.balanceOf(owner.address, 0)).to.equal(100);
    expect(await erc1155.balanceOf(addr1.address, 0)).to.equal(0);
    expect(await erc1155.uri(0)).to.equal(
      "https://raw.githubusercontent.com/SakuraCase/sandbox-solidity/main/metadata/erc1155/{id}.json"
    );
  });
});
