import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText 
} from '@mui/material';
import { 
  Dashboard, 
  People, 
  Business, 
  Timeline, 
  Task 
} from '@mui/icons-material';

const Sidebar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <List>
        {[
          { text: 'Dashboard', icon: <Dashboard /> },
          { text: 'Clientes', icon: <People /> },
          { text: 'Empresas', icon: <Business /> },
          { text: 'Funis de Venda', icon: <Timeline /> },
          { text: 'Tarefas', icon: <Task /> }
        ].map((item) => (
          <ListItem button key={item.text}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
