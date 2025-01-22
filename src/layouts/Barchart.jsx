import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import axios from "axios";
import { notification } from "antd";

const BarChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);

  const fetchData = async () => {
    try {
      const [booksResponse, transactionsResponse] = await Promise.all([
        axios.get("http://127.0.0.1:8000/Books"),
        axios.get("http://127.0.0.1:8000/Transactions"),
      ]);

      const books = booksResponse.data;
      const transactions = transactionsResponse.data;

      const bookPriceMap = books.reduce((acc, book) => {
        if (book.id && book.price) {
          acc[book.id] = book.price;
        } else {
          console.warn("Missing bookid or price in Books API:", book);
        }
        return acc;
      }, {});

      const salesSummary = {};

      transactions.forEach((transaction) => {
        const { bookid, quantity, transaction_date } = transaction;
        const bookPrice = bookPriceMap[bookid];
        if (!bookPrice) return;

        const totalSales = quantity * bookPrice;
        const month = new Date(transaction_date).toLocaleString("default", {
          month: "long",
        });

        if (!salesSummary[month]) salesSummary[month] = 0;
        salesSummary[month] += totalSales;
      });

      // Order months chronologically
      const monthOrder = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const sortedMonths = monthOrder.filter(
        (month) => salesSummary[month] !== undefined
      );
      const sortedSales = sortedMonths.map((month) => salesSummary[month]);

      setCategoriesData(sortedMonths);
      setSalesData(sortedSales);
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data from the server.",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (salesData.length === 0 || categoriesData.length === 0) return;

    const barChartOptions = {
      chart: {
        height: 350,
        type: "bar",
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      series: [
        {
          name: "Sales",
          data: salesData,
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: 30,
          borderRadius: 0,
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 8,
        colors: ["transparent"],
      },
      xaxis: {
        categories: categoriesData,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            colors: "#9ca3af",
            fontSize: 13,
            fontFamily: "Poppins",
            fontWeight: 400,
          },
          offsetX: -2,
          formatter: (title) => title.slice(0, 3),
        },
      },
      yaxis: {
        labels: {
          align: "left",
          minWidth: 0,
          maxWidth: 140,
          style: {
            colors: "#9ca3af",
            fontSize: 13,
            fontFamily: "Poppins",
            fontWeight: 400,
          },
          formatter: (value) => (value >= 1000 ? `${value / 1000}k` : value),
        },
      },
      tooltip: {
        y: {
          formatter: (value) =>
            `$${value >= 1000 ? `${value / 1000}k` : value}`,
        },
      },
      colors: ["#2563eb", "#d1d5db"],
    };

    const chartContainer = document.querySelector("#hs-single-bar-chart");
    if (!chartContainer) return;

    const chart = new ApexCharts(chartContainer, barChartOptions);
    chart.render();


    return () => {
      if (chart) chart.destroy();
    };
  }, [salesData, categoriesData]);

  return (
    <div
      id="hs-single-bar-chart"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "400px",
        marginTop: "10px",
        padding: "5px 20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
      }}
    ></div>
  );
};

export default BarChart;
