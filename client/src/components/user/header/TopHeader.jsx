import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import _debounce from "lodash/debounce";
import { searchProduct } from "../../../services/product.service";
import AuthButtons from "./AuthButtons";
import SearchList from "./SearchList";
import CartAndUserMenu from "./CartAndUserMenu";
import { useDebounce } from "../../../hooks/useDebounce";

const TopHeader = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.myCart.data);
  const searchProducts = useSelector((state) => state.product.dataSearch);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (debouncedSearch) {
      dispatch(searchProduct(debouncedSearch));
    }
  }, [debouncedSearch, dispatch]);

  return (
    <>
      <div className="hidden md:block py-[5px] bg-[#f5f5f5]">
        <div className="container mx-auto flex gap-2 justify-end items-center">
          <form className="relative h-10 flex items-center">
            <Input
              placeholder="Tìm kiếm sản phẩm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {searchProducts && search && (
              <SearchList searchProducts={searchProducts} />
            )}
          </form>
          {user ? <CartAndUserMenu user={user} cart={cart} /> : <AuthButtons />}
        </div>
      </div>
    </>
  );
};

export default TopHeader;
