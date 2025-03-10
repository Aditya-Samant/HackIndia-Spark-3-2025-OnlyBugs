const hre = require("hardhat");

async function main() {
  console.log("Deploying CertificateNFT contract...");

  const CertificateNFT = await hre.ethers.getContractFactory("CertificateNFT");
  const certificateNFT = await CertificateNFT.deploy();

  await certificateNFT.waitForDeployment();
  const address = await certificateNFT.getAddress();

  console.log("CertificateNFT deployed to:", address);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await certificateNFT.deploymentTransaction().wait(6);

  // Verify the contract on Etherscan
  console.log("Verifying contract on Etherscan...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified on Etherscan!");
  } catch (error) {
    console.log("Error verifying contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });