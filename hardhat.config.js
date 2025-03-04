require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // ✅ Load .env variables
// 0x6bF73827A8C3B3AE83Be87d187Eac6436F3DC249  address
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.API_URL || "", // ✅ Ensure API_URL is not undefined
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [] // ✅ Ensure PRIVATE_KEY is valid
    }
  }
};