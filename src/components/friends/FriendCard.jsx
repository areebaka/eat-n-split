import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Button,
  Chip,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { MoreVert, Delete, Person, AccountBalance } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/calculations';

const FriendCard = ({ friend }) => {
  const { settleUp, deleteFriend, getFriendBills } = useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const friendBills = getFriendBills(friend.id);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettleUp = () => {
    settleUp(friend.id);
    handleMenuClose();
  };

  const handleDeleteFriend = () => {
    deleteFriend(friend.id);
    setDeleteDialogOpen(false);
    handleMenuClose();
  };

  const getBalanceColor = () => {
    if (friend.balance > 0) return 'success.main';
    if (friend.balance < 0) return 'error.main';
    return 'grey.500';
  };

  const getBalanceText = () => {
    if (friend.balance > 0) return `You're Owed ${formatCurrency(friend.balance)}`;
    if (friend.balance < 0) return `You owe ${formatCurrency(Math.abs(friend.balance))}`;
    return 'Settled up';
  };

  const getChipColor = () => {
    if (friend.balance > 0) return 'success';
    if (friend.balance < 0) return 'error';
    return 'default';
  };

  return (
    <>
      <Card 
        sx={{ 
          borderRadius: 3, 
          boxShadow: 3, 
          ':hover': { boxShadow: 6 },
          transition: 'all 0.3s ease',
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Menu Button */}
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        <CardContent sx={{ textAlign: 'center', flexGrow: 1, pt: 4 }}>
          {/* Avatar */}
          <Avatar
            sx={{
              bgcolor: getBalanceColor(),
              width: 64,
              height: 64,
              margin: '0 auto',
              mb: 2,
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            {friend.avatar}
          </Avatar>

          {/* Friend Name */}
          <Typography variant="h6" fontWeight="600" gutterBottom>
            {friend.name}
          </Typography>

          {/* Balance Chip */}
          <Chip
            label={getBalanceText()}
            color={getChipColor()}
            variant={friend.balance === 0 ? "outlined" : "filled"}
            sx={{ mb: 2 }}
          />

          {/* Bills Count */}
          <Typography variant="body2" color="text.secondary">
            {friendBills.length} bill{friendBills.length !== 1 ? 's' : ''} shared
          </Typography>
        </CardContent>

        {/* Actions */}
        {friend.balance < 0 && (
          <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AccountBalance />}
              onClick={handleSettleUp}
              size="small"
            >
              Settle Up
            </Button>
          </CardActions>
        )}

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {friend.balance < 0 && (
            <MenuItem onClick={handleSettleUp}>
              <AccountBalance sx={{ mr: 1 }} />
              Settle Up
            </MenuItem>
          )}
          <MenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} />
            Delete Friend
          </MenuItem>
        </Menu>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Friend</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {friend.name}? This will also remove them from all shared bills.
          </Typography>
          {friend.balance !== 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="body2" color="warning.dark">
                <strong>Warning:</strong> This friend has an outstanding balance of{' '}
                {formatCurrency(Math.abs(friend.balance))}. 
                {friend.balance > 0 ? ' They owe you money.' : ' You owe them money.'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteFriend} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FriendCard;