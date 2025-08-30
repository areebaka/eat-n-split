import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Paper,
  Fab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Add, People } from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import AddFriend from '../components/friends/AddFriend';
import FriendCard from '../components/friends/FriendCard';

const Friends = () => {
  const { friends } = useApp();
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
          <People /> Friends
        </Typography>
        
        {!isMobile && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddDialog(true)}
            size="large"
          >
            Add Friend
          </Button>
        )}
      </Box>

      {/* Friends Grid */}
      {friends.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <People sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No friends added yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add your first friend to start splitting bills!
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddDialog(true)}
            size="large"
          >
            Add Your First Friend
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {friends.map((friend) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={friend.id}>
              <FriendCard friend={friend} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add friend"
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

      {/* Add Friend Dialog */}
      <AddFriend
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
      />
    </Container>
  );
};

export default Friends;