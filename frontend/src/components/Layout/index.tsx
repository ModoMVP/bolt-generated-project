import React from 'react';
import { Box } from '@mui/material';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Content from '../Content';

const Layout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Header />
        <Content />
      </Box>
    </Box>
  );
};

export default Layout;
