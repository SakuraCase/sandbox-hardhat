import { ethers } from "hardhat";

async function main() {
  const contractAddress = "";

  const [deployer] = await ethers.getSigners();
  console.log(`deployer: ${deployer.address}`);

  const contractFactory = await ethers.getContractFactory("Erc721A", deployer);
  const erc721A = contractFactory.attach(contractAddress);
  await erc721A.safeMint(deployer.address, 3);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
