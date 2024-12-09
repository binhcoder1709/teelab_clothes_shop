import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import PublicRouter from "./routes/user/PublicRouter";
import PrivateRouter from "./routes/admin/PrivateRouter";
import Home from "./pages/user/Home";
import NotFound from "./pages/user/NotFound";
import ListOfProduct from "./pages/user/ListOfProduct";
import Size from "./pages/user/Size";
import Service from "./pages/user/Service";
import Detail from "./pages/user/Detail";
import Cart from "./pages/user/Cart";
import Pay from "./pages/user/Pay";
import CheckOrder from "./pages/user/CheckOrder";
import CheckOrderDetail from "./pages/user/CheckOrderDetail";
import Login from "./pages/user/Login";
import Dashboard from "./pages/admin/Dashboard";
import NotFoundAdmin from "./pages/admin/NotFoundAdmin";
import Products from "./pages/admin/Products";
import CreateProduct from "./pages/admin/CreateProduct";
import Register from "./pages/user/Register";
import Orders from "./pages/admin/Orders";
import OrderDetail from "./pages/admin/OrderDetail";
import PayCheck from "./pages/user/PayCheck";
import EditProduct from "./pages/admin/EditProduct";
import User from "./pages/admin/User";
import { useSelector } from "react-redux";
import Message from "./pages/user/Message";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const categories = useSelector((state) => state.category.data);

  return (
    <>
      <Routes>
        <Route path="/" element={<PublicRouter />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="chi-tiet/:id" element={<Detail />} />
          <Route path="gio-hang" element={<Cart />} />
          <Route path="thanh-toan" element={<Pay />} />
          <Route path="trang-thai-thanh-toan" element={<PayCheck />} />
          <Route path="kiem-tra-don-hang" element={<CheckOrder />} />
          <Route path="kiem-tra-don-hang/:id" element={<CheckOrderDetail />} />
          <Route path="bang-size" element={<Size />} />
          <Route path="chinh-sach-doi-tra" element={<Service />} />
          <Route path="cham-soc-khac-hang/:id" element={<Message />} />
          <Route
            path="tat-ca-san-pham"
            element={<ListOfProduct category={"Tất cả sản phẩm"} />}
          />
          {categories?.map((c) => (
            <Route
              key={c.category_id}
              path={c.path}
              element={<ListOfProduct category={c.category_name} />}
            />
          ))}
        </Route>
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-ky" element={<Register />} />
        <Route path="/admin" element={<PrivateRouter />}>
          <Route index element={<Dashboard />} />
          <Route path="*" element={<NotFoundAdmin />} />
          <Route path="don-hang" element={<Orders />} />
          <Route path="don-hang/:id" element={<OrderDetail />} />
          <Route path="san-pham" element={<Products />} />
          <Route path="san-pham/:id" element={<Products />} />
          <Route path="tao-moi-san-pham" element={<CreateProduct />} />
          <Route path="chinh-sua-san-pham/:id" element={<EditProduct />} />
          <Route path="tai-khoan" element={<User />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
