import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Alert,
  Stack,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import { Receipt } from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { validateBillAmount, formatCurrency } from '../../utils/calculations';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AddBill = ({ open, onClose }) => {
  const { friends, addBill } = useApp();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paidBy: '',
    participants: [],
    category: 'Food',
  });
  const [errors, setErrors] = useState({});

  const categories = ['Food', 'Entertainment', 'Transportation', 'Utilities', 'Shopping', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    const amountValidation = validateBillAmount(parseFloat(formData.amount));
    if (!amountValidation.isValid) {
      newErrors.amount = amountValidation.error;
    }

    if (!formData.paidBy) {
      newErrors.paidBy = 'Please select who paid';
    }

    if (formData.participants.length === 0) {
      newErrors.participants = 'Please select at least one participant';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Add bill
    try {
      const paidByName = friends.find((f) => f.id === formData.paidBy)?.name;

      addBill({
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        paidBy: formData.paidBy,
        paidByName,
        participants: formData.participants,
        category: formData.category,
      });

      handleClose();
    } catch (err) {
      setErrors({ general: 'Failed to add bill. Please try again.' });
    }
  };

  const handleClose = () => {
    setFormData({
      description: '',
      amount: '',
      paidBy: '',
      participants: [],
      category: 'Food',
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleParticipantChange = (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      participants: typeof value === 'string' ? value.split(',') : value,
    }));

    if (errors.participants) {
      setErrors((prev) => ({ ...prev, participants: null }));
    }
  };

  const calculateSplitAmount = () => {
    if (formData.amount && formData.participants.length > 0) {
      return parseFloat(formData.amount) / formData.participants.length;
    }
    return 0;
  };

  const getParticipantName = (id) => {
    return friends.find((friend) => friend.id === id)?.name || '';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Receipt />
          Add New Bill
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {errors.general && <Alert severity="error">{errors.general}</Alert>}

            {/* Description */}
            <TextField
              label="Description"
              fullWidth
              value={formData.description}
              onChange={handleInputChange('description')}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="e.g., Dinner at restaurant"
            />

            {/* Amount */}
            <TextField
              label="Amount"
              type="number"
              fullWidth
              value={formData.amount}
              onChange={handleInputChange('amount')}
              error={!!errors.amount}
              helperText={errors.amount}
              inputProps={{
                min: 0,
                step: 0.01,
                max: 999999,
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
              }}
            />

            {/* Category */}
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={formData.category} onChange={handleInputChange('category')} label="Category">
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Who Paid */}
            <FormControl fullWidth error={!!errors.paidBy}>
              <InputLabel>Who paid?</InputLabel>
              <Select value={formData.paidBy} onChange={handleInputChange('paidBy')} label="Who paid?">
                {friends.map((friend) => (
                  <MenuItem key={friend.id} value={friend.id}>
                    {friend.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.paidBy && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.paidBy}
                </Typography>
              )}
            </FormControl>

            {/* Participants */}
            <FormControl fullWidth error={!!errors.participants}>
              <InputLabel>Who was involved?</InputLabel>
              <Select
                multiple
                value={formData.participants}
                onChange={handleParticipantChange}
                input={<OutlinedInput label="Who was involved?" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={getParticipantName(value)} size="small" />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {friends.map((friend) => (
                  <MenuItem key={friend.id} value={friend.id}>
                    {friend.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.participants && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.participants}
                </Typography>
              )}
            </FormControl>

            {/* Split Preview */}
            {formData.amount && formData.participants.length > 0 && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'primary.light',
                  borderRadius: 1,
                  color: 'white',
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Split Preview:
                </Typography>
                <Typography variant="h6">{formatCurrency(calculateSplitAmount())} per person</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  ({formData.participants.length} people splitting {formatCurrency(parseFloat(formData.amount) || 0)})
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>

        {/* Actions */}
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Add Bill
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddBill;
