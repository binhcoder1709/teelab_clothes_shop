import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button, Modal, message } from "antd";
import Icon_Incart from "../../../public/icon_incart.svg";
import { useDispatch, useSelector } from "react-redux";
import formatPrice from "../../utils/formatPrice";
import {
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  deleteFromCart,
  minusCount,
  plusCount,
} from "../../services/cart.service";

const Cart = () => {
  const carts = useSelector((state) => state.myCart.data);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [productDelete, setProductDelete] = useState(null);

  const showModal = (product) => {
    setIsOpenModalDelete(true);
    setProductDelete(product);
  };

  const handleOk = () => {
    dispatch(deleteFromCart(productDelete));
    setIsOpenModalDelete(false);
  };
  const handleCancel = () => {
    setIsOpenModalDelete(false);
  };

  // hàm tăng giảm số lượng sản phẩm
  const handlePlusCount = (product) => {
    dispatch(plusCount(product));
  };

  const handleMinusCount = (product) => {
    dispatch(minusCount(product));
  };

  const totalPrice = useMemo(() => {
    return carts.reduce(
      (total, item) => total + item.product.price * item.count,
      0
    );
  }, [carts]);
  console.log(carts);

  const printCart = carts?.map((product, index) => (
    <div key={index} className="grid grid-cols-12 py-[7px]">
      <div className="flex gap-2 items-center mb-4 md:mb-0 col-span-12 md:col-span-6">
        <img
          className="w-[100px] h-[100px] object-cover"
          src={product.product.thumbnail}
          alt=""
        />
        <div className="flex flex-col items-start">
          <div>{product.product.product_name}</div>
          <div className="flex gap-1 items-center">
            <div>{product.color.color_name}</div>
            <div>/</div>
            <div>{product.size.size_name}</div>
          </div>
          <Button onClick={() => showModal(product)}>
            <span className="text-[#ff0000]">Xoá</span>
          </Button>
        </div>
      </div>
      <div className="font-bold text-[#ff0000] flex justify-center items-center col-span-4 md:col-span-2">
        {formatPrice(product.product.price)}
      </div>
      <div className="flex justify-center items-center col-span-4 md:col-span-2">
        <button
          className="px-2 border"
          type="button"
          onClick={() => handleMinusCount(product)}
          disabled={product.count > 1 ? false : true}
        >
          <MinusOutlined />
        </button>
        <span className="w-8 text-center border">{product.count}</span>
        <button
          className="px-2 border"
          type="button"
          onClick={() => handlePlusCount(product)}
        >
          <PlusOutlined />
        </button>
      </div>
      <div className="font-bold text-[#ff0000] flex justify-center items-center col-span-4 md:col-span-2">
        {formatPrice(product.count * product.product.price)}
      </div>
    </div>
  ));

  return (
    <>
      <Helmet>
        <title>TEELAB - Giỏ hàng</title>
      </Helmet>
      <Modal
        title="Xác nhận xoá sản phẩm"
        open={isOpenModalDelete}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={<p className="text-white">Xác nhận xoá</p>}
        cancelText="Huỷ"
        okButtonProps={{ style: { background: "#ff0000" } }}
      >
        <p>Bạn có muốn xoá sản phẩm này khỏi giỏ hàng?</p>
      </Modal>
      <div className="container mx-auto px-2 md:px-0">
        <h2 className="text-2xl font-light my-4">Giỏ hàng của bạn</h2>
        <div className="border border-[#ebebeb] p-[7px]">
          <div className="grid grid-cols-12 pb-[7px] border-b">
            <div className="font-bold col-span-6">Thông tin sản phẩm</div>
            <div className="font-bold text-center col-span-2 hidden md:block">
              Đơn giá
            </div>
            <div className="font-bold text-center col-span-2 hidden md:block">
              Số lượng
            </div>
            <div className="font-bold text-center col-span-2 hidden md:block">
              Thành tiền
            </div>
          </div>
          {carts.length > 0 ? (
            <>{printCart}</>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <img className="w-20 m-[15px]" src={Icon_Incart} alt="" />
              <p className="mb-2">
                Không có sản phẩm nào trong giỏ hàng của bạn
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-center md:justify-end mt-5">
          <div className="flex flex-col w-full md:w-[360px]">
            <div className="flex justify-between items-center">
              <div>Tổng tiền:</div>
              <div className="font-bold text-2xl text-[#ff0000]">
                {formatPrice(totalPrice)}
              </div>
            </div>
            <button
              type="button"
              disabled={carts.length > 0 ? false : true}
              onClick={() => navigate("/thanh-toan")}
              className="w-full bg-black text-white py-2 rounded-sm hover:opacity-75 mt-1"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
