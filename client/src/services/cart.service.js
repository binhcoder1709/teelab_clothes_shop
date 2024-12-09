import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";

export const addToCart = createAsyncThunk("addToCart", (product) => {
  try {
    return product;
  } catch (error) {
    message.error("Lỗi khi xử lý! thử lại");
  }
});
export const plusCount = createAsyncThunk("plusCount", (product) => {
  try {
    return product;
  } catch (error) {
    message.error("Lỗi khi xử lý! thử lại");
  }
});

export const minusCount = createAsyncThunk("minusCount", (product) => {
  try {
    return product;
  } catch (error) {
    message.error("Lỗi khi xử lý! thử lại");
  }
});

export const deleteFromCart = createAsyncThunk("deleteFromCart", (product) => {
  try {
    return product;
  } catch (error) {
    message.error("Lỗi khi xử lý! thử lại");
  }
});
