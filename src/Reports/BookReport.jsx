import React, { useState, useEffect, useRef } from "react";
import { Button, Table, notification } from "antd";
import axios from "axios";

const BookReport = () => {
  const [data, setData] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState({
    username: sessionStorage.getItem("username"),
    email: sessionStorage.getItem("email"),
  }); // Mock user data
  const printContentRef = useRef(); // Ref for the content to print

  const apiUrl = "http://127.0.0.1:8000/Books";

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [publisherResponse, categoryResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/Publishers"),
          axios.get("http://127.0.0.1:8000/Categories"),
        ]);
        setPublishers(publisherResponse.data);
        setCategories(categoryResponse.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        notification.error({
          message: "Error",
          description: "Failed to fetch publishers or categories.",
        });
      }
    };
    fetchDropdownData();
    fetchData();
  }, []);

  // Fetch Books
  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      const fetchedData = response.data.map((item, index) => ({
        key: index,
        bookID: item.id,
        title: item.title,
        image: item.image,
        publisherID: item.publisherid,
        categoryID: item.categoryid,
        publishedYear: item.published_year,
        quantity: item.quantity,
        price: item.price,
      }));
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching books:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch books from the server.",
      });
    }
  };

  const columns = [
    {
      title: "Book ID",
      dataIndex: "bookID",
      key: "bookID",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Publisher",
      dataIndex: "publisherID",
      key: "publisherID",
      render: (publisherID) => {
        const publisher = publishers.find((item) => item.id === publisherID);
        return publisher ? publisher.name : "Unknown Publisher";
      },
    },
    {
      title: "Category",
      dataIndex: "categoryID",
      key: "categoryID",
      render: (categoryID) => {
        const category = categories.find((item) => item.id === categoryID);
        return category ? category.name : "Unknown Category";
      },
    },
    {
      title: "Published Year",
      dataIndex: "publishedYear",
      key: "publishedYear",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right",
    },
  ];

  // Print Book Report Function
  const printBookReport = () => {
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
        onClick={printBookReport}
      >
        Print Book Report
      </Button>
      <div style={{ display: "none" }} ref={printContentRef}>
        <h1 style={{ textAlign: "center", fontSize:28, fontWeight:"bold" }}>Book Report</h1>
        <strong>Email:</strong>
        <p>{user.email}</p>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="bookID"
          footer={() => `Total items: ${data.length}`}
        />
        <div style={{textAlign:"right"}}>
          <strong>Prepare By:</strong>
          <p>{user.username}</p>
        </div>
      </div>

      {/* Regular table view with pagination */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={true}
        rowKey="bookID"
        title={() => "Books Report List"}
        footer={() => `Total items: ${data.length}`}
      />
    </div>
  );
};

export default BookReport;
