/**
 * Calculate how much each person owes/is owed for a bill
 * @param {number} totalAmount - Total bill amount
 * @param {Array} participants - Array of participant IDs
 * @param {number} paidById - ID of person who paid
 * @returns {Object} - Object with participant balances
 */
export const calculateBillSplit = (totalAmount, participants, paidById) => {
  const sharePerPerson = totalAmount / participants.length;
  const balanceChanges = {};
  
  participants.forEach(participantId => {
    if (participantId === paidById) {
      // Person who paid gets credited for others' shares
      balanceChanges[participantId] = totalAmount - sharePerPerson;
    } else {
      // Others owe their share
      balanceChanges[participantId] = -sharePerPerson;
    }
  });
  
  return balanceChanges;
};

/**
 * Calculate equal split among participants
 * @param {number} amount - Amount to split
 * @param {number} participantCount - Number of participants
 * @returns {number} - Amount per person
 */
export const calculateEqualSplit = (amount, participantCount) => {
  return Math.round((amount / participantCount) * 100) / 100;
};

/**
 * Calculate custom split with different amounts per person
 * @param {Array} splits - Array of {participantId, amount} objects
 * @param {number} totalAmount - Total bill amount
 * @returns {Object} - Validation result and balance changes
 */
export const calculateCustomSplit = (splits, totalAmount) => {
  const totalSplitAmount = splits.reduce((sum, split) => sum + split.amount, 0);
  
  if (Math.abs(totalSplitAmount - totalAmount) > 0.01) {
    return {
      isValid: false,
      error: `Split amounts (${totalSplitAmount}) don't match total (${totalAmount})`,
      balanceChanges: null
    };
  }
  
  const balanceChanges = {};
  splits.forEach(split => {
    balanceChanges[split.participantId] = -split.amount;
  });
  
  return {
    isValid: true,
    error: null,
    balanceChanges
  };
};

/**
 * Calculate percentage split
 * @param {number} amount - Total amount
 * @param {Array} percentages - Array of {participantId, percentage} objects
 * @returns {Object} - Balance changes
 */
export const calculatePercentageSplit = (amount, percentages) => {
  const balanceChanges = {};
  
  percentages.forEach(({ participantId, percentage }) => {
    const shareAmount = Math.round((amount * percentage / 100) * 100) / 100;
    balanceChanges[participantId] = -shareAmount;
  });
  
  return balanceChanges;
};

/**
 * Round amount to 2 decimal places
 * @param {number} amount - Amount to round
 * @returns {number} - Rounded amount
 */
export const roundAmount = (amount) => {
  return Math.round(amount * 100) / 100;
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol (default: Rs.)
 * @returns {string} - Formatted amount
 */
export const formatCurrency = (amount, currency = 'Rs.') => {
  const absAmount = Math.abs(amount);
  return `${currency}${absAmount.toFixed(2)}`;
};

/**
 * Calculate total balance for a friend across all bills
 * @param {Array} bills - Array of all bills
 * @param {number} friendId - Friend's ID
 * @returns {number} - Total balance
 */
export const calculateFriendBalance = (bills, friendId) => {
  let balance = 0;
  
  bills.forEach(bill => {
    const sharePerPerson = bill.amount / bill.participants.length;
    
    if (bill.paidBy === friendId) {
      // Friend paid, so they get credited
      balance += bill.amount - sharePerPerson;
    } else if (bill.participants.includes(friendId)) {
      // Friend participated but didn't pay
      balance -= sharePerPerson;
    }
  });
  
  return roundAmount(balance);
};

/**
 * Get settlement suggestions to minimize transactions
 * @param {Array} friends - Array of friends with balances
 * @returns {Array} - Array of suggested settlements
  */

export const getSettlementSuggestions = (friends) => {
  const creditors = friends
    .filter(f => f.balance > 0)
    .map(f => ({ ...f })) // clone here
    .sort((a, b) => b.balance - a.balance);

  const debtors = friends
    .filter(f => f.balance < 0)
    .map(f => ({ ...f })) // clone here
    .sort((a, b) => a.balance - b.balance);

  const settlements = [];
  let i = 0, j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const settlementAmount = Math.min(creditor.balance, Math.abs(debtor.balance));

    settlements.push({
      from: debtor.name,
      to: creditor.name,
      amount: settlementAmount,
      fromId: debtor.id,
      toId: creditor.id
    });

    creditor.balance -= settlementAmount;
    debtor.balance += settlementAmount;

    if (creditor.balance === 0) i++;
    if (debtor.balance === 0) j++;
  }

  return settlements;
};


/**
 * Validate bill amount
 * @param {number} amount - Amount to validate
 * @returns {Object} - Validation result
 */
export const validateBillAmount = (amount) => {
  if (!amount || amount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  
  if (amount > 999999) {
    return { isValid: false, error: 'Amount is too large' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Calculate monthly expense summary
 * @param {Array} bills - Array of bills
 * @param {number} year - Year to filter
 * @param {number} month - Month to filter (1-12)
 * @returns {Object} - Monthly summary
 */
export const getMonthlyExpenseSummary = (bills, year, month) => {
  const monthlyBills = bills.filter(bill => {
    const billDate = new Date(bill.date);
    return billDate.getFullYear() === year && billDate.getMonth() + 1 === month;
  });
  
  const totalExpenses = monthlyBills.reduce((sum, bill) => sum + bill.amount, 0);
  const billsCount = monthlyBills.length;
  const avgBillAmount = billsCount > 0 ? totalExpenses / billsCount : 0;
  
  return {
    totalExpenses: roundAmount(totalExpenses),
    billsCount,
    avgBillAmount: roundAmount(avgBillAmount),
    bills: monthlyBills
  };
};