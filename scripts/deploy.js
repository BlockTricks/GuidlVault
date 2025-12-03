const hre = require("hardhat");

async function main() {
  console.log("Deploying GuidlVault...");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log(
    "Account balance:",
    (await hre.ethers.provider.getBalance(deployer.address)).toString()
  );

  // Deployment parameters
  // You can modify these values as needed
  const admin = deployer.address; // Admin address
  const treasurer = deployer.address; // Treasurer address (can be different)
  const minDeposit = hre.ethers.parseEther("0.01"); // Minimum deposit: 0.01 ETH
  const maxWithdrawal = hre.ethers.parseEther("10"); // Maximum withdrawal: 10 ETH
  const requiredApprovals = 2; // Number of approvals needed for withdrawals

  // Deploy the contract
  const GuidlVault = await hre.ethers.getContractFactory("GuidlVault");
  const vault = await GuidlVault.deploy(
    admin,
    treasurer,
    minDeposit,
    maxWithdrawal,
    requiredApprovals
  );

  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();

  console.log("\n✅ GuidlVault deployed successfully!");
  console.log("Contract address:", vaultAddress);
  console.log("\nDeployment parameters:");
  console.log("- Admin:", admin);
  console.log("- Treasurer:", treasurer);
  console.log("- Min Deposit:", hre.ethers.formatEther(minDeposit), "ETH");
  console.log(
    "- Max Withdrawal:",
    hre.ethers.formatEther(maxWithdrawal),
    "ETH"
  );
  console.log("- Required Approvals:", requiredApprovals.toString());

  // Wait for block confirmations before verification
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    await vault.deploymentTransaction().wait(5);
    console.log("✅ Contract confirmed on network:", hre.network.name);
  }

  // Verify contract on Etherscan/Basescan
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    try {
      console.log("\n🔍 Verifying contract on block explorer...");
      await hre.run("verify:verify", {
        address: vaultAddress,
        constructorArguments: [
          admin,
          treasurer,
          minDeposit,
          maxWithdrawal,
          requiredApprovals,
        ],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.log("⚠️  Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

