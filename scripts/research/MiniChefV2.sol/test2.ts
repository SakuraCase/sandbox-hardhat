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
  const dummySushi = await factoryErc20.deploy();
  const dummyLP = await factoryErc20.deploy();
  const dummyLP2 = await factoryErc20.deploy();
  await nextBlockMine();

  // deploy MiniChef
  const factoryMiniChef = await ethers.getContractFactory(
    "MiniChefV2",
    deployer
  );
  const miniChef = await factoryMiniChef.deploy(dummySushi.address);
  await nextBlockMine();

  // erc20の転送
  const decimals = 1;
  const e = ethers.BigNumber.from(decimals.toString()).mul(1);

  await dummyLP.mint(deployer.address, e.mul(1000));
  await dummyLP.transfer(tester1.address, e.mul(500));
  await dummyLP.transfer(tester2.address, e.mul(100));
  await dummyLP.transfer(tester3.address, e.mul(100));

  await dummyLP2.mint(deployer.address, e.mul(1000));
  await dummyLP2.transfer(tester1.address, e.mul(500));
  await dummyLP2.transfer(tester2.address, e.mul(100));
  await dummyLP2.transfer(tester3.address, e.mul(100));

  await dummySushi.mint(deployer.address, e.mul(100000));
  await dummySushi.transfer(miniChef.address, e.mul(100000));
  await nextBlockMine();
  await showBalance(dummySushi, dummyLP, dummyLP2, tester1, tester2, tester3);

  // t=0 settings
  await miniChef.setSushiPerSecond(e.mul(30));
  await miniChef.add(
    1,
    dummyLP.address,
    "0x0000000000000000000000000000000000000000"
  );
  await miniChef.add(
    1,
    dummyLP2.address,
    "0x0000000000000000000000000000000000000000"
  );
  await nextBlockMine();

  // t=1
  await dummyLP.connect(tester1).approve(miniChef.address, e.mul(10000));
  await dummyLP2.connect(tester1).approve(miniChef.address, e.mul(10000));
  await miniChef.connect(tester1).deposit(0, e.mul(100), tester1.address);
  await miniChef.connect(tester1).deposit(1, e.mul(100), tester1.address);
  await nextBlockMine();

  // t=2
  await nextBlockMine();

  // t=3
  await dummyLP.connect(tester2).approve(miniChef.address, e.mul(10000));
  await dummyLP2.connect(tester2).approve(miniChef.address, e.mul(10000));
  await miniChef.connect(tester2).deposit(0, e.mul(100), tester2.address);
  await miniChef.connect(tester2).deposit(1, e.mul(100), tester2.address);
  await nextBlockMine();

  // t=4
  await dummyLP.connect(tester3).approve(miniChef.address, e.mul(10000));
  await dummyLP2.connect(tester3).approve(miniChef.address, e.mul(10000));
  await miniChef.connect(tester3).deposit(0, e.mul(100), tester3.address);
  await miniChef.connect(tester3).deposit(1, e.mul(100), tester3.address);
  await nextBlockMine();

  // t=5
  await nextBlockMine();

  // t=6
  await miniChef
    .connect(tester2)
    .withdrawAndHarvest(0, e.mul(100), tester2.address);
  await miniChef
    .connect(tester2)
    .withdrawAndHarvest(1, e.mul(100), tester2.address);
  await nextBlockMine();
  await showBalance(dummySushi, dummyLP, dummyLP2, tester1, tester2, tester3);

  // t=7
  await nextBlockMine();

  // t=8
  await miniChef.connect(tester1).deposit(0, e.mul(400), tester1.address);
  await miniChef.connect(tester1).deposit(1, e.mul(400), tester1.address);
  await nextBlockMine();

  // t=9
  await nextBlockMine();

  // t=10
  await miniChef
    .connect(tester1)
    .withdrawAndHarvest(0, e.mul(500), tester1.address);
  await miniChef
    .connect(tester1)
    .withdrawAndHarvest(1, e.mul(500), tester1.address);

  await miniChef
    .connect(tester3)
    .withdrawAndHarvest(0, e.mul(100), tester3.address);
  await miniChef
    .connect(tester3)
    .withdrawAndHarvest(1, e.mul(100), tester3.address);
  await nextBlockMine();
  await showBalance(dummySushi, dummyLP, dummyLP2, tester1, tester2, tester3);
}

async function showBalance(
  dummySushi: Contract,
  dummyLP: Contract,
  dummyLP2: Contract,
  add1: SignerWithAddress,
  add2: SignerWithAddress,
  add3: SignerWithAddress
) {
  console.log("--Sushi--");
  await balanceOf(dummySushi, add1.address, add2.address, add3.address);
  console.log("--LP--");
  await balanceOf(dummyLP, add1.address, add2.address, add3.address);
  console.log("--LP2--");
  await balanceOf(dummyLP2, add1.address, add2.address, add3.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
