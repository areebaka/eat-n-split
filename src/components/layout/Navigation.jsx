import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Restaurant, Home, People, Receipt } from '@mui/icons-material';

const Navigation = ({ activeTab, onTabChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home /> },
    { id: 'friends', label: 'Friends', icon: <People /> },
    { id: 'bills', label: 'Bills', icon: <Receipt /> }
  ];

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        {/* Logo and App Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Restaurant sx={{ mr: 1, fontSize: '2rem' }} />
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              fontWeight: 'bold',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Eat N Split
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Navigation Items */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.id}
              color="inherit"
              onClick={() => onTabChange(item.id)}
              startIcon={!isMobile ? item.icon : null}
              sx={{
                fontWeight: activeTab === item.id ? 'bold' : 'normal',
                backgroundColor: activeTab === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderRadius: 2,
                px: { xs: 1, sm: 2 },
                minWidth: { xs: 'auto', sm: 'auto' }
              }}
            >
              {isMobile ? item.icon : item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;