const { ethers } = require("hardhat");

async function main() {
  try {
    // Get the Contract Factory
    const DigitalIdentity = await ethers.getContractFactory("Digital_identity");

    console.log("Deploying Digital Identity contract...");

    // Deploy the contract
    const digitalIdentity = await DigitalIdentity.deploy();

    // Wait for deployment to complete
    await digitalIdentity.deployed();

    console.log(`Contract successfully deployed at: ${digitalIdentity.address}`);
  } catch (error) {
    console.error("Error during contract deployment:", error);
    process.exit(1);
  }
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
