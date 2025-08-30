import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { AppProvider } from './context/AppContext';
import { theme } from './theme/theme';
import Navigation from './components/layout/Navigation';
import Home from './pages/Home';
import Friends from './pages/Friends';
import Bills from './pages/Bills';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'friends':
        return <Friends />;
      case 'bills':
        return <Bills />;
      default:
        return <Home />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Box sx={{ 
          minHeight: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Navigation */}
          <Navigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          {/* Main Content */}
          <Box component="main" sx={{ flex: 1 }}>
            {renderContent()}
          </Box>
        </Box>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;