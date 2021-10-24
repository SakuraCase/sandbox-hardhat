import { BigNumberish } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Erc20 } from "../typechain"

describe("Erc20", async () => {
  let contract: Erc20;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let decimal: BigNumberish;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("Erc20");
    contract = await Contract.deploy();
    await contract.deployed();
    decimal = await contract.decimals();
    [owner, addr1] = await ethers.getSigners();
    contract.connect(owner)
  });

  it("mint", async () => {
    const num = ethers.utils.parseUnits("1", decimal);
    await contract.mint(owner.address, num);
    expect(await contract.totalSupply()).to.equal(num);
    expect(await contract.balanceOf(owner.address)).to.equal(num);
  });

  it("transfer",  async function () {
    const supply = ethers.utils.parseUnits("1", decimal);
    const trans = ethers.utils.parseUnits("0.5", decimal);
    await contract.mint(owner.address, supply);
    await contract.transfer(addr1.address, trans);
    expect(await contract.balanceOf(owner.address)).to.equal(trans);
    expect(await contract.balanceOf(addr1.address)).to.equal(trans);
  });

  it("approve & transferFrom",  async function () {
    const supply = ethers.utils.parseUnits("1", decimal);
    const trans = ethers.utils.parseUnits("0.5", decimal);
    await contract.mint(owner.address, supply);
    await contract.transfer(addr1.address, trans);
    expect(await contract.balanceOf(addr1.address)).to.equal(trans);

    // ownerがaddr1からtransfer(失敗)
    const res1 = await contract.connect(owner)
      .transferFrom(addr1.address, owner.address, trans)
      .then(() => true).catch(() => false);
    expect(res1).to.false;

    // approve
    await contract.connect(addr1).approve(owner.address, supply);
    expect(await contract.allowance(addr1.address, owner.address)).to.equal(supply);

    // ownerがaddr1からtransfer(成功)
    const res2 = await contract.connect(owner)
      .transferFrom(addr1.address, owner.address, trans)
      .then(() => true).catch(() => false);
    expect(res2).to.true;
    expect(await contract.balanceOf(owner.address)).to.equal(supply);
    expect(await contract.balanceOf(addr1.address)).to.equal(0);
  });
});
