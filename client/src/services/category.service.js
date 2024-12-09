import { createAsyncThunk } from "@reduxjs/toolkit";
import BaseUrl from "../apis/axios";
import { message } from "antd";

export const getAllCategory = createAsyncThunk("category", async () => {
  try {
    const response = await BaseUrl.get(`category`);
    return response.data;
  } catch (error) {
    message.error("Lỗi");
  }
});
