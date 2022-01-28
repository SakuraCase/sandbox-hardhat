import { ethers } from "hardhat";

async function main() {
  const contractAddress = "";

  const [deployer, tester] = await ethers.getSigners();
  console.log(`deployer: ${deployer.address}`);

  const contractFactory = await ethers.getContractFactory("Erc1155", deployer);
  const erc1155 = contractFactory.attach(contractAddress);
  await erc1155.safeTransferFrom(deployer.address, tester.address, 1, 10, "0x");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
