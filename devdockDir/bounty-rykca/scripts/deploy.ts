import { ethers } from "hardhat";

async function main() {
  const Innovation = await ethers.getContractFactory("Innovation");
  const innovation = await Innovation.deploy();

  await innovation.deployed();

  console.log(`Innovation contract deployed to ${innovation.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});