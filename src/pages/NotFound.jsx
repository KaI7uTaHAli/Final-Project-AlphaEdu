import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <Typography variant="h3">404</Typography>
      <Typography variant="h5" gutterBottom>
        Такой страницы не существует
      </Typography>
      <Button variant="contained" component={Link} to="/">
        Вернуться на главную
      </Button>
    </div>
  );
};

export default NotFound;
