import React, { useEffect } from "react";
import ParameterOverview from "../../components/admin/products/ParameterOverview";
import ListProduct from "../../components/admin/products/list/ListProduct";
import { useDispatch } from "react-redux";
import { getAllCategory } from "../../services/category.service";

const Products = () => {
  const dispatch = useDispatch();
  const fetchData = async () => {
    await dispatch(getAllCategory());
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <ParameterOverview />
      <ListProduct />
    </>
  );
};

export default Products;
