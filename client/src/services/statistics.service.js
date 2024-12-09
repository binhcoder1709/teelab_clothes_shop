import { createAsyncThunk } from "@reduxjs/toolkit";
import BaseUrl from "../apis/axios";
import { message } from "antd";

export const dashboard = createAsyncThunk("statistics/dashboard", async () => {
  try {
    const response = await BaseUrl.get(`statistics/dashboard`);
    return response.data;
  } catch (error) {
    message.error("Lỗi đăng nhập");
  }
});
