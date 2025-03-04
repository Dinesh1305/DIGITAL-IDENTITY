require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // ✅ Load .env variables
// 0x86ab9f453215774E50FcE92d1fe3e30Bb0B123E9  address
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.API_URL || "", // ✅ Ensure API_URL is not undefined
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [] // ✅ Ensure PRIVATE_KEY is valid
    }
  }
};