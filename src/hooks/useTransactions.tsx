import { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { api } from '../services/api';

interface TransactionProviderProps {
  children: ReactNode;
}

interface Transaction {
  id: number;
  title: string;
  type: string;
  amount: number;
  category: string;
  createdAt: string;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionContextProps {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextProps>({} as TransactionContextProps);

export const TransactionProvider = ({ children }: TransactionProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get('/transactions').then(({ data }) => setTransactions(data.transactions));
  }, []);

  async function createTransaction(transaction: TransactionInput) {
    const { data } = await api.post('/transactions', {
      ...transaction,
      createdAt: new Date(),
    });
    setTransactions([...transactions, data.transaction]);
  }

  return (
    <TransactionContext.Provider value={{ transactions, createTransaction }}>{children}</TransactionContext.Provider>
  );
};

export const useTransaction = () => useContext(TransactionContext);
