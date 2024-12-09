import { createSlice } from "@reduxjs/toolkit";
import {
  deleteProduct,
  getAllProduct,
  getOneProduct,
  searchProduct,
  updateProduct,
} from "../../services/product.service";

const productSlice = createSlice({
  name: "product",
  initialState: {
    data: [],
    dataEdit: null,
    dataSearch: [],
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOneProduct.pending, (state) => {
        state.status = "Pending!";
      })
      .addCase(getOneProduct.fulfilled, (state, action) => {
        state.status = "Successfully!";
        state.dataEdit = action.payload;
      })
      .addCase(getOneProduct.rejected, (state, action) => {
        state.status = "Failed!";
        state.error = action.error.message;
      })
      .addCase(getAllProduct.pending, (state) => {
        state.status = "Pending!";
      })
      .addCase(getAllProduct.fulfilled, (state, action) => {
        state.status = "Successfully!";
        state.data = action.payload;
      })
      .addCase(getAllProduct.rejected, (state, action) => {
        state.status = "Failed!";
        state.error = action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = "Pending!";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "Successfully!";
        state.data = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "Failed!";
        state.error = action.error.message;
      })
      .addCase(searchProduct.pending, (state) => {
        state.status = "Pending!";
      })
      .addCase(searchProduct.fulfilled, (state, action) => {
        state.status = "Successfully!";
        state.dataSearch = action.payload;
      })
      .addCase(searchProduct.rejected, (state, action) => {
        state.status = "Failed!";
        state.error = action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = "Pending!";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "Successfully!";
        state.data = action.payload;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "Failed!";
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
