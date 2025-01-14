import axios from "axios";
import { create } from "zustand";
import { config } from "../config/config";

export type Transaction = {
  id: number;
  title: string;
  sku: string;
  image: string;
  qty: number;
  amount: number;
  price: number;
  stock: number;
  description: string;
};

export type TransactionHandler = {
  transactions: Transaction[];
  transaction: Transaction;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPage: number;
  limit: number;
  hasMorePage: boolean;
  keyword: string;

  getTransactions: ({
    page,
    keyword,
  }: {
    page: number;
    keyword: string;
  }) => Promise<void>;
  getNextPage: ({ keyword }: { keyword?: string }) => Promise<void>;
  addTransaction: ({ qty, sku }: { sku: string; qty: number }) => Promise<void>;
  updateTransaction: ({
    id,
    qty,
    sku,
  }: {
    id: number;
    qty: number;
    sku: string;
  }) => Promise<void>;
  getDetailTransaction: ({ id }: { id: number }) => Promise<void>;
  deleteTransaction: ({ id }: { id: number }) => Promise<void>;
};

export const useTransactionStore = create<TransactionHandler>()((set, get) => ({
  transactions: [],
  transaction: {
    id: 0,
    qty: 0,
    title: "",
    sku: "",
    image: "",
    amount: 0,
    price: 0,
    stock: 0,
    description: "",
  },
  isLoading: false,
  error: null,
  currentPage: 1,
  limit: 10,
  totalPage: 1,
  hasMorePage: false,
  keyword: "",

  getTransactions: async ({
    page,
    keyword,
  }: {
    page: number;
    keyword: string;
  }) => {
    set({
      isLoading: true,
      error: null,
      currentPage: 1,
      transactions: [],
      keyword: keyword,
    });

    const { limit } = get();

    try {
      const response = await axios.get(
        `${config.app.api_base_url}/transactions`,
        {
          params: {
            page: page ? page : 1,
            limit: limit,
            keyword: keyword ? keyword : "",
          },
        }
      );
      set({
        transactions: response.data.data,
        totalPage: Number(response.data.total_page),
        currentPage: Number(response.data.page),
        hasMorePage:
          response.data.page === response.data.total_page ? false : true,
      });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getNextPage: async ({ keyword: keywordForm }: { keyword?: string }) => {
    const { currentPage, isLoading, limit, totalPage, keyword } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null, keyword: keywordForm });
    try {
      const hasMorePage = currentPage === totalPage ? false : true;

      if (hasMorePage) {
        const nextPage = currentPage + 1;
        const response = await axios.get(
          `${config.app.api_base_url}/transactions`,
          {
            params: {
              page: nextPage,
              limit: limit,
              keyword: keyword ? keyword : "",
            },
          }
        );

        set((state) => ({
          transactions: [...state.transactions, ...response.data.data],
          currentPage: nextPage,
          hasMorePage:
            response.data.page === response.data.total_page ? false : true,
        }));
      } else {
        set({ hasMorePage: false });
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addTransaction: async ({ sku, qty }) => {
    const { getTransactions } = get();
    const transaction = {
      qty: qty,
      sku: sku,
    };
    try {
      await axios.post(`${config.app.api_base_url}/transactions`, transaction);
      await getTransactions({ page: 1, keyword: "" });
      return;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },

  updateTransaction: async ({ id, qty, sku }) => {
    const { getTransactions, getDetailTransaction, keyword } = get();
    const transaction = {
      qty: qty,
      sku: sku,
    };
    try {
      await axios.put(
        `${config.app.api_base_url}/transactions/${id}`,
        transaction
      );
      await getTransactions({ page: 1, keyword: keyword });
      await getDetailTransaction({ id: id });
      return;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },

  getDetailTransaction: async ({ id }) => {
    set({
      transaction: {
        id: 0,
        title: "",
        sku: "",
        image: "",
        qty: 0,
        amount: 0,
        price: 0,
        stock: 0,
        description: "",
      },
    });
    try {
      const response = await axios.get(
        `${config.app.api_base_url}/transactions/${id}`,
        {}
      );
      set({
        transaction: response.data.data,
      });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTransaction: async ({ id }) => {
    const { getTransactions, keyword } = get();
    try {
      await axios.delete(`${config.app.api_base_url}/transactions/${id}`);
      await getTransactions({ page: 1, keyword: keyword });
      return;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },
}));
