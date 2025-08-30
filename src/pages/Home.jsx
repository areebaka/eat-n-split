import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Receipt,
  AccountBalance,
  Timeline
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { formatCurrency, getSettlementSuggestions } from '../utils/calculations';

const Home = () => {
  const { friends, bills, getSummaryStats } = useApp();
  const stats = getSummaryStats();
  
  // Get recent bills (last 5)
  const recentBills = [...bills]  
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5);

  // Get settlement suggestions
  const settlements = getSettlementSuggestions([...friends]);
  
  return (
    <Container sx={{ mt: 3, mb: 4 }}>
      {/* Welcome Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          🍽️ Welcome to Eat N Split
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Split bills with friends easily and keep track of who owes what!
        </Typography>
        
        {stats.totalExpenses > 0 && (
          <Chip
            icon={<AccountBalance />}
            label={`Total Expenses: ${formatCurrency(stats.totalExpenses)}`}
            color="primary"
            variant="outlined"
            sx={{ fontSize: '1rem', py: 1 }}
          />
        )}
      </Box>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Bills */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timeline sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" fontWeight="600">
                  Recent Bills
                </Typography>
              </Box>
              
              {recentBills.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Receipt sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No bills yet
                  </Typography>
                  <Typography color="text.secondary">
                    Add your first bill to get started!
                  </Typography>
                </Box>
              ) : (
                <List>
                  {recentBills.map((bill, index) => (
                    <React.Fragment key={bill.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Receipt color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" fontWeight="500">
                                {bill.description}
                              </Typography>
                              <Typography variant="h6" color="primary.main" fontWeight="bold">
                                {formatCurrency(bill.amount)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Paid by {bill.paidByName} • {bill.date}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Split between {bill.participants.length} people • {formatCurrency(bill.amount / bill.participants.length)} each
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentBills.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Settlement Suggestions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h5" fontWeight="600">
                  Settlement Suggestions
                </Typography>
              </Box>
              
              {settlements.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AccountBalance sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    All settled up!
                  </Typography>
                  <Typography color="text.secondary">
                    No outstanding balances
                  </Typography>
                </Box>
              ) : (
                <List>
                  {settlements.map((settlement, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              <strong>{settlement.from}</strong> pays <strong>{settlement.to}</strong>
                            </Typography>
                          }
                          secondary={
                            <Typography variant="h6" color="primary.main" fontWeight="bold">
                              {formatCurrency(settlement.amount)}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < settlements.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Stats */}
      {friends.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="600" gutterBottom>
              💰 Balance Overview
            </Typography>
            <Grid container spacing={2}>
              {friends.map((friend) => (
                <Grid item xs={12} sm={6} md={4} key={friend.id}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      backgroundColor: 
                        friend.balance > 0 ? 'success.light' :
                        friend.balance < 0 ? 'error.light' : 'grey.100',
                      color: friend.balance !== 0 ? 'white' : 'text.primary'
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {friend.name}
                    </Typography>
                    <Typography variant="body1">
                      {friend.balance > 0 && `You're owed ${formatCurrency(friend.balance)}`}
                      {friend.balance < 0 && `You owe ${formatCurrency(Math.abs(friend.balance))}`}
                      {friend.balance === 0 && 'Settled up'}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Home;