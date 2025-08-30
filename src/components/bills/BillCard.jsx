import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Avatar,
  AvatarGroup,
  Tooltip
} from '@mui/material';
import {
  MoreVert,
  Delete,
  Receipt,
  Person,
  CalendarToday,
  Category as CategoryIcon
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/calculations';

const BillCard = ({ bill }) => {
  const { friends, deleteBill } = useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteBill = () => {
    deleteBill(bill.id);
    setDeleteDialogOpen(false);
    handleMenuClose();
  };

  const getParticipants = () => {
    return bill.participants.map(id => friends.find(f => f.id === id)).filter(Boolean);
  };

  const sharePerPerson = bill.amount / bill.participants.length;

  const getCategoryColor = (category) => {
    const colors = {
      'Food': 'success',
      'Entertainment': 'secondary',
      'Transportation': 'info',
      'Utilities': 'warning',
      'Shopping': 'error',
      'Other': 'default'
    };
    return colors[category] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Card 
        sx={{ 
          borderRadius: 3,
          boxShadow: 2,
          ':hover': { 
            boxShadow: 4,
            transform: 'translateY(-2px)'
          },
          transition: 'all 0.3s ease',
          position: 'relative'
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

        <CardContent sx={{ pb: 2 }}>
          {/* Header with Amount */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            mb: 2
          }}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {bill.description}
              </Typography>
              
              {/* Category Chip */}
              {bill.category && (
                <Chip
                  icon={<CategoryIcon />}
                  label={bill.category}
                  color={getCategoryColor(bill.category)}
                  size="small"
                  sx={{ mb: 1 }}
                />
              )}
            </Box>
            
            <Typography 
              variant="h4" 
              color="primary.main" 
              fontWeight="bold"
              sx={{ textAlign: 'right' }}
            >
              {formatCurrency(bill.amount)}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Bill Details */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Who Paid */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person color="action" />
              <Typography variant="body2" color="text.secondary">
                Paid by <strong>{bill.paidByName}</strong>
              </Typography>
            </Box>

            {/* Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday color="action" />
              <Typography variant="body2" color="text.secondary">
                {formatDate(bill.date)}
              </Typography>
            </Box>

            {/* Participants */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AvatarGroup 
                max={4}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 24,
                    height: 24,
                    fontSize: '0.75rem'
                  }
                }}
              >
                {getParticipants().map((participant) => (
                  <Tooltip key={participant.id} title={participant.name}>
                    <Avatar
                      sx={{ 
                        bgcolor: 'primary.main',
                        width: 24,
                        height: 24,
                        fontSize: '0.75rem'
                      }}
                    >
                      {participant.avatar}
                    </Avatar>
                  </Tooltip>
                ))}
              </AvatarGroup>
              <Typography variant="body2" color="text.secondary">
                Split between {bill.participants.length} people
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Split Amount */}
          <Box sx={{ 
            bgcolor: 'primary.light', 
            color: 'white',
            p: 2, 
            borderRadius: 2,
            textAlign: 'center'
          }}>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Amount per person
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {formatCurrency(sharePerPerson)}
            </Typography>
          </Box>
        </CardContent>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} />
            Delete Bill
          </MenuItem>
        </Menu>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Bill</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to delete this bill?
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              <strong>{bill.description}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatCurrency(bill.amount)} • {formatDate(bill.date)}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This will also reverse all balance changes related to this bill.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteBill} 
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

export default BillCard;