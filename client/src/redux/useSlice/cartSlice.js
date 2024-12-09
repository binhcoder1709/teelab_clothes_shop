import { createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  deleteFromCart,
  minusCount,
  plusCount,
} from "../../services/cart.service";

const cartSlice = createSlice({
  name: "myCart",
  initialState: {
    data: JSON.parse(localStorage.getItem("myCart")) || [],
  },
  reducers: {
    clearCart: (state) => {
      state.data = [];
      localStorage.removeItem("myCart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        if (action.payload.count < 1) {
          return;
        }
        state.data = state.data.map((p) => {
          return p.product.product_id === action.payload.product.product_id &&
            p.color.color_id === action.payload.color.color_id &&
            p.size.size_id === action.payload.size.size_id
            ? { ...p, count: p.count + action.payload.count }
            : p;
        });
        const itemExists = state.data.some(
          (p) =>
            p.product.product_id === action.payload.product.product_id &&
            p.color.color_id === action.payload.color.color_id &&
            p.size.size_id === action.payload.size.size_id
        );
        if (!itemExists) {
          state.data.push(action.payload);
        }
        localStorage.setItem("myCart", JSON.stringify(state.data));
      })
      .addCase(plusCount.fulfilled, (state, action) => {
        state.data = state.data.map((p) => {
          return p.product.product_id === action.payload.product.product_id &&
            p.color.color_id === action.payload.color.color_id &&
            p.size.size_id === action.payload.size.size_id &&
            p.count < p.size.quantity
            ? { ...p, count: p.count + 1 }
            : p;
        });
        localStorage.setItem("myCart", JSON.stringify(state.data));
      })
      .addCase(minusCount.fulfilled, (state, action) => {
        state.data = state.data.map((p) => {
          return p.product.product_id === action.payload.product.product_id &&
            p.color.color_id === action.payload.color.color_id &&
            p.size.size_id === action.payload.size.size_id &&
            p.count > 1
            ? { ...p, count: p.count - 1 }
            : p;
        });
        localStorage.setItem("myCart", JSON.stringify(state.data));
      })
      .addCase(deleteFromCart.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (p) =>
            !(
              p.product.product_id === action.payload.product.product_id &&
              p.color.color_id === action.payload.color.color_id &&
              p.size.size_id === action.payload.size.size_id
            )
        );
        localStorage.setItem("myCart", JSON.stringify(state.data));
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
