import { createAsyncThunk } from "@reduxjs/toolkit";
import BaseUrl from "../apis/axios";
import { message } from "antd";

export const login = createAsyncThunk("login", async (data) => {
  try {
    const response = await BaseUrl.post(`auth/login`, data);
    return response;
  } catch (error) {
    message.error("Lỗi đăng nhập");
  }
});

export const loginGoogle = createAsyncThunk("loginGoogle", async (data) => {
  try {
    console.log(data);
    const response = await BaseUrl.post(`auth/login/google`, data);
    return response;
  } catch (error) {
    message.error("Lỗi đăng nhập");
  }
});

export const register = createAsyncThunk("register", async (data) => {
  try {
    const response = await BaseUrl.post(`auth/register`, data);
    return response;
  } catch (error) {
    message.error("Lỗi đăng nhập");
  }
});

export const registerGoogle = createAsyncThunk(
  "register/google",
  async (data) => {
    try {
      const response = await BaseUrl.post(`auth/register/google`, data);
      return response;
    } catch (error) {
      message.error("Lỗi đăng ký");
    }
  }
);
