import { createSlice } from "@reduxjs/toolkit";
import { checkPaymentZalopay } from "../../services/payment.service";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    data: [],
    dataEdit: null,
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkPaymentZalopay.pending, (state) => {
        state.status = "Pending!";
      })
      .addCase(checkPaymentZalopay.fulfilled, (state, action) => {
        state.status = "Successfully!";
        state.dataEdit = action.payload;
      })
      .addCase(checkPaymentZalopay.rejected, (state, action) => {
        state.status = "Failed!";
        state.error = action.error.message;
      });
  },
});

export default paymentSlice.reducer;
