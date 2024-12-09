import { createSlice } from "@reduxjs/toolkit";
import {
  createOrder,
  getAllStatusOrder,
  getAllOrder,
  getOneOrder,
} from "../../services/order.service";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    data: [],
    dataEdit: null,
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = "Pending!";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "Successfully!";
        state.dataEdit = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "Failed!";
        state.error = action.error.message;
      })
      .addCase(getOneOrder.pending, (state) => {
        state.status = "Pending!";
      })
      .addCase(getOneOrder.fulfilled, (state, action) => {
        state.status = "Successfully!";
        state.dataEdit = action.payload;
      })
      .addCase(getOneOrder.rejected, (state, action) => {
        state.status = "Failed!";
        state.error = action.error.message;
      })
      .addCase(getAllOrder.pending, (state) => {
        state.status = "Pending!";
      })
      .addCase(getAllOrder.fulfilled, (state, action) => {
        state.status = "Successfully!";
        state.data = action.payload;
      })
      .addCase(getAllOrder.rejected, (state, action) => {
        state.status = "Failed!";
        state.error = action.error.message;
      })
      .addCase(getAllStatusOrder.pending, (state) => {
        state.status = "Pending!";
      })
      .addCase(getAllStatusOrder.fulfilled, (state, action) => {
        state.status = "Successfully!";
        state.data = action.payload;
      })
      .addCase(getAllStatusOrder.rejected, (state, action) => {
        state.status = "Failed!";
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
