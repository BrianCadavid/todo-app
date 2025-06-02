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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const result = await currentService.login(loginForm.username, loginForm.password);
      setUser(result.user);
      setIsLoggedIn(true);
      loadTasks();
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
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error eliminando tarea:', error);
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
    <div style={{ padding: 20 }}>
      <h1>Bienvenido, {user?.username}</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
      <TaskStats tasks={tasks} />
      <button onClick={() => {
        setShowTaskForm(!showTaskForm);
        setTaskForm({ name: '', description: '' });
        setIsEditing(null);
      }}>
        Nueva tarea
      </button>
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
        <p>Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <p>No hay tareas</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            handleToggleStatus={handleToggleStatus}
            handleEditTask={handleEditTask}
            handleDeleteTask={handleDeleteTask}
          />
        ))
      )}
    </div>
  );
}
