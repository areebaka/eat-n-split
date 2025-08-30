import React, { createContext, useContext, useState } from 'react';
import { calculateBillSplit } from '../utils/calculations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [friends, setFriends] = useState([]);
  const [bills, setBills] = useState([]);

  // Add new friend
  const addFriend = (name) => {
    const newFriend = {
      id: Date.now(),
      name: name.trim(),
      avatar: name.charAt(0).toUpperCase(),
      balance: 0
    };
    setFriends(prev => [...prev, newFriend]);
    return newFriend;
  };

  // Delete friend
  const deleteFriend = (friendId) => {
    setFriends(prev => prev.filter(friend => friend.id !== friendId));
    // Also remove from bills
    setBills(prev => prev.map(bill => ({
      ...bill,
      participants: bill.participants.filter(id => id !== friendId)
    })).filter(bill => bill.participants.length > 0));
  };

  // Add new bill
  const addBill = (billData) => {
    const newBill = {
      id: Date.now(),
      ...billData,
      date: new Date().toISOString().split('T')[0]
    };
    setBills(prev => [...prev, newBill]);
    updateBalances(newBill);
    return newBill;
  };

  // Delete bill
  const deleteBill = (billId) => {
    const billToDelete = bills.find(bill => bill.id === billId);
    if (billToDelete) {
      // Reverse the balance changes
      reverseBalances(billToDelete);
      setBills(prev => prev.filter(bill => bill.id !== billId));
    }
  };

  // Update friend balances when bill is added
  const updateBalances = (bill) => {
    const sharePerPerson = bill.amount / bill.participants.length;
    
    setFriends(prev => prev.map(friend => {
      if (friend.id === bill.paidBy) {
        // Person who paid gets credited
        const credit = bill.amount - sharePerPerson;
        return { ...friend, balance: Math.round((friend.balance + credit) * 100) / 100 };
      } else if (bill.participants.includes(friend.id)) {
        // Participants who didn't pay owe money
        return { ...friend, balance: Math.round((friend.balance - sharePerPerson) * 100) / 100 };
      }
      return friend;
    }));
  };

  // Reverse balances when bill is deleted
  const reverseBalances = (bill) => {
    const sharePerPerson = bill.amount / bill.participants.length;
    
    setFriends(prev => prev.map(friend => {
      if (friend.id === bill.paidBy) {
        const credit = bill.amount - sharePerPerson;
        return { ...friend, balance: Math.round((friend.balance - credit) * 100) / 100 };
      } else if (bill.participants.includes(friend.id)) {
        return { ...friend, balance: Math.round((friend.balance + sharePerPerson) * 100) / 100 };
      }
      return friend;
    }));
  };

  // Settle up with a friend
const settleUp = (friendId) => {
  setFriends(prev => {
    let debtor = prev.find(f => f.id === friendId);
    if (!debtor || debtor.balance >= 0) return prev; // only works for debtors

    let amountOwed = Math.abs(debtor.balance);

    // Find creditors (friends with positive balance)
    let updated = prev.map(f => ({ ...f }));

    for (let friend of updated) {
      if (amountOwed === 0) break;
      if (friend.balance > 0) {
        let deduction = Math.min(friend.balance, amountOwed);
        friend.balance -= deduction;
        amountOwed -= deduction;
      }
    }

    // Debtor is settled
    updated = updated.map(f =>
      f.id === friendId ? { ...f, balance: 0 } : f
    );

    return updated;
  });
};

  // Get friend by ID
  const getFriendById = (id) => {
    return friends.find(friend => friend.id === id);
  };

  // Get bills for a specific friend
  const getFriendBills = (friendId) => {
    return bills.filter(bill => 
      bill.participants.includes(friendId) || bill.paidBy === friendId
    );
  };

  // Calculate total expenses
  const getTotalExpenses = () => {
    return bills.reduce((total, bill) => total + bill.amount, 0);
  };

  // Get summary stats
  const getSummaryStats = () => {
    const totalOwed = friends.reduce((sum, friend) => sum + Math.max(0, friend.balance), 0);
    const totalOwing = Math.abs(friends.reduce((sum, friend) => sum + Math.min(0, friend.balance), 0));
    const totalExpenses = getTotalExpenses();
    
    return {
      totalOwed: Math.round(totalOwed * 100) / 100,
      totalOwing: Math.round(totalOwing * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      friendsCount: friends.length,
      billsCount: bills.length
    };
  };

  const value = {
    // State
    friends,
    bills,
    
    // Actions
    addFriend,
    deleteFriend,
    addBill,
    deleteBill,
    settleUp,
    
    // Getters
    getFriendById,
    getFriendBills,
    getTotalExpenses,
    getSummaryStats,
    
    // Setters (for advanced use)
    setFriends,
    setBills
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};