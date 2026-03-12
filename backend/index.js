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

// In-memory storage for project metadata (description, location, acres, status, rejectionReason)
// In production, use a real database like MongoDB or PostgreSQL
const projectMetadata = new Map();

// Transaction history storage
// Format: { type: 'issue'|'purchase'|'retire'|'verify'|'reject', projectId, creditId, amount, from, to, txHash, timestamp, rejectionReason }
const transactionHistory = [];

// Project status constants
const PROJECT_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under-review',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

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

    // Store additional metadata off-chain with initial 'pending' status
    projectMetadata.set(projectId, {
      description: description || '',
      location: location || '',
      acres: acres || 0,
      status: PROJECT_STATUS.PENDING,
      rejectionReason: '',
      createdAt: new Date().toISOString()
    });

    // Record transaction
    transactionHistory.push({
      type: 'register',
      projectId: projectId,
      projectName: name,
      from: accounts[0],
      txHash: tx.transactionHash,
      timestamp: new Date().toISOString()
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
      const metadata = projectMetadata.get(projectId) || { 
        description: '', 
        location: '', 
        acres: 0, 
        status: PROJECT_STATUS.PENDING,
        rejectionReason: '',
        createdAt: new Date().toISOString()
      };
      
      projects.push({
        id: projectId,
        name: p.name !== undefined ? p.name : p[1],
        owner: p.owner !== undefined ? p.owner : p[2],
        verified: p.verified !== undefined ? p.verified : p[3],
        description: metadata.description,
        location: metadata.location,
        acres: metadata.acres,
        status: metadata.status,
        rejectionReason: metadata.rejectionReason,
        createdAt: metadata.createdAt
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
    const metadata = projectMetadata.get(projectId) || { 
      description: '', 
      location: '', 
      acres: 0, 
      status: PROJECT_STATUS.PENDING,
      rejectionReason: '',
      createdAt: new Date().toISOString()
    };
    
    const project = {
      id: (p.id !== undefined ? p.id : p[0]).toString(),
      name: p.name !== undefined ? p.name : p[1],
      owner: p.owner !== undefined ? p.owner : p[2],
      verified: p.verified !== undefined ? p.verified : p[3],
      description: metadata.description,
      location: metadata.location,
      acres: metadata.acres,
      status: metadata.status,
      rejectionReason: metadata.rejectionReason,
      createdAt: metadata.createdAt
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

    // Update metadata status to 'verified'
    const metadata = projectMetadata.get(projectId.toString());
    if (metadata) {
      metadata.status = PROJECT_STATUS.VERIFIED;
      projectMetadata.set(projectId.toString(), metadata);
    }

    // Record transaction
    const p = await contract.methods.getProject(projectId).call();
    transactionHistory.push({
      type: 'verify',
      projectId: projectId.toString(),
      projectName: p.name !== undefined ? p.name : p[1],
      from: accounts[0],
      txHash: tx.transactionHash,
      timestamp: new Date().toISOString()
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

    // Get credit ID
    const creditCount = await contract.methods.creditCount().call();

    // Record transaction
    const p = await contract.methods.getProject(projectId).call();
    transactionHistory.push({
      type: 'issue',
      projectId: projectId.toString(),
      projectName: p.name !== undefined ? p.name : p[1],
      creditId: creditCount.toString(),
      amount: amount.toString(),
      from: accounts[0],
      to: to,
      txHash: tx.transactionHash,
      timestamp: new Date().toISOString()
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
app.post("/retire-credit", async (req, res) => {
  try {
    const { creditId } = req.body;

    // Get the credit owner from the contract
    const credit = await contract.methods.getCredit(creditId).call();

    const tx = await contract.methods.retireCredit(creditId).send({
      from: credit.owner,
      gas: 3000000,
    });

    // Record transaction
    const projectId = (credit.projectId !== undefined ? credit.projectId : credit[1]).toString();
    const amount = (credit.amount !== undefined ? credit.amount : credit[2]).toString();
    const p = await contract.methods.getProject(projectId).call();
    
    transactionHistory.push({
      type: 'retire',
      projectId: projectId,
      projectName: p.name !== undefined ? p.name : p[1],
      creditId: creditId.toString(),
      amount: amount,
      from: credit.owner,
      txHash: tx.transactionHash,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, txHash: tx.transactionHash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update project status (Admin only - for under-review, rejected)
app.post("/update-project-status", async (req, res) => {
  try {
    const { projectId, status, rejectionReason } = req.body;
    
    // Validate status
    const validStatuses = Object.values(PROJECT_STATUS);
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const metadata = projectMetadata.get(projectId.toString());
    if (!metadata) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Update metadata
    metadata.status = status;
    if (status === PROJECT_STATUS.REJECTED && rejectionReason) {
      metadata.rejectionReason = rejectionReason;
    }
    projectMetadata.set(projectId.toString(), metadata);

    // Record transaction for rejected projects
    if (status === PROJECT_STATUS.REJECTED) {
      const p = await contract.methods.getProject(projectId).call();
      const accounts = await web3.eth.getAccounts();
      transactionHistory.push({
        type: 'reject',
        projectId: projectId.toString(),
        projectName: p.name !== undefined ? p.name : p[1],
        from: accounts[0],
        rejectionReason: rejectionReason || 'No reason provided',
        timestamp: new Date().toISOString()
      });
    }

    res.json({ success: true, status, rejectionReason: metadata.rejectionReason });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Advanced filtering endpoint
app.post("/projects/filter", async (req, res) => {
  try {
    const { location, minAcres, maxAcres, status, hasCredits, sortBy, sortOrder } = req.body;
    
    // Get all projects first
    const count = await contract.methods.projectCount().call();
    let projects = [];

    for (let i = 1; i <= count; i++) {
      const p = await contract.methods.getProject(i).call();
      const projectId = (p.id !== undefined ? p.id : p[0]).toString();
      const metadata = projectMetadata.get(projectId) || { 
        description: '', 
        location: '', 
        acres: 0, 
        status: PROJECT_STATUS.PENDING,
        rejectionReason: '',
        createdAt: new Date().toISOString()
      };
      
      projects.push({
        id: projectId,
        name: p.name !== undefined ? p.name : p[1],
        owner: p.owner !== undefined ? p.owner : p[2],
        verified: p.verified !== undefined ? p.verified : p[3],
        description: metadata.description,
        location: metadata.location,
        acres: metadata.acres,
        status: metadata.status,
        rejectionReason: metadata.rejectionReason,
        createdAt: metadata.createdAt
      });
    }

    // Get credit counts for each project
    const creditCount = await contract.methods.creditCount().call();
    const projectCredits = {};
    
    for (let i = 1; i <= creditCount; i++) {
      const c = await contract.methods.getCredit(i).call();
      const projId = (c.projectId !== undefined ? c.projectId : c[1]).toString();
      const retired = c.retired !== undefined ? c.retired : c[4];
      
      if (!retired) {
        projectCredits[projId] = (projectCredits[projId] || BigInt(0)) + BigInt(c.amount !== undefined ? c.amount : c[2]);
      }
    }

    // Add credit info to projects
    projects = projects.map(p => ({
      ...p,
      availableCredits: (projectCredits[p.id] || BigInt(0)).toString()
    }));

    // Apply filters
    let filteredProjects = projects;

    if (location && location.trim()) {
      filteredProjects = filteredProjects.filter(p => 
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minAcres !== undefined && minAcres !== '') {
      filteredProjects = filteredProjects.filter(p => 
        Number(p.acres) >= Number(minAcres)
      );
    }

    if (maxAcres !== undefined && maxAcres !== '') {
      filteredProjects = filteredProjects.filter(p => 
        Number(p.acres) <= Number(maxAcres)
      );
    }

    if (status && status.length > 0) {
      filteredProjects = filteredProjects.filter(p => 
        status.includes(p.status)
      );
    }

    if (hasCredits === true) {
      filteredProjects = filteredProjects.filter(p => 
        BigInt(p.availableCredits) > BigInt(0)
      );
    }

    // Apply sorting
    if (sortBy) {
      filteredProjects.sort((a, b) => {
        let aVal, bVal;

        switch(sortBy) {
          case 'newest':
            aVal = new Date(a.createdAt);
            bVal = new Date(b.createdAt);
            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
          
          case 'oldest':
            aVal = new Date(a.createdAt);
            bVal = new Date(b.createdAt);
            return sortOrder === 'asc' ? bVal - aVal : aVal - bVal;
          
          case 'credits':
            aVal = BigInt(a.availableCredits);
            bVal = BigInt(b.availableCredits);
            return sortOrder === 'asc' ? 
              (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) : 
              (bVal < aVal ? -1 : bVal > aVal ? 1 : 0);
          
          case 'acres':
            aVal = Number(a.acres);
            bVal = Number(b.acres);
            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
          
          case 'name':
            return sortOrder === 'asc' ? 
              a.name.localeCompare(b.name) : 
              b.name.localeCompare(a.name);
          
          default:
            return 0;
        }
      });
    }

    res.json(filteredProjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get transaction history
app.get("/transactions", async (req, res) => {
  try {
    // Return transactions in reverse chronological order
    res.json(transactionHistory.slice().reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transaction history for a specific user
app.get("/transactions/:address", async (req, res) => {
  try {
    const address = req.params.address.toLowerCase();
    const userTransactions = transactionHistory.filter(tx => 
      (tx.from && tx.from.toLowerCase() === address) || 
      (tx.to && tx.to.toLowerCase() === address)
    );
    res.json(userTransactions.slice().reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
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