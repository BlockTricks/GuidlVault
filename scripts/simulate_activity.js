const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    console.log("🚀 Starting Activity Simulation (Explorer Supported)...");

    // 1. Setup
    const [funder] = await ethers.getSigners();
    console.log(`💰 Funder Account: ${funder.address}`);

    // Use env var or fall back to recent local (will fail on testnet if not updated)
    const VAULT_GUARD_ADDR = process.env.VAULT_GUARD_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    console.log(`📍 Interacting with VaultGuard at: ${VAULT_GUARD_ADDR}`);

    const VaultGuard = await ethers.getContractFactory("VaultGuard");
    let vaultGuard = VaultGuard.attach(VAULT_GUARD_ADDR);

    // Ensure Public Vault 0 exists
    try {
        await vaultGuard.getVaultJudges(0);
        console.log("✅ Vault 0 exists");
    } catch (e) {
        console.log("⚠️ Vault 0 not found. Creating a public vault first...");
        try {
            const tx = await vaultGuard.connect(funder).createVault(
                [funder.address],
                1,
                [100, 500, 2000, 5000],
                { value: ethers.parseEther("0.00001") } // minimal for mainnet
            );
            await tx.wait();
            console.log("✅ Created Vault 0");
        } catch (createError) {
            console.log("❌ Failed to create Vault 0. Make sure funder has balance.");
            process.exit(1);
        }
    }

    // 2. Generate 12 Agents
    console.log("\n🤖 Generating and Funding 12 Agents...");
    const agents = [];
    const startNonce = await funder.getNonce();

    // Create random wallet
    const wallet = ethers.Wallet.createRandom();
    console.log(`🔐 Master Mnemonic: "${wallet.mnemonic.phrase}"`);

    // Fund enough to cover gas on Base Mainnet (~0.00002 ETH = $0.06 USD)
    // Gas per tx is ~0.0000045 ETH, need buffer for 2-3 transactions
    const fundingAmount = ethers.parseEther("0.00002");

    for (let i = 0; i < 12; i++) {
        const path = `m/44'/60'/0'/0/${i}`;
        const childNode = ethers.HDNodeWallet.fromPhrase(wallet.mnemonic.phrase, "", path);
        const agent = new ethers.Wallet(childNode.privateKey, ethers.provider);

        // Check if agent already has funds (re-run safety)
        const bal = await ethers.provider.getBalance(agent.address);
        if (bal < ethers.parseEther("0.000001")) {
            console.log(`   Funding Agent ${i} (${agent.address.slice(0, 6)}...)...`);
            await (await funder.sendTransaction({
                to: agent.address,
                value: fundingAmount,
                // nonce: startNonce + i // Managed automatically is safer if slow
            })).wait();
        } else {
            console.log(`   Agent ${i} already funded.`);
        }

        agents.push(agent);
    }

    // Track owned vaults: map agent.address -> [vaultId1, vaultId2]
    const ownedVaults = {};
    agents.forEach(a => ownedVaults[a.address] = []);

    // 3. Interactions
    console.log("\n🎲 Starting Random Interactions...");

    const actions = [
        {
            name: "Create Vault",
            weight: 0.35,
            run: async (agent) => {
                const tx = await vaultGuard.connect(agent).createVault(
                    [agent.address], // Self as judge
                    1,
                    [100, 500, 2000, 5000],
                    { value: ethers.parseEther("0.000001") }
                );
                const receipt = await tx.wait();
                // Parse event to get ID
                const event = receipt.logs.find(l => {
                    try { return vaultGuard.interface.parseLog(l).name === "VaultCreated"; } catch { return false; }
                });
                if (event) {
                    const parsed = vaultGuard.interface.parseLog(event);
                    const id = parsed.args[0]; // vaultId
                    ownedVaults[agent.address].push(id);
                    console.log(`   [${agent.address.slice(0, 6)}] ✅ Created Vault #${id} (Tx: ${receipt.hash})`);
                } else {
                    console.log(`   [${agent.address.slice(0, 6)}] ✅ Created Vault (ID unknown)`);
                }
            }
        },
        {
            name: "Deposit Funds",
            weight: 0.3,
            run: async (agent) => {
                // Only deposit if we own a vault
                const myVaults = ownedVaults[agent.address];
                if (!myVaults || myVaults.length === 0) {
                    console.log(`   [${agent.address.slice(0, 6)}] ⏭️  Skip Deposit (No Vaults)`);
                    return;
                }
                const vaultId = myVaults[Math.floor(Math.random() * myVaults.length)];
                const tx = await vaultGuard.connect(agent).depositFunds(vaultId, { value: ethers.parseEther("0.0000001") });
                const r = await tx.wait();
                console.log(`   [${agent.address.slice(0, 6)}] 💰 Deposited to Vault #${vaultId} (Tx: ${r.hash})`);
            }
        },
        {
            name: "Submit Vulnerability",
            weight: 0.35,
            run: async (agent) => {
                const targetVault = 0;
                const sev = Math.floor(Math.random() * 4);
                const ipfs = "Qm" + Math.random().toString(36).substring(7);
                const tx = await vaultGuard.connect(agent).submitVulnerability(targetVault, ipfs, sev);
                const r = await tx.wait();
                console.log(`   [${agent.address.slice(0, 6)}] 🐛  Submitted Vuln to Vault #0 (Tx: ${r.hash})`);
            }
        }
    ];

    // Execute 2 rounds of actions per agent to save time/gas
    for (let round = 0; round < 2; round++) {
        console.log(`\n--- Round ${round + 1} ---`);
        for (const agent of agents) {
            const r = Math.random();
            let acc = 0;
            let selected = actions[0];
            for (const act of actions) {
                acc += act.weight;
                if (r <= acc) { selected = act; break; }
            }
            try {
                await selected.run(agent);
            } catch (e) {
                console.log(`   [${agent.address.slice(0, 6)}] ❌ Failed ${selected.name}: ${e.message.split('(')[0]}`);
            }
        }
    }

    console.log("\n✅ Simulation Complete!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
