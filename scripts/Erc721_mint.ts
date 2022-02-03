import { ethers } from "hardhat";

async function main() {
  const contractAddress = "";

  const [deployer] = await ethers.getSigners();
  console.log(`deployer: ${deployer.address}`);

  const contractFactory = await ethers.getContractFactory("Erc721", deployer);
  const erc721 = contractFactory.attach(contractAddress);
  await erc721.safeMint(deployer.address, 0);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
