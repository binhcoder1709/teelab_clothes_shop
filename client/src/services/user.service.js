import { createAsyncThunk } from "@reduxjs/toolkit";
import BaseUrl from "../apis/axios";

export const getAllUsers = createAsyncThunk("get/users", async () => {
  try {
    const response = await BaseUrl.get("user");
    return response.data;
  } catch (error) {
    console.error(error);
  }
});

export const updateUser = createAsyncThunk("update/user", async (id, data) => {
  try {
    const response = await BaseUrl.put(`user/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
  }
});

export const deleteUser = createAsyncThunk("delete/user", async (id) => {
  try {
    const response = await BaseUrl.delete(`user/${id}`);
    return response;
  } catch (error) {
    console.error(error);
  }
});
