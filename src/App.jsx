import { Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from "./pages/Profile";
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import NewTask from './pages/NewTask';
import { TasksProvider } from './context/TasksContext';

const App = () => {
  const { theme } = useTheme();

  const muiTheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <TasksProvider> {/* ← Обёртка здесь! */}
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/task/new" element={<ProtectedRoute><NewTask /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TasksProvider>
    </MuiThemeProvider>
  );
};

export default App;