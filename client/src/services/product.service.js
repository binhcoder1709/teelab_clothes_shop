import { createAsyncThunk } from "@reduxjs/toolkit";
import BaseUrl from "../apis/axios";
import { message } from "antd";

export const getOneProduct = createAsyncThunk("getOne/product", async (id) => {
  try {
    const response = await BaseUrl.get(`product/${id}`);
    return response.data;
  } catch (error) {
    message.error("Lỗi server");
  }
});

export const getAllProduct = createAsyncThunk(
  "getAll/product",
  async ({ page, limit }) => {
    try {
      const response = await BaseUrl.get(`product?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      message.error("Lỗi server");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "put/product",
  async ({ id, data }) => {
    try {
      const response = await BaseUrl.put(`product/update/${id}`, data);
      return response.data;
    } catch (error) {
      message.error("Lỗi server");
    }
  }
);

export const searchProduct = createAsyncThunk("search", async (q) => {
  try {
    const response = await BaseUrl.get(`product/search?q=${q}`);
    return response.data;
  } catch (error) {
    message.error("Lỗi server");
  }
});

export const deleteProduct = createAsyncThunk("delete/product", async (id) => {
  try {
    const response = await BaseUrl.delete(`product/delete/${id}`);
    return response;
  } catch (error) {
    message.error("Lỗi server");
  }
});

export const createProduct = createAsyncThunk(
  "create/product",
  async (data) => {
    try {
      const response = await BaseUrl.post(`product/create`, data);
      return response;
    } catch (error) {
      message.error("Lỗi server");
    }
  }
);
