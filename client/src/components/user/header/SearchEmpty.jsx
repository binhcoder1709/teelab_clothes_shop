import React from "react";
import icon_incart from "../../../../public/icon_incart.svg";

const SearchEmpty = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <img className="w-20 m-[15px]" src={icon_incart} alt="" />
        <p className="mb-2">Không có sản phẩm tìm kiếm</p>
      </div>
    </>
  );
};

export default SearchEmpty;
