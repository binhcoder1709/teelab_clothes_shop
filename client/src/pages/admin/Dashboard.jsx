import React, { useEffect } from "react";
import StatisticChart from "../../components/admin/dashboard/chart/StatisticChart";
import OperatingCost from "../../components/admin/dashboard/OperatingCost";
import StatisticsOverview from "../../components/admin/dashboard/StatisticsOverview";
import ProductOverview from "../../components/admin/dashboard/ProductOverview";
import LastCustomer from "../../components/admin/dashboard/LastCustomer";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { dashboard } from "../../services/statistics.service";

const Dashboard = () => {
  const dípatch = useDispatch();

  const fetchData = async () => {
    // dípatch(dashboard());
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Helmet>
        <title>Tổng quan - TEELAB</title>
      </Helmet>
      <div>
        <div className="w-full grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          <StatisticChart />
          <OperatingCost />
        </div>
        <StatisticsOverview />
        <div className="grid grid-cols-1 2xl:grid-cols-2 xl:gap-4 my-4">
          <ProductOverview />
          <LastCustomer />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
