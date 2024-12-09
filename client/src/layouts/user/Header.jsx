import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../public/logo.png";
import TopHeader from "../../components/user/header/TopHeader";
import MainNavigate from "../../components/user/header/MainNavigate";
import ProductsNavigation from "../../components/user/header/ProductsNavigation";
import HeaderMobile from "../../components/user/header/HeaderMobile";

const Header = ({ user }) => {
  return (
    <>
      <HeaderMobile user={user} />
      <TopHeader user={user} />
      <MainNavigate />
      <ProductsNavigation />
    </>
  );
};

export default Header;
