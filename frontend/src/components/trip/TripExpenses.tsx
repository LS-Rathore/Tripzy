import { useState, useEffect } from 'react';
import type { Trip, Expense } from '../../types/Trip';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface TripExpensesProps {
  trip: Trip;
}

export default function TripExpenses({ trip }: TripExpensesProps) {
  const [members, setMembers] = useState<string[]>(trip.members || []);
  const [expenses, setExpenses] = useState<Expense[]>(trip.expenses || []);
  const [newMemberName, setNewMemberName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isSquad = trip.travelerType === 'Friends' || trip.travelerType === 'Squad';

  // Form state
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitAmong, setSplitAmong] = useState<string[]>([]);

  // Fetch latest expenses on mount
  useEffect(() => {
    fetchExpenses();
  }, [trip.id]);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/trips/${trip.id}/expenses`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addMember = async () => {
    if (!newMemberName.trim() || members.includes(newMemberName.trim())) return;
    const updatedMembers = [...members, newMemberName.trim()];
    setMembers(updatedMembers);
    setNewMemberName('');

    try {
      await fetch(`${API_URL}/api/trips/${trip.id}/members`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ members: updatedMembers })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const removeMember = async (name: string) => {
    const updatedMembers = members.filter(m => m !== name);
    setMembers(updatedMembers);

    try {
      await fetch(`${API_URL}/api/trips/${trip.id}/members`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ members: updatedMembers })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const submitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;
    if (isSquad && (!paidBy || splitAmong.length === 0)) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/trips/${trip.id}/expenses`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: desc,
          amount: Number(amount),
          paidBy: isSquad ? paidBy : 'You',
          splitAmong: isSquad ? splitAmong : ['You']
        })
      });
      
      if (res.ok) {
        const newExp = await res.json();
        setExpenses([newExp, ...expenses]);
        setIsModalOpen(false);
        // Reset form
        setDesc('');
        setAmount('');
        setPaidBy('');
        setSplitAmong([]);
      } else {
        const errorData = await res.json();
        alert(`Failed to save expense: ${errorData.message || res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Network error while saving expense: ${String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/trips/${trip.id}/expenses/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };



  // --- Calculate Settlements ---
  const calculateSettlements = () => {
    // 1. Calculate net balances
    const balances: Record<string, number> = {};
    members.forEach(m => balances[m] = 0);

    expenses.forEach(exp => {
      // The person who paid gets credit for the full amount
      if (balances[exp.paidBy] !== undefined) {
        balances[exp.paidBy] += exp.amount;
      }
      
      // Everyone involved gets debited their share
      const share = exp.amount / exp.splitAmong.length;
      exp.splitAmong.forEach(person => {
        if (balances[person] !== undefined) {
          balances[person] -= share;
        }
      });
    });

    // 2. Simplify debts
    const debtors: { name: string, amount: number }[] = [];
    const creditors: { name: string, amount: number }[] = [];
    
    Object.keys(balances).forEach(person => {
      const b = Math.round(balances[person]);
      if (b < 0) debtors.push({ name: person, amount: -b });
      else if (b > 0) creditors.push({ name: person, amount: b });
    });

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const settlements: string[] = [];
    let i = 0; // debtors index
    let j = 0; // creditors index

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);

      if (amount > 0) {
        settlements.push(`${debtor.name} owes ${creditor.name} ₹${amount}`);
      }

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount === 0) i++;
      if (creditor.amount === 0) j++;
    }

    return settlements;
  };

  const settlements = calculateSettlements();

  // --- Calculate Analytics ---
  const totalBudget = trip.numberOfDays * trip.budgetPerDay;
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const budgetPercentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  
  let progressColor = 'bg-brand-teal';
  if (budgetPercentage > 85) progressColor = 'bg-red-500';
  else if (budgetPercentage > 70) progressColor = 'bg-tripzy-yellow';

  const topSpender = isSquad && expenses.length > 0 
    ? Object.entries(expenses.reduce((acc, exp) => { acc[exp.paidBy] = (acc[exp.paidBy] || 0) + exp.amount; return acc; }, {} as Record<string, number>))
        .sort((a, b) => b[1] - a[1])[0][0]
    : null;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Budget Analytics Dashboard */}
      <div className="bento-card bg-surface p-5 md:p-6 rounded-2xl border-[3px] border-black space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-2">
          <div>
            <h2 className="font-display-lg font-black text-2xl">Trip Budget</h2>
            <p className="text-on-surface-variant font-bold text-sm">Monitor your spending</p>
          </div>
          <div className="text-right">
            <div className="font-black text-3xl">₹{totalSpent.toLocaleString()} <span className="text-xl text-on-surface-variant">/ ₹{totalBudget.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-8 bg-surface-container rounded-xl border-[3px] border-black overflow-hidden relative">
          <div 
            className={`h-full ${progressColor} transition-all duration-1000 ease-out ${budgetPercentage > 0 ? 'border-r-[3px] border-black' : ''}`}
            style={{ width: `${budgetPercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center font-black text-xs mix-blend-difference text-white">
            {budgetPercentage.toFixed(1)}% Spent
          </div>
        </div>

        {topSpender && (
          <div className="pt-2 border-t-2 border-black/10 flex gap-4 text-sm font-bold text-on-surface-variant">
            <div>
              👑 Top Spender: <span className="text-black">{topSpender}</span>
            </div>
          </div>
        )}
      </div>

      {isSquad && (
        <div className="bento-card bg-tripzy-yellow p-5 md:p-6 rounded-2xl border-[3px] border-black space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-display-lg font-black text-2xl mb-1">💸 Who Owes Who?</h2>
        {members.length === 0 ? (
          <p className="font-bold text-sm text-on-surface-variant">Add some squad members to start tracking!</p>
        ) : expenses.length === 0 ? (
          <p className="font-bold text-sm text-on-surface-variant">No expenses logged yet. You're all settled up!</p>
        ) : settlements.length === 0 ? (
          <div className="bg-white p-3 rounded-xl border-[3px] border-black inline-block font-black text-brand-teal text-lg">
            You're all settled up! 🎉
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {settlements.map((s, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                <span className="material-symbols-outlined text-tripzy-orange text-2xl">payments</span>
                <span className="font-black text-sm">{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Squad Management */}
        {isSquad && (
        <div className="lg:col-span-1 bento-card bg-white p-5 rounded-2xl border-[3px] border-black h-fit">
          <h3 className="font-display-lg font-black text-lg mb-4 border-b-2 border-black pb-2">The Squad</h3>
          
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              placeholder="Friend's Name" 
              className="flex-1 bg-surface-container p-2 rounded-xl border-[3px] border-black font-bold text-sm outline-none focus:border-brand-teal transition-colors"
              value={newMemberName}
              onChange={e => setNewMemberName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addMember()}
            />
            <button 
              onClick={addMember}
              className="bg-black text-white px-3 py-2 rounded-xl font-black text-sm hover:bg-brand-teal transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {members.map(m => (
              <div key={m} className="bg-tripzy-orange/20 border-2 border-tripzy-orange px-2 py-1 rounded-lg flex items-center gap-1 font-bold text-xs">
                {m}
                <button onClick={() => removeMember(m)} className="hover:text-red-600 material-symbols-outlined text-[14px] font-black">close</button>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Right: Expenses List */}
        <div className={`bento-card bg-white p-5 rounded-2xl border-[3px] border-black ${isSquad ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="flex justify-between items-center mb-5 border-b-2 border-black pb-3">
            <h3 className="font-display-lg font-black text-xl">Expenses</h3>
            <button 
              onClick={() => setIsModalOpen(true)}
              disabled={isSquad && members.length === 0}
              className={`bg-brand-teal text-white px-4 py-2 rounded-xl border-[3px] border-black font-black text-sm flex items-center gap-1 transition-all ${(!isSquad || members.length > 0) ? 'hover:-translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Log Expense
            </button>
          </div>

          <div className="space-y-3">
            {expenses.map(exp => (
              <div key={exp.id} className="flex justify-between items-center p-3 bg-surface-container rounded-xl border-[3px] border-black hover:bg-white transition-colors group">
                <div>
                  <h4 className="font-black text-base">{exp.description}</h4>
                  {isSquad && (
                  <p className="text-xs font-bold text-on-surface-variant">
                    Paid by <span className="text-brand-teal">{exp.paidBy}</span> • Split among {exp.splitAmong.length}
                  </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-lg text-tripzy-orange">₹{exp.amount}</span>
                  <button onClick={() => deleteExpense(exp.id)} className="w-7 h-7 rounded-lg border-2 border-black bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all">
                    <span className="material-symbols-outlined text-sm font-black">delete</span>
                  </button>
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <p className="text-center font-bold text-sm text-on-surface-variant py-6">No expenses logged yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-display-lg font-black text-xl">Log an Expense</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-tripzy-orange">
                <span className="material-symbols-outlined font-black">close</span>
              </button>
            </div>

            <form onSubmit={submitExpense} className="space-y-4">
              <div>
                <label className="block font-black text-xs uppercase tracking-wider mb-1.5">Description</label>
                <input required type="text" placeholder="e.g. Dinner, Taxi" className="w-full bg-surface-container p-2.5 rounded-xl border-[3px] border-black font-bold text-sm outline-none focus:border-brand-teal" value={desc} onChange={e => setDesc(e.target.value)} />
              </div>
              
              <div>
                <label className="block font-black text-xs uppercase tracking-wider mb-1.5">Amount (₹)</label>
                <input required type="number" min="1" placeholder="0" className="w-full bg-surface-container p-2.5 rounded-xl border-[3px] border-black font-black text-lg outline-none focus:border-brand-teal" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>

              {isSquad && (
                <>
                  <div>
                    <label className="block font-black text-xs uppercase tracking-wider mb-1.5">Who Paid?</label>
                    <select required className="w-full bg-surface-container p-2.5 rounded-xl border-[3px] border-black font-bold text-sm outline-none focus:border-brand-teal appearance-none cursor-pointer" value={paidBy} onChange={e => setPaidBy(e.target.value)}>
                      <option value="" disabled>Select member</option>
                      {members.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-xs uppercase tracking-wider mb-1.5">Split Among</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <button type="button" onClick={() => setSplitAmong([...members])} className="px-2 py-1 rounded-lg border-2 border-black font-bold text-[10px] hover:bg-black hover:text-white transition-colors">Select All</button>
                      <button type="button" onClick={() => setSplitAmong([])} className="px-2 py-1 rounded-lg border-2 border-black font-bold text-[10px] hover:bg-black hover:text-white transition-colors">Clear</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-1">
                      {members.map(m => (
                        <label key={m} className={`flex items-center gap-2 p-1.5 rounded-lg border-2 border-black cursor-pointer transition-colors ${splitAmong.includes(m) ? 'bg-brand-teal text-white' : 'bg-white'}`}>
                          <div className="w-3.5 h-3.5 border-2 border-current rounded flex items-center justify-center">
                            {splitAmong.includes(m) && <span className="material-symbols-outlined text-[10px] font-black">check</span>}
                          </div>
                          <span className="font-bold text-xs truncate">{m}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button type="submit" disabled={isLoading} className="w-full bg-tripzy-orange text-white py-3 rounded-xl border-[3px] border-black font-black text-base uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 mt-2">
                {isLoading ? 'Saving...' : 'Save Expense'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
