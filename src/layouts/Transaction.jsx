import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Space,
  Table,
  Modal,
  Form,
  InputNumber,
  notification,
  Select,
  DatePicker,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const Transaction = () => {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

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

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      const fetchedData = response.data.map((item, index) => ({
        key: index,
        transactionID: item.id,
        userID: item.adminid, // Corrected to match the backend
        bookID: item.bookid, // Corrected to match the backend
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
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleAddRow = () => {
    setEditingRecord(null);
    form.setFieldsValue({
      user: "",
      book: "",
      transactionDate: null,
      quantity: "",
    });
    setIsModalVisible(true);
  };

  const addNewTransaction = async (formData) => {
    try {
      await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "application/json" },
      });

      notification.success({
        message: "Transaction added successfully!",
      });

      fetchData();
    } catch (error) {
      console.error("Error adding transaction:", error);
      notification.error({
        message: "Error",
        description: "Failed to add the transaction.",
      });
    }
  };

  const updateTransaction = async (formData) => {
    try {
      await axios.put(
        `${apiUrl}/${formData.transactionID}`,
        {
          adminid: formData.adminid,
          bookid: formData.bookid,
          quantity: formData.quantity,
          transaction_date: formData.transaction_date,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      notification.success({
        message: "Transaction updated successfully!",
      });

      fetchData();
    } catch (error) {
      console.error("Error updating transaction:", error);
      notification.error({
        message: "Error",
        description: "Failed to update the transaction.",
      });
    }
  };

  const handleSubmit = async (values) => {
    const formData = {
      adminid: values.user,
      bookid: values.book,
      quantity: values.quantity,
      transaction_date: values.transactionDate.format("YYYY-MM-DD"),
    };
    try {
      if (editingRecord) {
        await updateTransaction({
          ...formData,
          transactionID: editingRecord.transactionID,
        });
      } else {
        await addNewTransaction(formData);
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
      notification.error({
        message: "Error",
        description: "Failed to submit the form.",
      });
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      user: record.userID,
      book: record.bookID,
      quantity: record.quantity,
      transactionDate: record.transactionDate
        ? moment(record.transactionDate, "YYYY-MM-DD")
        : null,
    });
    setIsModalVisible(true);
  };


  const handleDelete = (transactionID, userID, bookID) => {
    notification.open({
      message: "Confirm Deletion",
      description: `Are you sure you want to delete this transaction?`,
      btn: (
        <Space>
          <Button
            type="primary"
            danger
            onClick={() => confirmDelete(transactionID, userID, bookID)}
          >
            Confirm
          </Button>
          <Button onClick={() => notification.destroy()}>Cancel</Button>
        </Space>
      ),
      duration: 0, // Keeps the notification open until action is taken
      placement: "top",
    });
  };

  const confirmDelete = async (transactionID) => {
    try {
      // Make the delete request to the backend
      await axios.delete(
        `http://127.0.0.1:8000/Transactions/${transactionID}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      notification.destroy();
      notification.success({
        message: "Deletion Successful",
        description: `Transaction with ID: ${transactionID} has been successfully deleted.`,
        duration: 2,
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      notification.error({
        message: "Error",
        description: `Failed to delete transaction with ID: ${transactionID}.`,
        duration: 2,
      });
    }
  };

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
            onClick={() => handleReset(clearFilters)}
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
    onFilter: (value, record) => {
      // Search logic for user
      if (dataIndex === "userID") {
        const user = users.find((item) => item.id === record.userID);
        return user
          ? user.name.toLowerCase().includes(value.toLowerCase())
          : false;
      }

      // Search logic for book
      if (dataIndex === "bookID") {
        const book = books.find((item) => item.id === record.bookID);
        return book
          ? book.title.toLowerCase().includes(value.toLowerCase())
          : false;
      }

      return record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "";
    },
  });

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionID",
      key: "transactionID",
      ...getColumnSearchProps("transactionID"),
    },
    {
      title: "User",
      dataIndex: "userID",
      key: "userID",
      render: (userID) => {
        const user = users.find((item) => item.id === userID);
        return user ? user.name : "Unknown User";
      },
      ...getColumnSearchProps("userID"),
    },
    {
      title: "Book",
      dataIndex: "bookID",
      key: "bookID",
      render: (bookID) => {
        const book = books.find((item) => item.id === bookID);
        return book ? book.title : "Unknown Book";
      },
      ...getColumnSearchProps("bookID"),
    },
    {
      title: "Transaction Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (transactionDate) =>
        transactionDate ? moment(transactionDate).format("YYYY-MM-DD") : "N/A",
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      ...getColumnSearchProps("quantity"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleDelete(record.transactionID)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={handleAddRow}
        style={{ marginBottom: 16 }}
      >
        Add New Transaction
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="transactionID"
        bordered
        pagination={true}
        title={() => "Transactions List Information"}
        footer={() => `Total items: ${data.length}`}
      />

      <Modal
        title={editingRecord ? "Edit Transaction" : "Add Transaction"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="user"
            label="User"
            rules={[{ required: true, message: "Please select a user!" }]}
          >
            <Select placeholder="Select a User">
              {users.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="book"
            label="Book"
            rules={[{ required: true, message: "Please select a book!" }]}
          >
            <Select placeholder="Select a Book">
              {books.map((book) => (
                <Select.Option key={book.id} value={book.id}>
                  {book.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="transactionDate"
            label="Transaction Date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please input the quantity!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {editingRecord ? "Update Transaction" : "Add Transaction"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Transaction;
