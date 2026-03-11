const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { Web3 } = require("web3");
require("dotenv").config();

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Web3 setup
const web3 = new Web3("http://127.0.0.1:7545");

// Contract setup
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = JSON.parse(fs.readFileSync("./abi.json", "utf8"));
const contract = new web3.eth.Contract(contractABI, contractAddress);

// In-memory storage for project metadata (description, location, acres)
// In production, use a real database like MongoDB or PostgreSQL
const projectMetadata = new Map();

// Routes
app.get("/", (req, res) => {
  res.send("Backend running");
});

// Get available Ganache accounts
app.get("/accounts", async (req, res) => {
  try {
    const accounts = await web3.eth.getAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register a new carbon-offset project
app.post("/register-project", async (req, res) => {
  try {
    const { name, description, location, acres } = req.body;
    const accounts = await web3.eth.getAccounts();

    // Register on blockchain (only name is stored on-chain)
    const tx = await contract.methods.registerProject(name).send({
      from: accounts[0],
      gas: 3000000,
    });

    // Get the project ID from the event or project count
    const projectCount = await contract.methods.projectCount().call();
    const projectId = projectCount.toString();

    // Store additional metadata off-chain
    projectMetadata.set(projectId, {
      description: description || '',
      location: location || '',
      acres: acres || 0
    });

    res.json({ 
      success: true, 
      txHash: tx.transactionHash,
      projectId: projectId 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch all registered projects
app.get("/projects", async (req, res) => {
  try {
    const count = await contract.methods.projectCount().call();
    let projects = [];

    for (let i = 1; i <= count; i++) {
      const p = await contract.methods.getProject(i).call();
      const projectId = (p.id !== undefined ? p.id : p[0]).toString();
      const metadata = projectMetadata.get(projectId) || { description: '', location: '', acres: 0 };
      
      projects.push({
        id: projectId,
        name: p.name !== undefined ? p.name : p[1],
        owner: p.owner !== undefined ? p.owner : p[2],
        verified: p.verified !== undefined ? p.verified : p[3],
        description: metadata.description,
        location: metadata.location,
        acres: metadata.acres
      });
    }

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Search project by ID
app.get("/projects/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    const count = await contract.methods.projectCount().call();
    
    if (projectId < 1 || projectId > count) {
      return res.status(404).json({ error: "Project not found" });
    }

    const p = await contract.methods.getProject(projectId).call();
    const metadata = projectMetadata.get(projectId) || { description: '', location: '', acres: 0 };
    
    const project = {
      id: (p.id !== undefined ? p.id : p[0]).toString(),
      name: p.name !== undefined ? p.name : p[1],
      owner: p.owner !== undefined ? p.owner : p[2],
      verified: p.verified !== undefined ? p.verified : p[3],
      description: metadata.description,
      location: metadata.location,
      acres: metadata.acres
    };

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Verify a project (admin only)
app.post("/verify-project", async (req, res) => {
  try {
    const { projectId } = req.body;
    const accounts = await web3.eth.getAccounts();

    const tx = await contract.methods.verifyProject(projectId).send({
      from: accounts[0],
      gas: 3000000,
    });

    res.json({ success: true, txHash: tx.transactionHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Issue carbon credit
app.post("/issue-credit", async (req, res) => {
  try {
    const { projectId, amount, to } = req.body;
    const accounts = await web3.eth.getAccounts();

    const tx = await contract.methods.issueCredit(projectId, amount, to).send({
      from: accounts[0],
      gas: 3000000,
    });

    res.json({ success: true, txHash: tx.transactionHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch all credits
app.get("/credits", async (req, res) => {
  try {
    const count = await contract.methods.creditCount().call();
    let credits = [];

    for (let i = 1; i <= count; i++) {
      const c = await contract.methods.getCredit(i).call();
      credits.push({
        id: (c.id !== undefined ? c.id : c[0]).toString(),
        projectId: (c.projectId !== undefined ? c.projectId : c[1]).toString(),
        amount: (c.amount !== undefined ? c.amount : c[2]).toString(),
        owner: c.owner !== undefined ? c.owner : c[3],
        retired: c.retired !== undefined ? c.retired : c[4]
      });
    }

    res.json(credits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Retire a credit
// Retire a credit
app.post("/retire-credit", async (req, res) => {
  try {
    const { creditId } = req.body;

    // Get the credit owner from the contract
    const credit = await contract.methods.getCredit(creditId).call();

    const tx = await contract.methods.retireCredit(creditId).send({
      from: credit.owner,
      gas: 3000000,
    });

    res.json({ success: true, txHash: tx.transactionHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server (always last)
app.listen(5000, async () => {
  console.log("Server running on port 5000");

  try {
    await web3.eth.net.getId();
    console.log("Connected to Ganache");
    console.log("CarbonRegistry contract loaded");
  } catch (error) {
    console.error("Failed to connect to Ganache:", error.message);
  }
});