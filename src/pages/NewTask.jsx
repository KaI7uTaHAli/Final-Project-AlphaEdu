import React, { useState } from 'react';
import Header from '../components/Header';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TasksContext';

const NewTask = () => {
  const { addTask } = useTasks();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await addTask({ title, description });
      navigate('/');
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Header />
      <Typography variant="h4" gutterBottom>
        Создание новой задачи
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Название задачи"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Описание"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Box>

        <Box display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Создать задачу'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default NewTask;