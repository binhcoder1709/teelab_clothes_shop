import React, { useEffect, useMemo, useState } from "react";
import ChartSales from "./chartitem/ChartSales";
import ChartAccess from "./chartitem/ChartAccess";
import { useSelector } from "react-redux";
import { Statistic } from "antd";
import CountUp from "react-countup";

const formatter = (value) => (
  <CountUp end={value} separator="," suffix=" VND" />
);

const StatisticChart = () => {
  const currentMonth = useMemo(() => new Date().getMonth(), []);
  const lastMonth = useMemo(
    () => (currentMonth === 0 ? 11 : currentMonth - 1),
    [currentMonth]
  );

  const result = useSelector((state) => state.statistics?.data[currentMonth]);
  const resultLastMonth = useSelector(
    (state) => state.statistics.data[lastMonth]
  );

  const [percenChange, setPercenChange] = useState(() => {
    if (resultLastMonth) {
      return resultLastMonth.totalRevenue > 0
        ? (
            ((result.totalRevenue - resultLastMonth.totalRevenue) /
              resultLastMonth.totalRevenue) *
            100
          ).toFixed(2)
        : 100;
    }
    return 0;
  });

  const handleCalPercenChange = () => {
    if (resultLastMonth) {
      setPercenChange(
        resultLastMonth.totalRevenue > 0
          ? (
              ((result.totalRevenue - resultLastMonth.totalRevenue) /
                resultLastMonth.totalRevenue) *
              100
            ).toFixed(2)
          : 100
      );
    } else {
      setPercenChange(100);
    }
  };

  useEffect(() => {
    handleCalPercenChange();
  }, [result, resultLastMonth]);

  return (
    <>
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8  2xl:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-shrink-0">
            <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
              <Statistic
                value={result?.totalRevenue}
                precision={2}
                formatter={formatter}
              />
            </span>
            <h3 className="text-base font-normal text-gray-500">
              Doanh thu tháng hiện tại
            </h3>
          </div>
          <div className="flex items-center justify-end flex-1 text-green-500 text-base font-bold">
            {percenChange}%
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <ChartSales />
        <ChartAccess />
      </div>
    </>
  );
};

export default StatisticChart;
