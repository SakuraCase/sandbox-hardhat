import { ethers, network } from "hardhat";
import { Contract } from "ethers";

export async function nextBlockMine() {
  const time = await getNextBlockTimestamp();
  await network.provider.send("evm_setNextBlockTimestamp", [time]);
  await network.provider.send("evm_mine");
}

async function getNextBlockTimestamp() {
  const blockNum = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNum);
  const timestamp = block.timestamp;
  console.log("blcok info: ", blockNum, timestamp);
  return timestamp + 1;
}

export async function balanceOf(erc20: Contract, ...addresses: string[]) {
  const balances = [];
  for (let i = 0; i < addresses.length; i++) {
    const b = await erc20.balanceOf(addresses[i]);
    balances.push(b);
  }
  console.log("balanceOf: ", ...balances);
}
