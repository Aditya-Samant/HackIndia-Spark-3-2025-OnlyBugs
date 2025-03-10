import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const infuraApiKey = process.env.INFURA_API_KEY; // Ensure this is set in your .env file

fetch(`https://sepolia.infura.io/v3/${infuraApiKey}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Current Block Number:", data.result);
  })
  .catch((error) => {
    console.error("Error fetching from Infura:", error);
  }); 