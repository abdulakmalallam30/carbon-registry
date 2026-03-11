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
