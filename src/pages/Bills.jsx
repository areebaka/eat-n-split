import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Fab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Add, Receipt } from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import AddBill from '../components/bills/AddBill';
import BillsList from '../components/bills/BillsList';

const Bills = () => {
  const { friends, bills } = useApp();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container sx={{ mt: 3, mb: 4 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Receipt /> Bills
        </Typography>
        
        {!isMobile && friends.length > 0 && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddDialog(true)}
            size="large"
          >
            Add Bill
          </Button>
        )}
      </Box>

      {/* Content */}
      {friends.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <Receipt sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Add some friends first!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You need friends to split bills with.
          </Typography>
        </Paper>
      ) : bills.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <Receipt sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No bills yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add your first bill to start splitting expenses!
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddDialog(true)}
            size="large"
          >
            Add Your First Bill
          </Button>
        </Paper>
      ) : (
        <BillsList bills={bills} />
      )}

      {/* Floating Action Button for Mobile */}
      {isMobile && friends.length > 0 && (
        <Fab
          color="primary"
          aria-label="add bill"
          onClick={() => setOpenAddDialog(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          <Add />
        </Fab>
      )}

      {/* Add Bill Dialog */}
      <AddBill
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
      />
    </Container>
  );
};

export default Bills;