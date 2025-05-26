const apiService = {
  baseUrl: 'https://localhost:5001/api', // Cambiar por tu URL
  token: null,
  
  login: async (username, password) => {
    const response = await fetch(`${apiService.baseUrl}/Account/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) throw new Error('Error de login');
    const data = await response.json();
    apiService.token = data.token;
    return data;
  },
  
  getTasks: async () => {
    
  },
  
  createTask: async (task) => {
    
  },
  
  updateTask: async (id, task) => {
    
  },
  
  deleteTask: async (id) => {
    
  }
};