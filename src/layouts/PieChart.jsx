import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import axios from "axios";

const PieChart = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Fetch all books
  const fetchBooks = async () => {
    const apiUrl = "http://127.0.0.1:8000/Books"; // Replace with your API endpoint
    try {
      const response = await axios.get(apiUrl);
      const { data } = response;
      setAllBooks(data);
      console.log("Book Price Example:", data[0]?.price); // Debugging
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    const categoryApi = "http://127.0.0.1:8000/Categories";
    try {
      const response = await axios.get(categoryApi);
      const { data } = response;
      setCategories(data);
      console.log("Category Name Example:", data[0]?.name); // Debugging
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch all transactions
  const fetchTransactions = async () => {
    const transactionApi = "http://127.0.0.1:8000/Transactions";
    try {
      const response = await axios.get(transactionApi);
      const { data } = response;
      setTransactions(data);
      console.log("Transaction Example:", data[0]?.quantity, data[0]?.bookid); // Debugging
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchTransactions();
  }, []);

  // Calculate sales by category and render chart
  useEffect(() => {
    if (!allBooks.length || !categories.length || !transactions.length) return;

    const salesByCategory = categories.map((category) => {
      // Get books belonging to the current category
      const categoryBooks = allBooks.filter(
        (book) => book.categoryid === category.id
      );

      // Calculate total sales for the category by summing (quantity * price)
      const totalSales = categoryBooks.reduce((total, book) => {
        // Find transactions for the current book
        const bookTransactions = transactions.filter(
          (txn) => txn.bookid === book.id
        );

        // Calculate sales for the book
        const salesForBook = bookTransactions.reduce(
          (sum, txn) => sum + txn.quantity * book.price,
          0
        );

        return total + salesForBook;
      }, 0);

      return { categoryName: category.name, totalSales };
    });

    const seriesData = salesByCategory.map((item) => item.totalSales);
    const labelsData = salesByCategory.map((item) => item.categoryName);

    console.log("Sales by Category (Price):", salesByCategory);

    const pieChartOptions = {
      chart: {
        height: 350,
        type: "pie",
      },
      series: seriesData,
      labels: labelsData,
      colors: ["#00008B", "#1F75FE", "#74BBFB"],
      dataLabels: {
        style: {
          fontSize: "14px",
        },
      },
      legend: {
        position: "bottom",
      },
    };

    const chartContainer = document.querySelector("#hs-pie-chart");
    if (!chartContainer) {
      console.error("Chart container not found");
      return;
    }

    const chart = new ApexCharts(chartContainer, pieChartOptions);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [allBooks, categories, transactions]);

  return (
    <div
      className="chart-container"
      style={{
        height: "400px",
        marginTop: "10px",
        padding: "5px 20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
      }}
    >
      <div id="hs-pie-chart"></div>
    </div>
  );
};

export default PieChart;
