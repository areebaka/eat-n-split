import React, { useState } from 'react';
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  InputAdornment
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import BillCard from './BillCard';

const BillsList = ({ bills }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

 
  const categories = ['All', ...new Set(bills.map(bill => bill.category).filter(Boolean))];


  const filteredAndSortedBills = bills
    .filter(bill => {
      const matchesSearch = bill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bill.paidByName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || bill.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        case 'name-asc':
          return a.description.localeCompare(b.description);
        case 'name-desc':
          return b.description.localeCompare(a.description);
        default:
          return 0;
      }
    });

  return (
    <Stack spacing={3}>
      {/* Filters and Search */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { sm: 'center' }
      }}>
        {/* Search */}
        <TextField
          placeholder="Search bills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        
        {/* Category Filter */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label="Category"
            startAdornment={<FilterList sx={{ mr: 1, color: 'action.active' }} />}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Sort */}
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort by"
          >
            <MenuItem value="date-desc">Newest First</MenuItem>
            <MenuItem value="date-asc">Oldest First</MenuItem>
            <MenuItem value="amount-desc">Highest Amount</MenuItem>
            <MenuItem value="amount-asc">Lowest Amount</MenuItem>
            <MenuItem value="name-asc">Name A-Z</MenuItem>
            <MenuItem value="name-desc">Name Z-A</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Results Info */}
      <Typography variant="body2" color="text.secondary">
        {filteredAndSortedBills.length} of {bills.length} bills
        {searchTerm && ` matching "${searchTerm}"`}
        {categoryFilter !== 'All' && ` in ${categoryFilter}`}
      </Typography>

      {/* Bills List */}
      <Stack spacing={2}>
        {filteredAndSortedBills.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No bills found
            </Typography>
            <Typography color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        ) : (
          filteredAndSortedBills.map((bill) => (
            <BillCard key={bill.id} bill={bill} />
          ))
        )}
      </Stack>
    </Stack>
  );
};

export default BillsList;