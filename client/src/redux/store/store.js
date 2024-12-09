import { configureStore } from "@reduxjs/toolkit";
import productSlice from "../useSlice/productSlice";
import cartSlice from "../useSlice/cartSlice";
import orderSlice from "../useSlice/orderSlice";
import statisticSlice from "../useSlice/statisticSlice";
import authSlice from "../useSlice/authSlice";
import categorySlice from "../useSlice/categorySlice";
import paymentSlice from "../useSlice/paymentSlice";
import userSlice from "../useSlice/userSlice";
import tokenSlice from "../useSlice/tokenSlice";

const store = configureStore({
  reducer: {
    product: productSlice,
    auth: authSlice,
    myCart: cartSlice,
    order: orderSlice,
    statistics: statisticSlice,
    category: categorySlice,
    payment: paymentSlice,
    user:userSlice,
    token:tokenSlice
  },
});
export default store;
