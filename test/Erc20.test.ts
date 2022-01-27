import { BigNumberish } from "@ethersproject/bignumber";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Erc20", async () => {
  let erc20: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let decimal: BigNumberish;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("Erc20", owner);
    const contract = await ContractFactory.deploy();
    decimal = await contract.decimals();
    erc20 = await ContractFactory.attach(contract.address);
  });

  it("mint", async () => {
    const num = ethers.utils.parseUnits("1", decimal);
    await erc20.mint(owner.address, num);
    expect(await erc20.totalSupply()).to.equal(num);
    expect(await erc20.balanceOf(owner.address)).to.equal(num);
  });

  it("transfer", async function () {
    const supply = ethers.utils.parseUnits("1", decimal);
    const trans = ethers.utils.parseUnits("0.5", decimal);
    await erc20.mint(owner.address, supply);
    await erc20.transfer(addr1.address, trans);
    expect(await erc20.balanceOf(owner.address)).to.equal(trans);
    expect(await erc20.balanceOf(addr1.address)).to.equal(trans);
  });

  it("approve & transferFrom", async function () {
    const supply = ethers.utils.parseUnits("1", decimal);
    const trans = ethers.utils.parseUnits("0.5", decimal);
    await erc20.mint(owner.address, supply);
    await erc20.transfer(addr1.address, trans);
    expect(await erc20.balanceOf(addr1.address)).to.equal(trans);

    // ownerがaddr1からtransfer(失敗)
    const res1 = await erc20
      .connect(owner)
      .transferFrom(addr1.address, owner.address, trans)
      .then(() => true)
      .catch(() => false);
    expect(res1).to.false;

    // approve
    await erc20.connect(addr1).approve(owner.address, supply);
    expect(await erc20.allowance(addr1.address, owner.address)).to.equal(
      supply
    );

    // ownerがaddr1からtransfer(成功)
    const res2 = await erc20
      .connect(owner)
      .transferFrom(addr1.address, owner.address, trans)
      .then(() => true)
      .catch(() => false);
    expect(res2).to.true;
    expect(await erc20.balanceOf(owner.address)).to.equal(supply);
    expect(await erc20.balanceOf(addr1.address)).to.equal(0);
  });
});
