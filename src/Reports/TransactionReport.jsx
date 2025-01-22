import React, { useState, useEffect, useRef } from "react";
import { Button, Table, notification } from "antd";
import axios from "axios";
import moment from "moment";

const TransactionReport = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState({
    username: sessionStorage.getItem("username"),
    email: sessionStorage.getItem("email"),
  }); // Mock user data
  const printContentRef = useRef(); // Ref for the content to print

  const apiUrl = "http://127.0.0.1:8000/Transactions";

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [userResponse, bookResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/AdminList"),
          axios.get("http://127.0.0.1:8000/Books"),
        ]);
        setUsers(userResponse.data);
        setBooks(bookResponse.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        notification.error({
          message: "Error",
          description: "Failed to fetch users or books.",
        });
      }
    };

    fetchDropdownData();
    fetchData();
  }, []);

  // Fetch Transactions
  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      const fetchedData = response.data.map((item, index) => ({
        key: index,
        transactionID: item.id,
        userID: item.adminid,
        bookID: item.bookid,
        transactionDate: item.transaction_date,
        quantity: item.quantity,
      }));
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch transactions from the server.",
      });
    }
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionID",
      key: "transactionID",
    },
    {
      title: "User",
      dataIndex: "userID",
      key: "userID",
      render: (userID) => {
        const user = users.find((item) => item.id === userID);
        return user ? user.name : "Unknown User";
      },
    },
    {
      title: "Book",
      dataIndex: "bookID",
      key: "bookID",
      render: (bookID) => {
        const book = books.find((item) => item.id === bookID);
        return book ? book.title : "Unknown Book";
      },
    },
    {
      title: "Transaction Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  // Print Transaction Report Function
  const printTransactionReport = () => {
    if (printContentRef.current) {
      const originalContent = document.body.innerHTML;
      const printContent = printContentRef.current.innerHTML;

      // Replace the body content with the print content
      document.body.innerHTML = printContent;

      // Trigger print
      window.print();

      // Restore the original content
      document.body.innerHTML = originalContent;

      // Reattach React event listeners
      window.location.reload();
    }
  };

  return (
    <div>
      {/* Print Button */}
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={printTransactionReport}
      >
        Print it now
      </Button>

      {/* Hidden content for printing */}
      <div style={{ display: "none" }} ref={printContentRef}>
        <h1 style={{ textAlign: "center", fontSize: 28, fontWeight: "bold" }}>
          Transaction Report
        </h1>
        <strong>Email:</strong>
        <p>{user.email}</p>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="transactionID"
          footer={() => `Total items: ${data.length}`}
        />
        <div style={{ textAlign: "right" }}>
          <strong>Prepare By:</strong>
          <p>{user.username}</p>
        </div>
      </div>

      {/* Regular table view with pagination */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={true}
        rowKey="transactionID"
        title={() => "Transactions Report List"}
        footer={() => `Total items: ${data.length}`}
      />
    </div>
  );
};
export default TransactionReport;
