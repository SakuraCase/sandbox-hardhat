import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`deployer: ${deployer.address}`);

  const contract = await ethers.getContractFactory("Erc721A", deployer);
  const erc721A = await contract.deploy();
  await erc721A.deployed();

  console.log("deployed to:", erc721A.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
