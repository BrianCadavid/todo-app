const apiService = {
  baseUrl: '/api',
  token: null,

  setToken: (newToken) => {
    apiService.token = `Bearer ${newToken}`;
  },

  getHeaders: () => ({
    'Content-Type': 'application/json',
    Authorization: apiService.token
  }),

  login: async (username, password) => {
    const response = await fetch(`${apiService.baseUrl}/account/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombreUsuario: username, contrasena: password })
    });

    if (!response.ok) throw new Error('Credenciales incorrectas');

    const data = await response.json();

    apiService.setToken(data.token);

    return {
      user: {
        username: data.nombreUsuario || username,
        role: data.rol || 'User'
      }
    };
  },

  getTasks: async () => {
    const response = await fetch(`${apiService.baseUrl}/tareas`, {
      headers: apiService.getHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener tareas');
    return response.json();
  },

  createTask: async (task) => {
    const response = await fetch(`${apiService.baseUrl}/tareas`, {
      method: 'POST',
      headers: apiService.getHeaders(),
      body: JSON.stringify(task)
    });
    if (!response.ok) throw new Error('Error al crear tarea');
    return response.json();
  },

  updateTask: async (id, task) => {
    const response = await fetch(`${apiService.baseUrl}/tareas/${id}`, {
      method: 'PUT',
      headers: apiService.getHeaders(),
      body: JSON.stringify(task)
    });
    if (!response.ok) throw new Error('Error al actualizar tarea');
    return response.json();
  },

  deleteTask: async (id) => {
    const response = await fetch(`${apiService.baseUrl}/tareas/${id}`, {
      method: 'DELETE',
      headers: apiService.getHeaders()
    });
    if (!response.ok) throw new Error('Error al eliminar tarea');
  }
};

export default apiService;
