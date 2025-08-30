import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';

const AddFriend = ({ open, onClose }) => {
  const { friends, addFriend } = useApp();
  const [friendName, setFriendName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const trimmedName = friendName.trim();
    
    if (!trimmedName) {
      setError('Please enter a friend name');
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }
    
    if (trimmedName.length > 30) {
      setError('Name must be less than 30 characters');
      return;
    }
    
    // Check if friend already exists (case insensitive)
    const existingFriend = friends.find(
      friend => friend.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (existingFriend) {
      setError('A friend with this name already exists');
      return;
    }
    
    // Add friend
    try {
      addFriend(trimmedName);
      handleClose();
    } catch (err) {
      setError('Failed to add friend. Please try again.');
    }
  };

  const handleClose = () => {
    setFriendName('');
    setError('');
    onClose();
  };

  const handleNameChange = (e) => {
    setFriendName(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          <PersonAdd />
          Add New Friend
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              autoFocus
              label="Friend's Name"
              fullWidth
              variant="outlined"
              value={friendName}
              onChange={handleNameChange}
              error={!!error}
              placeholder="Enter your friend's name"
              helperText="This name will be used to identify your friend"
              inputProps={{ maxLength: 30 }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleClose}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={!friendName.trim()}
          >
            Add Friend
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddFriend;