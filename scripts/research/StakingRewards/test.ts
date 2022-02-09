import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import { ethers, network } from "hardhat";
import { nextBlockMine, balanceOf } from "../utils";

async function main() {
  // 手動マイニング設定
  await network.provider.send("evm_setAutomine", [false]);
  await network.provider.send("evm_setIntervalMining", [0]);

  const [deployer, tester1, tester2, tester3] = await ethers.getSigners();
  console.log(`tester1: ${tester1.address}`);
  console.log(`tester2: ${tester2.address}`);
  console.log(`tester3: ${tester3.address}`);

  // deploy erc20
  const factoryErc20 = await ethers.getContractFactory("Erc20", deployer);
  const erc20 = await factoryErc20.deploy();
  await nextBlockMine();

  // deploy staking contract
  const contractStakingRewards = await ethers.getContractFactory(
    "StakingRewards",
    deployer
  );
  const stakingRewards = await contractStakingRewards.deploy(
    deployer.address,
    erc20.address,
    erc20.address
  );
  await nextBlockMine();
  await showBalance(erc20, stakingRewards, deployer, tester1, tester2, tester3);

  // erc20の転送
  const decimals = 1;
  const token100 = ethers.BigNumber.from(decimals.toString()).mul(100);

  await erc20.mint(deployer.address, token100.mul(100));
  await erc20.transfer(tester1.address, token100.mul(5));
  await erc20.transfer(tester2.address, token100);
  await erc20.transfer(tester3.address, token100);
  await erc20.transfer(stakingRewards.address, token100.mul(6));
  await nextBlockMine();
  await showBalance(erc20, stakingRewards, deployer, tester1, tester2, tester3);

  // t=0 settings
  await stakingRewards.notifyRewardAmount(token100.mul(3));
  await nextBlockMine();

  // t=1
  await erc20.connect(tester1).approve(stakingRewards.address, token100.mul(9));
  await stakingRewards.connect(tester1).stake(token100);
  await nextBlockMine();

  // t=2
  await nextBlockMine();

  // t=3
  await erc20.connect(tester2).approve(stakingRewards.address, token100.mul(2));
  await stakingRewards.connect(tester2).stake(token100);
  await nextBlockMine();

  // t=4
  await erc20.connect(tester3).approve(stakingRewards.address, token100);
  await stakingRewards.connect(tester3).stake(token100);
  await nextBlockMine();

  // t=5
  await nextBlockMine();

  // t=6
  await stakingRewards.connect(tester2).exit();
  await nextBlockMine();
  await showBalance(erc20, stakingRewards, deployer, tester1, tester2, tester3);

  // t=7
  await nextBlockMine();

  // t=8
  await stakingRewards.connect(tester1).stake(token100.mul(4));
  await nextBlockMine();

  // t=9
  await nextBlockMine();

  // t=10
  await stakingRewards.connect(tester1).exit();
  await nextBlockMine();
  await showBalance(erc20, stakingRewards, deployer, tester1, tester2, tester3);

  // t=11
  await stakingRewards.connect(tester3).exit();
  await nextBlockMine();
  await showBalance(erc20, stakingRewards, deployer, tester1, tester2, tester3);
}

async function showBalance(
  erc20: Contract,
  staking: Contract,
  add1: SignerWithAddress,
  add2: SignerWithAddress,
  add3: SignerWithAddress,
  add4: SignerWithAddress
) {
  balanceOf(
    erc20,
    staking.address,
    add1.address,
    add2.address,
    add3.address,
    add4.address
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
