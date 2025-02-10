import React from 'react';
import { Box } from '@mui/material';

const Content: React.FC = () => {
  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: 3, 
      backgroundColor: (theme) => theme.palette.background.default 
    }}>
      {/* Conteúdo principal será renderizado aqui */}
      Conteúdo Principal
    </Box>
  );
};

export default Content;
