import React, { useState, useEffect } from "react";
import { Button, Image, Input, Space, Table, notification } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const HistoryBook = () => {
  const [allBooks, setAllBooks] = useState([]); // Store all books
  const [data, setData] = useState([]); // Store filtered books
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);

  const apiUrl = "http://127.0.0.1:8000/Books";

  // Fetch dropdown data
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

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const response = await axios.get(apiUrl);
      setAllBooks(response.data); // Save all books
    } catch (error) {
      console.error("Error fetching books:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch books from the server.",
      });
    }
  };

  // Filter books based on the business category
  const filterBooks = () => {
    if (!categories.length || !allBooks.length) return;

    const historyCategory = categories.find(
      (c) => c.name=== "History"
    );

    if (!historyCategory) {
      setData([]);
      return;
    }

    const historyBooks = allBooks
      .filter((item) => item.categoryid === historyCategory.id)
      .map((item, index) => ({
        key: index,
        bookID: item.id,
        title: item.title,
        image: item.image,
        publisherID: item.publisherid,
        categoryID: "History", // Example transformation
        publishedYear: item.published_year,
        quantity: item.quantity,
        price:"$ "+item.price,
      }));

    setData(historyBooks);
  };

  // Run fetch functions on mount
  useEffect(() => {
    fetchDropdownData();
    fetchBooks();
  }, []);

  // Refilter data when `categories` or `allBooks` changes
  useEffect(() => {
    filterBooks();
  }, [categories, allBooks]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters()}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
  });

  const columns = [
    {
      title: "Book ID",
      dataIndex: "bookID",
      key: "bookID",
      ...getColumnSearchProps("bookID"),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps("title"),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (_ , record) => <Image alt="Book Image" src={record.image} width={100} />,
    },
    {
      title: "Publisher",
      dataIndex: "publisherID",
      key: "publisherID",
      render: (publisherID) => {
        const publisher = publishers.find((item) => item.id === publisherID);
        return publisher ? publisher.name : <h1 className="text-red-500">None</h1>;
      },
      ...getColumnSearchProps("publisher", publishers),
    },
    {
      title: "Category",
      dataIndex: "categoryID",
      key: "categoryID",
    },
    {
      title: "Published Year",
      dataIndex: "publishedYear",
      key: "publishedYear",
      ...getColumnSearchProps("publishedYear"),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      ...getColumnSearchProps("quantity"),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right",
      ...getColumnSearchProps("price"),
    },
  ];



  return (
    <div>
      <h1 className="w-full mb-10 text-3xl">History Books List</h1>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        rowKey="bookID"
      />
    </div>
  );
};

export default HistoryBook;
