import { Button, Empty, Input, Tabs } from "antd";
import React, { useEffect, useLayoutEffect, useState } from "react";
import ItemProduct from "./item/ItemProduct";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../../../../services/product.service";
import { getAllCategory } from "../../../../services/category.service";

const ListProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // call api
  const fetchData = async () => {
    await dispatch(getAllProduct({ page: 0, limit: 0 }));
    await dispatch(getAllCategory());
  };
  useEffect(() => {
    fetchData();
  }, []);
  const categorys = useSelector((state) => state.category.data);
  console.log(categorys);
  const products = useSelector((state) => state.product.data);
  const [active, setActive] = useState("");
  const [listProduct, setListProduct] = useState([]);

  useEffect(() => {
    if (products) {
      setListProduct(active === "Tất cả sản phẩm" && products?.products);
    }
  }, [products, active]);

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 md:p-6 xl:p-8 my-6">
        <div className="md:flex md:items-center md:justify-between mb-3">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold whitespace-nowrap">
              Sản phẩm đang bán
            </h3>
            <Input placeholder="Tìm kiếm" />
          </div>
          <Button
            onClick={() => navigate("/admin/tao-moi-san-pham")}
            type="primary"
            className="mt-5 md:mt-0 w-full md:w-auto"
          >
            Thêm mới sản phẩm
          </Button>
        </div>
        <div className="flex items-center gap-8 text-black my-4">
          <button
            className={`${
              active === "Tất cả sản phẩm"
                ? "text-blue-600 border-b border-blue-600"
                : ""
            }`}
            onClick={() => setActive("Tất cả sản phẩm")}
          >
            Tất cả sản phẩm
          </button>
          {categorys?.map((cate) => (
            <button
              key={cate.category_id}
              onClick={() => {
                setActive(cate.category_name);
                setListProduct(cate.products);
              }}
              className={`${
                active === cate.category_name
                  ? "text-blue-600 border-b border-blue-600"
                  : ""
              }`}
            >
              {cate.category_name}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-x-2 text-center p-2">
          <div className="w-[10%]">Ảnh</div>
          <div className="w-[30%]">Tên sản phẩm</div>
          <div className="w-[10%]">Tồn kho</div>
          <div className="w-[10%]">Lượt bán</div>
          <div className="w-[10%]">Giá bán</div>
          <div className="w-[10%]">Ngày tạo</div>
          <div className="flex-1">Chỉnh sửa</div>
        </div>
        {listProduct?.length > 0 ? (
          listProduct.map((product, index) => (
            <ItemProduct key={index} product={product} />
          ))
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
        <div className="md:flex md:items-center md:justify-between mt-10 mb-3">
          <h3 className="text-xl font-bold">Sản phẩm ngừng bán</h3>
        </div>
      </div>
    </>
  );
};

export default ListProduct;
