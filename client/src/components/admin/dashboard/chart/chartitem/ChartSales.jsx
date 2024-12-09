// import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
// import Chart from "chart.js/auto";
// import { useDispatch, useSelector } from "react-redux";
// import { statisticsDataChartTotal } from "../../../services/statistics.service";

// const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

// const ChartSales = () => {
//   const canvasRefSales = useRef(null);
//   const chartInstanceRef = useRef(null);
//   const dispatch = useDispatch();
//   const dataChart = useSelector((state) => state.statistics.dataTotal);
//   const [datapoints, setDatapoints] = useState([]);
//   const [maxUpdated, setMaxUpdated] = useState(false);
//   const [max, setMax] = useState();

//   const fetchDataChart = async () => {
//     dispatch(statisticsDataChartTotal());
//   };
//   useEffect(() => {
//     fetchDataChart();
//   }, []);

//   const getMaxTotalRevenue = (data) => {
//     let maxRevenue = 0;
//     data.forEach((point) => {
//       if (point.totalRevenue > maxRevenue) {
//         maxRevenue = point.totalRevenue;
//       }
//     });
//     const firstDigit = parseInt(maxRevenue.toString()[0]);
//     const roundedMaxRevenue =
//       (firstDigit + 1) * Math.pow(10, maxRevenue.toString().length - 1);
//     return roundedMaxRevenue;
//   };

//   const getTotalRevenues = (data) => {
//     return data.map((point) => point.totalRevenue);
//   };

//   useLayoutEffect(() => {
//     if (dataChart) {
//       const maxRevenue = getMaxTotalRevenue(dataChart);
//       setMax(maxRevenue);
//       const totalRevenues = getTotalRevenues(dataChart);
//       setDatapoints(totalRevenues);
//       setMaxUpdated(true);
//     }
//   }, [dataChart]);

//   const data = {
//     labels: labels,
//     datasets: [
//       {
//         label: "Doanh thu theo tháng",
//         data: datapoints,
//         borderColor: "#28a745",
//         backgroundColor: "#28a745",
//         fill: false, // true nếu muốn lấp đầy màu dứoi đường line
//         cubicInterpolationMode: "monotone",
//         tension: 0.4,
//         pointHoverBackgroundColor: "#ff0000",
//       },
//     ],
//   };
//   const config = {
//     type: "line",
//     data: data,
//     options: {
//       responsive: true,
//       plugins: {
//         title: {
//           display: true,
//           text: "Thống kê doanh thu",
//         },
//       },
//       interaction: {
//         intersect: false,
//       },
//       scales: {
//         x: {
//           display: true,
//           title: {
//             display: true,
//           },
//         },
//         y: {
//           display: true,
//           title: {
//             display: false,
//           },
//           suggestedMin: 0,
//           suggestedMax: max,
//         },
//       },
//     },
//   };

//   useLayoutEffect(() => {
//     if (maxUpdated) {
//       const ctx = canvasRefSales.current.getContext("2d");
//       new Chart(ctx, config);
//     }
//   }, []);

//   return (
//     <>
//       <canvas ref={canvasRefSales}></canvas>
//     </>
//   );
// };

// export default ChartSales;

import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useDispatch, useSelector } from "react-redux";

const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const ChartSales = () => {
  const canvasRefSales = useRef(null);
  const chartInstanceRef = useRef(null);
  const dataChart = useSelector((state) => state.statistics.data);
  const [data, setData] = useState(dataChart);
  const [datapoints, setDatapoints] = useState([]);
  const [max, setMax] = useState();

  useEffect(() => {
    setData(dataChart);
  }, [dataChart]);

  const getMaxTotalRevenue = (data) => {
    let maxRevenue = 0;
    data.forEach((point) => {
      if (point.totalRevenue > maxRevenue) {
        maxRevenue = point.totalRevenue;
      }
    });
    const firstDigit = parseInt(maxRevenue.toString()[0]);
    const roundedMaxRevenue =
      (firstDigit + 1) * Math.pow(10, maxRevenue.toString().length - 1);
    return roundedMaxRevenue;
  };

  const getTotalRevenues = (data) => {
    return data.map((point) => point.totalRevenue);
  };

  useEffect(() => {
    if (data) {
      const maxRevenue = getMaxTotalRevenue(data);
      setMax(maxRevenue);
      const totalRevenues = getTotalRevenues(data);
      setDatapoints(totalRevenues);
    }
  }, [data]);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (canvasRefSales.current && datapoints.length > 0) {
      const ctx = canvasRefSales.current.getContext("2d");
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Doanh thu theo tháng",
              data: datapoints,
              borderColor: "#28a745",
              backgroundColor: "#28a745",
              fill: false, // true nếu muốn lấp đầy màu dưới đường line
              cubicInterpolationMode: "monotone",
              tension: 0.4,
              pointHoverBackgroundColor: "#ff0000",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Thống kê doanh thu",
            },
          },
          interaction: {
            intersect: false,
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
              },
            },
            y: {
              display: true,
              title: {
                display: false,
              },
              suggestedMin: 0,
              suggestedMax: max,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [datapoints, max]);

  return <canvas ref={canvasRefSales}></canvas>;
};

export default ChartSales;
