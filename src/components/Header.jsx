import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/" sx={{ color: '#fff', textDecoration: 'none' }}>
          Task Manager
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <ThemeToggle />
          <Button color="inherit" component={Link} to="/">Главная</Button>
          {user && <Button color="inherit" component={Link} to="/profile">Профиль</Button>}
          {!user && (
            <>
              <Button color="inherit" component={Link} to="/login">Вход</Button>
              <Button color="inherit" component={Link} to="/register">Регистрация</Button>
            </>
          )}
          {user && <Button color="inherit" onClick={handleLogout}>Выйти</Button>}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;