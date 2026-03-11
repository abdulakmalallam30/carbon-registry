const fs = require("fs");
const path = require("path");
const { Web3 } = require("web3");

// Connect to Ganache
const web3 = new Web3("http://127.0.0.1:7545");

async function deployContract() {
  try {
    console.log("🔧 Deploying CarbonRegistry contract...\n");

    // Get accounts
    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0];
    console.log(`📍 Deployer address: ${deployer}`);
    console.log(`💰 Balance: ${web3.utils.fromWei(await web3.eth.getBalance(deployer), "ether")} ETH\n`);

    // Read ABI
    const abi = JSON.parse(fs.readFileSync("./abi.json", "utf8"));

    // Read the bytecode (you'll need to provide this)
    // Since we have the ABI but not bytecode, we need to compile the Solidity
    const solc = require("solc");
    const contractPath = path.resolve(__dirname, "../blockchain/CarbonRegistry.sol");
    const source = fs.readFileSync(contractPath, "utf8");

    // Prepare input for Solidity compiler
    const input = {
      language: "Solidity",
      sources: {
        "CarbonRegistry.sol": {
          content: source,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["abi", "evm.bytecode"],
          },
        },
      },
    };

    console.log("📦 Compiling contract...");
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    // Check for errors
    if (output.errors) {
      const errors = output.errors.filter(e => e.severity === "error");
      if (errors.length > 0) {
        console.error("❌ Compilation errors:");
        errors.forEach(err => console.error(err.formattedMessage));
        process.exit(1);
      }
    }

    const contract = output.contracts["CarbonRegistry.sol"]["CarbonRegistry"];
    const bytecode = contract.evm.bytecode.object;

    console.log("✅ Contract compiled successfully!\n");

    // Deploy contract
    console.log("🚀 Deploying to Ganache...");
    const CarbonRegistry = new web3.eth.Contract(abi);
    
    const deployedContract = await CarbonRegistry.deploy({
      data: "0x" + bytecode,
    }).send({
      from: deployer,
      gas: 3000000,
    });

    const contractAddress = deployedContract.options.address;
    console.log(`\n✅ Contract deployed successfully!`);
    console.log(`📍 Contract address: ${contractAddress}\n`);

    // Update .env file
    const envContent = `CONTRACT_ADDRESS=${contractAddress}\n`;
    fs.writeFileSync(".env", envContent);
    console.log("✅ .env file updated with contract address");

    console.log("\n🎉 Deployment complete! You can now start the backend server.");
    
    return contractAddress;
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

deployContract();
