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
  product: Product;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPage: number;
  limit: number;
  hasMorePage: boolean;
  keyword: string;

  getProducts: ({
    page,
    keyword,
  }: {
    page?: number;
    keyword?: string;
  }) => Promise<void>;
  getNextPage: ({ keyword }: { keyword?: string }) => Promise<void>;
  addProduct: ({
    title,
    sku,
    image,
    price,
    description,
  }: {
    title: string;
    sku: string;
    image: string;
    price: number;
    description?: string;
  }) => Promise<void>;
  updateProduct: ({
    id,
    title,
    sku,
    image,
    price,
    description,
  }: {
    id: number;
    title: string;
    sku: string;
    image: string;
    price: number;
    description?: string;
  }) => Promise<void>;
  getDetailProduct: ({ id }: { id: number }) => Promise<void>;
  deleteProduct: ({ id }: { id: number }) => Promise<void>;
};

export const useProductStore = create<ProductHandler>()((set, get) => ({
  products: [],
  product: {
    id: 0,
    title: "",
    sku: "",
    image: "",
    qty: "",
    amount: 0,
    price: 0,
    stock: 0,
    description: "",
  },
  isLoading: false,
  error: null,
  currentPage: 1,
  limit: 8,
  totalPage: 1,
  hasMorePage: false,
  keyword: "",

  getProducts: async ({
    page,
    keyword,
  }: {
    page?: number;
    keyword?: string;
  }) => {
    set({
      isLoading: true,
      error: null,
      currentPage: 1,
      products: [],
      keyword: keyword,
    });

    const { limit } = get();

    try {
      const response = await axios.get(`${config.app.api_base_url}/products`, {
        params: {
          page: page ? page : 1,
          limit: limit,
          keyword: keyword ? keyword : "",
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
          `${config.app.api_base_url}/products`,
          {
            params: {
              page: nextPage,
              limit: limit,
              keyword: keyword ? keyword : "",
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
      console.error(error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async ({ title, sku, image, price, description }) => {
    const { getProducts } = get();
    const product = {
      title: title,
      sku: sku,
      image: image,
      price: price,
      description: description,
    };
    try {
      await axios.post(`${config.app.api_base_url}/products`, product);
      await getProducts({ page: 1, keyword: "" });
      return;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },

  updateProduct: async ({ id, title, sku, image, price, description }) => {
    const { getProducts, getDetailProduct, keyword } = get();
    const product = {
      title: title,
      sku: sku,
      image: image,
      price: price,
      description: description,
    };
    try {
      await axios.put(`${config.app.api_base_url}/products/${id}`, product);
      await getProducts({ page: 1, keyword: keyword });
      await getDetailProduct({ id: id });
      return;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },

  getDetailProduct: async ({ id }) => {
    set({
      product: {
        id: 0,
        title: "",
        sku: "",
        image: "",
        qty: "",
        amount: 0,
        price: 0,
        stock: 0,
        description: "",
      },
    });
    try {
      const response = await axios.get(
        `${config.app.api_base_url}/products/${id}`,
        {}
      );
      set({
        product: response.data.data,
      });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async ({ id }) => {
    const { getProducts, keyword } = get();
    try {
      await axios.delete(`${config.app.api_base_url}/products/${id}`);
      await getProducts({ page: 1, keyword: keyword });
      return;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },
}));
