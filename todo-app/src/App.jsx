import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import TaskStats from './components/TaskStats';
import mockService from './services/mockService';
import apiService from './services/apiService';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useMockService, setUseMockService] = useState(false);

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [taskForm, setTaskForm] = useState({ name: '', description: '' });
  const [isEditing, setIsEditing] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const currentService = useMockService ? mockService : apiService;

  // 🔁 Cargar tareas automáticamente al iniciar sesión
  useEffect(() => {
    if (isLoggedIn) {
      loadTasks();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const result = await currentService.login(loginForm.username, loginForm.password);
      setUser(result.user);
      setIsLoggedIn(true);
      // loadTasks(); ❌ Ya no es necesario aquí
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    setLoading(true);
    try {
      const taskList = await currentService.getTasks();
      setTasks(taskList);
    } catch (error) {
      console.error('Error cargando tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        const updatedTask = await currentService.updateTask(isEditing, taskForm);
        setTasks(tasks.map(t => t.id === isEditing ? updatedTask : t));
        setIsEditing(null);
      } else {
        const newTask = await currentService.createTask(taskForm);
        setTasks([...tasks, newTask]);
      }
      setTaskForm({ name: '', description: '' });
      setShowTaskForm(false);
    } catch (error) {
      console.error('Error con la tarea:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
  setLoading(true);
  try {
    await currentService.deleteTask(id);
    // Filtra tareas para actualizar la lista
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
  } catch (error) {
    console.error('Error eliminando tarea:', error.message);
    alert('Error eliminando tarea: ' + error.message);
  } finally {
    setLoading(false);
  }
};


  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 0 ? 1 : 0;
    setLoading(true);
    try {
      const updatedTask = await currentService.updateTask(task.id, { ...task, status: newStatus });
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error('Error actualizando estado:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setTasks([]);
    setLoginForm({ username: '', password: '' });
  };

  const handleEditTask = (task) => {
    setTaskForm({ name: task.name, description: task.description });
    setIsEditing(task.id);
    setShowTaskForm(true);
  };

  if (!isLoggedIn) {
    return (
      <Login
        useMockService={useMockService}
        setUseMockService={setUseMockService}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        loading={loading}
        loginError={loginError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bienvenido, {user?.username}</h1>
          <button
            onClick={handleLogout}
            className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition"
          >
            Cerrar sesión
          </button>
        </div>

        <TaskStats tasks={tasks} />

        <div className="flex justify-end">
          <button
            onClick={() => {
              setShowTaskForm(!showTaskForm);
              setTaskForm({ name: '', description: '' });
              setIsEditing(null);
            }}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Nueva tarea
          </button>
        </div>

        {showTaskForm && (
          <TaskForm
            isEditing={isEditing}
            taskForm={taskForm}
            setTaskForm={setTaskForm}
            handleTaskSubmit={handleTaskSubmit}
            loading={loading}
            setShowTaskForm={setShowTaskForm}
            setIsEditing={setIsEditing}
          />
        )}

        {loading && tasks.length === 0 ? (
          <p className="text-white/70">Cargando tareas...</p>
        ) : tasks.length === 0 ? (
          <p className="text-white/70">No hay tareas</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                handleToggleStatus={handleToggleStatus}
                handleEditTask={handleEditTask}
                handleDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
