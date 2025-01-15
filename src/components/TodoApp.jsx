import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, IconButton, Select, MenuItem, Alert, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function TodoApp() {
  const currentUser = localStorage.getItem('currentUser');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  // List of keywords to check for weather integration
  const outdoorKeywords = [
    'walk', 'jog', 'jogging', 'playing', 'out', 'outside', 'run', 'running', 'cycle', 'cycling',
    'sports', 'shopping', 'outing', 'camping', 'trip', 'walks', 'jogged', 'ran', 'cycled', 'shopped',
    'camped', 'tripped', 'playing', 'walking', 'jogging', 'running', 'cycling', 'camping', 'shopping', 'outing'
  ];

  // Load tasks from local storage for the current user
  useEffect(() => {
    const userTasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];
    setTasks(userTasks);
  }, [currentUser]);

  // Save tasks to local storage for the current user
  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(updatedTasks));
  };

  // Fetch weather data
  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=08743bd096995e9f3c923cc880590a8e`
      );
      const { name, weather, main } = response.data;
      setWeather({
        location: name,
        description: weather[0].description,
        temperature: (main.temp - 273.15).toFixed(2),
      });
      setError('');
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Unable to fetch weather data. Please try again later.');
    }
  };

  // Check if any task contains an outdoor-related keyword
  useEffect(() => {
    const hasOutdoorTask = tasks.some((task) =>
      outdoorKeywords.some((keyword) =>
        task.text.toLowerCase().includes(keyword)
      )
    );
    if (hasOutdoorTask) {
      fetchWeather();
    } else {
      setWeather(null);
    }
  }, [tasks]);

  // Add a new task
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const newTasks = [...tasks, { id: Date.now(), text: newTask, priority }];
    saveTasks(newTasks);
    setNewTask('');
    setPriority('Medium');
  };

  // Delete a task
  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  return (
    <Grid container spacing={3} sx={{ mt: 5, px: 2 }}>
      {/* Left Side: Message Box */}
      <Grid item xs={12} md={4}>
        <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f1f8e9' }}>
          <Typography variant="h6" gutterBottom>
            Weather API Integrated
          </Typography>
          <Typography variant="body2">
            This application integrates with a weather API. Weather information will be displayed when outdoor-related tasks are added to the list. Examples include:
          </Typography>
          <ul>
            <li>Walking</li>
            <li>Running</li>
            <li>Camping</li>
            <li>Shopping</li>
            <li>Trip</li>
          </ul>
          <Typography variant="body2">
            Tasks containing these keywords (and their tenses) will trigger weather updates.
          </Typography>
        </Box>
      </Grid>

      {/* Right Side: Todo List */}
      <Grid item xs={12} md={8}>
        <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <Typography variant="h4" sx={{ textAlign: 'center', mb: 3 }}>
            {`Todo List for ${currentUser}`}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="Add a Task"
              variant="outlined"
              fullWidth
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              sx={{ width: 120 }}
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
            <Button variant="contained" onClick={handleAddTask}>
              Add Task
            </Button>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {weather && (
            <Box sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#e3f2fd' }}>
              <Typography variant="h6">Weather Update</Typography>
              <Typography>{`Location: ${weather.location}`}</Typography>
              <Typography>{`Description: ${weather.description}`}</Typography>
              <Typography>{`Temperature: ${weather.temperature}°C`}</Typography>
            </Box>
          )}
          <List>
            {tasks.map((task) => (
              <ListItem
                key={task.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #ddd',
                  py: 1,
                }}
              >
                <ListItemText
                  primary={task.text}
                  secondary={`Priority: ${task.priority}`}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                  secondaryTypographyProps={{
                    color: task.priority === 'High' ? 'error.main' : task.priority === 'Low' ? 'success.main' : 'text.secondary',
                  }}
                />
                <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>
    </Grid>
  );
}

export default TodoApp;
