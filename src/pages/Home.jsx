import React, { useState } from 'react';
import Header from '../components/Header';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Fade,
  CircularProgress,
  TextField,
  Collapse,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TasksContext';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';

const getStatusProps = (status) => {
  switch (status) {
    case 'not_started':
      return { label: 'Не начата', icon: <RadioButtonUncheckedIcon />, color: '#fbc02d' };
    case 'in_progress':
      return { label: 'В процессе', icon: <HourglassEmptyIcon />, color: '#2196f3' };
    case 'completed':
      return { label: 'Выполнена', icon: <CheckCircleIcon />, color: '#4caf50' };
    default:
      return { label: 'Неизвестно', icon: null, color: '#9e9e9e' };
  }
};

const Home = () => {
  const { tasks, loading, updateTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState('all');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  const handleEdit = (task) => {
    setEditId(task._id);
    setEditForm({ ...task });
  };

  const handleSave = async () => {
    await updateTask(editId, editForm);
    setEditId(null);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
  };

  const filteredTasks = tasks?.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  }) || [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Header />
      <Typography variant="h4" gutterBottom>
        Список задач
      </Typography>

      <Box mb={2} display="flex" gap={2} alignItems="center">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/task/new')}
        >
          Создать задачу
        </Button>

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="filter-label">Фильтр</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            label="Фильтр"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all"><FilterListIcon sx={{ mr: 1 }} /> Все задачи</MenuItem>
            <MenuItem value="not_started"><RadioButtonUncheckedIcon sx={{ mr: 1 }} /> Не начаты</MenuItem>
            <MenuItem value="in_progress"><HourglassEmptyIcon sx={{ mr: 1 }} /> В процессе</MenuItem>
            <MenuItem value="completed"><CheckCircleIcon sx={{ mr: 1 }} /> Выполненные</MenuItem>
          </Select>
        </FormControl>

        {filter !== 'all' && (
          <Box
            onClick={() => setFilter('all')}
            sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
          >
            <ClearIcon fontSize="small" sx={{ mr: 0.5 }} /> Сбросить фильтр
          </Box>
        )}
      </Box>

      {filteredTasks.map((t, index) => {
        const { label, icon, color } = getStatusProps(t.status);
        const createdAt = t.createdAt ? dayjs(t.createdAt).format('DD.MM.YYYY HH:mm') : 'Неизвестно';
        const deadline = t.deadline ? dayjs(t.deadline).format('DD.MM.YYYY') : null;
        const isEditing = editId === t._id;

        return (
          <Fade in key={t._id} timeout={300 + index * 100}>
            <Card
              sx={{
                mb: 2,
                borderLeft: `6px solid ${color}`,
                '&:hover': { boxShadow: 4 },
              }}
            >
              <CardContent>
                <Collapse in={!isEditing} unmountOnExit>
                  <Typography variant="h6">{t.title}</Typography>
                  {t.description && <Typography variant="body2">{t.description}</Typography>}
                  <Box display="flex" alignItems="center" gap={1} mt={1}>{icon}<Typography>{label}</Typography></Box>
                  <Typography variant="caption">Создано: {createdAt}</Typography>
                  {deadline && <Typography variant="caption" color="error">Дедлайн: {deadline}</Typography>}
                  <Box mt={2} display="flex" gap={1}>
                    <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(t)}>Редактировать</Button>
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(t._id)}>Удалить</Button>
                  </Box>
                </Collapse>

                <Collapse in={isEditing} unmountOnExit>
                  <TextField
                    fullWidth
                    label="Заголовок"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Описание"
                    value={editForm.description || ''}
                    multiline
                    rows={3}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    sx={{ mb: 1 }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id={`status-label-${t._id}`}>Статус</InputLabel>
                    <Select
                      labelId={`status-label-${t._id}`}
                      value={editForm.status || ''}
                      label="Статус"
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    >
                      <MenuItem value="not_started">Не начата</MenuItem>
                      <MenuItem value="in_progress">В процессе</MenuItem>
                      <MenuItem value="completed">Выполнена</MenuItem>
                    </Select>
                  </FormControl>

                  <Box display="flex" gap={1}>
                    <Button variant="contained" color="primary" onClick={handleSave} startIcon={<SaveIcon />}>Сохранить</Button>
                    <Button variant="outlined" color="secondary" onClick={() => setEditId(null)} startIcon={<CloseIcon />}>Отмена</Button>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </Fade>
        );
      })}
    </Box>
  );
};

export default Home;