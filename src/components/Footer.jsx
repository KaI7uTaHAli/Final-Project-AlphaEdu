import { Typography, Box } from '@mui/material';

const Footer = () => (
   <Box sx={{ textAlign: 'center', py: 2, borderTop: '1px solid #ccc' }}>
      <Typography variant="body2">&copy; {new Date().getFullYear()} TaskTracker</Typography>
   </Box>
);

export default Footer;
