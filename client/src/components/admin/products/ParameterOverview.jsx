import React from "react";
import { arrowdown, arrowup } from "../dashboard/StatisticsOverview";

const ParameterOverview = () => {
  return (
    <>
      <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                {500}
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Sản phẩm đã bán
              </h3>
            </div>
            <div
              className={`ml-5 w-0 flex items-center justify-end flex-1 ${
                300 > 0 ? " text-green-500 " : " text-red-500 "
              } text-base font-bold`}
            >
              {300}%{300 > 0 ? arrowup : arrowdown}
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                {500}
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Số lượng tồn kho
              </h3>
            </div>
            <div
              className={`ml-5 w-0 flex items-center justify-end flex-1 ${
                300 > 0 ? " text-green-500 " : " text-red-500 "
              } text-base font-bold`}
            >
              {300}%{300 > 0 ? arrowup : arrowdown}
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                {200}
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Sản phẩm hết hàng
              </h3>
            </div>
            <div
              className={`ml-5 w-0 flex items-center justify-end flex-1 ${
                100 > 0 ? " text-green-500 " : " text-red-500 "
              } text-base font-bold`}
            >
              {100}%{100 > 0 ? arrowup : arrowdown}
            </div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                385
              </span>
              <h3 className="text-base font-normal text-gray-500">
                Sản phẩm mới
              </h3>
            </div>
            <div className="ml-5 w-0 flex items-center justify-end flex-1 text-red-500 text-base font-bold">
              -2.7%
              {arrowdown}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ParameterOverview;
