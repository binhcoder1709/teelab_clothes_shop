import { createAsyncThunk } from "@reduxjs/toolkit";
import BaseUrl from "../apis/axios";
import { message } from "antd";

export const zalopay = createAsyncThunk("zalopay", async (data) => {
  try {
    const response = await BaseUrl.post(`payment/zalopay`, data);
    return response.data;
  } catch (error) {
    message.error("Lỗi server");
  }
});

export const checkPaymentZalopay = createAsyncThunk(
  "zalopay/check",
  async (app_trans_id) => {
    try {
      const response = await BaseUrl.post(
        `payment/check-status/${app_trans_id}`
      );
      return response.data;
    } catch (error) {
      message.error("Lỗi server");
    }
  }
);
