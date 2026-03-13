const API_URL = 'http://localhost:5000';

export const getAccounts = async () => {
    try {
        const response = await fetch(`${API_URL}/accounts`);
        if (!response.ok) throw new Error('Failed to fetch accounts');
        return await response.json();
    } catch (error) {
        console.error('API Error (getAccounts):', error);
        return [];
    }
};

export const getProjects = async () => {
    try {
        const response = await fetch(`${API_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        return await response.json();
    } catch (error) {
        console.error('API Error (getProjects):', error);
        return [];
    }
};

export const registerProject = async (name, description, location, acres) => {
    try {
        const response = await fetch(`${API_URL}/register-project`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, location, acres }),
        });
        if (!response.ok) throw new Error('Failed to register project');
        return await response.json();
    } catch (error) {
        console.error('API Error (registerProject):', error);
        return { success: false, error: error.message };
    }
};

export const searchProjectById = async (projectId) => {
    try {
        const response = await fetch(`${API_URL}/projects/${projectId}`);
        if (!response.ok) throw new Error('Project not found');
        return await response.json();
    } catch (error) {
        console.error('API Error (searchProjectById):', error);
        return null;
    }
};

export const getCredits = async () => {
    try {
        const response = await fetch(`${API_URL}/credits`);
        if (!response.ok) throw new Error('Failed to fetch credits');
        return await response.json();
    } catch (error) {
        console.error('API Error (getCredits):', error);
        return [];
    }
};

export const issueCredit = async (projectId, amount, to) => {
    try {
        const response = await fetch(`${API_URL}/issue-credit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectId, amount, to }),
        });
        if (!response.ok) throw new Error('Failed to issue credit');
        return await response.json();
    } catch (error) {
        console.error('API Error (issueCredit):', error);
        return { success: false, error: error.message };
    }
};

export const verifyProject = async (projectId) => {
    try {
        const response = await fetch(`${API_URL}/verify-project`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectId }),
        });
        if (!response.ok) throw new Error('Failed to verify project');
        return await response.json();
    } catch (error) {
        console.error('API Error (verifyProject):', error);
        return { success: false, error: error.message };
    }
};

export const retireCredit = async (creditId) => {
    try {
        const response = await fetch(`${API_URL}/retire-credit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ creditId }),
        });
        if (!response.ok) throw new Error('Failed to retire credit');
        return await response.json();
    } catch (error) {
        console.error('API Error (retireCredit):', error);
        return { success: false, error: error.message };
    }
};

export const updateProjectStatus = async (projectId, status, rejectionReason = '') => {
    try {
        const response = await fetch(`${API_URL}/update-project-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectId, status, rejectionReason }),
        });
        if (!response.ok) throw new Error('Failed to update project status');
        return await response.json();
    } catch (error) {
        console.error('API Error (updateProjectStatus):', error);
        return { success: false, error: error.message };
    }
};

export const filterProjects = async (filters) => {
    try {
        const response = await fetch(`${API_URL}/projects/filter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filters),
        });
        if (!response.ok) throw new Error('Failed to filter projects');
        return await response.json();
    } catch (error) {
        console.error('API Error (filterProjects):', error);
        return [];
    }
};

export const getTransactions = async () => {
    try {
        const response = await fetch(`${API_URL}/transactions`);
        if (!response.ok) throw new Error('Failed to fetch transactions');
        return await response.json();
    } catch (error) {
        console.error('API Error (getTransactions):', error);
        return [];
    }
};

export const getUserTransactions = async (address) => {
    try {
        const response = await fetch(`${API_URL}/transactions/${address}`);
        if (!response.ok) throw new Error('Failed to fetch user transactions');
        return await response.json();
    } catch (error) {
        console.error('API Error (getUserTransactions):', error);
        return [];
    }
};

export const chatWithAssistant = async (message, context = {}) => {
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, context }),
        });

        if (!response.ok) throw new Error('Failed to get assistant response');
        return await response.json();
    } catch (error) {
        console.error('API Error (chatWithAssistant):', error);
        return {
            success: false,
            reply: 'Assistant is unavailable right now. Please try again in a moment.',
            source: 'error'
        };
    }
};
