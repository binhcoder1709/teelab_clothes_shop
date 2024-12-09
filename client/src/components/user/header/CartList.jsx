import React from "react";

const CartList = ({ cart }) => {
  return (
    <>
      {cart.map((product, index) => (
        <div
          onClick={() => navigate(`/chi-tiet/${product.product.product_id}`)}
          key={index}
          className="grid grid-cols-12 items-center gap-2 p-1 cursor-pointer rounded-md hover:bg-[#ededed]"
        >
          <div className="col-span-2">
            <img
              className="w-full h-full object-cover"
              src={product.product.thumbnail}
              alt={product.product.product_name}
            />
          </div>
          <span className="col-span-6">{product.product.product_name}</span>
          <span className="col-span-1 text-left">
            {product.color.color_name}
          </span>
          <span className="col-span-2 text-center">
            {product.size.size_name}
          </span>
          <span className="col-span-1">x{product.count}</span>
        </div>
      ))}
    </>
  );
};

export default CartList;
