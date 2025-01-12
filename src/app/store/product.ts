import { create } from "zustand";
import { config } from "../config/config";
import axios from "axios";

export type Product = {
  id: number;
  title: string;
  sku: string;
  image: string;
  qty: string;
  amount: number;
  price: number;
  stock: number;
  description: string;
};

export type ProductHandler = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPage: number;
  limit: number;
  hasMorePage: boolean;

  getProducts: () => Promise<void>;
  getNextPage: () => Promise<void>;
  addProduct: ({
    title,
    sku,
    image,
    price,
    stock,
  }: {
    title: string;
    sku: string;
    image: string;
    price: number;
    stock: number;
  }) => Promise<void>;
};

export const useProductStore = create<ProductHandler>()((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  limit: 8,
  totalPage: 1,
  hasMorePage: false,

  getProducts: async () => {
    set({ isLoading: true, error: null, currentPage: 1, products: [] });

    const { limit } = get();

    try {
      const response = await axios.get(`${config.app.api_base_url}/products`, {
        params: {
          page: 1,
          limit: limit,
        },
      });
      set({
        products: response.data.data,
        totalPage: Number(response.data.total_page),
        currentPage: Number(response.data.page),
        hasMorePage:
          response.data.page === response.data.total_page ? false : true,
      });
    } catch (error) {
      console.log(error);
      //   set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  getNextPage: async () => {
    const { currentPage, isLoading, limit, totalPage } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const hasMorePage = currentPage === totalPage ? false : true;

      if (hasMorePage) {
        const nextPage = currentPage + 1;
        const response = await axios.get(
          `${config.app.api_base_url}/products`,
          {
            params: {
              page: nextPage,
              limit: limit,
            },
          }
        );

        set((state) => ({
          products: [...state.products, ...response.data.data],
          currentPage: nextPage,
          hasMorePage:
            response.data.page === response.data.total_page ? false : true,
        }));
      } else {
        set({ hasMorePage: false });
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async ({ title, sku, image, price, stock }) => {
    const { getProducts } = get();
    const product = {
      title: title,
      sku: sku,
      image: image,
      price: price,
      stock: stock,
    };
    try {
      await axios.post("http://localhost:8080/api/v1/products", product);
      await getProducts();
      return;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },
}));
