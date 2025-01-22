import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Space,
  Table,
  Modal,
  Form,
  notification,
  Select,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const AuthorBook = () => {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const apiUrl = "http://127.0.0.1:8000/AuthorBooks";

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [authorResponse, bookResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/Authors"),
          axios.get("http://127.0.0.1:8000/Books"),
        ]);
        setAuthors(authorResponse.data);
        setBooks(bookResponse.data);
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Failed to fetch authors or books.",
        });
      }
    };
    fetchDropdownData();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      const { data } = response;
      const fetchedData = data.map((item, index) => ({
        key: index,
        authorbookid: item.id,
        authorid: item.authorid,
        bookid: item.bookid,
      }));
      setData(fetchedData);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch authorBooks from the server.",
      });
    }
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleAddRow = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const addNewAuthorBook = async (formData) => {
    try {
      console.log(formData)
      await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "application/json" },
      });
      notification.success({
        message: "AuthorBook added successfully!",
      });
      fetchData();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to add the authorBook.",
      });
    }
  };

  const updateAuthorBook = async (formData) => {
    try {
      await axios.put(
        `${apiUrl}/${formData.authorbookid}`,
        {
          authorid: formData.authorid,
          bookid: formData.bookid,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      notification.success({
        message: "AuthorBook updated successfully!",
      });
      fetchData();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update the authorBook.",
      });
    }
  };

  const handleSubmit = async (values) => {
    const formData = {
      
      authorid: values.author,
      bookid: values.book,
    };
    console.log(formData);
    try {
      if (editingRecord) {
        await updateAuthorBook({ ...formData, authorbookid: editingRecord.authorbookid });
      } else {
        await addNewAuthorBook(formData);
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to submit the form.",
      });
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      author: record.authorid,
      book: record.bookid,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (authorbookid) => {
    notification.open({
      message: "Confirm Deletion",
      description: `Are you sure you want to delete this authorBook?`,
      btn: (
        <Space>
          <Button
            type="primary"
            danger
            onClick={() => confirmDelete(authorbookid)}
          >
            Confirm
          </Button>
          <Button onClick={() => notification.destroy()}>Cancel</Button>
        </Space>
      ),
      duration: 0,
    });
  };

  const confirmDelete = async (authorbookid) => {
    try {
      await axios.delete(`${apiUrl}/${authorbookid}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      notification.destroy();
      notification.success({
        message: "Deletion Successful",
        description: `AuthorBook with ID: ${authorbookid} has been successfully deleted.`,
      });
      fetchData();
    } catch (error) {
      notification.error({
        message: "Error",
        description: `Failed to delete authorBook with ID: ${authorbookid}.`,
      });
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (dataIndex === "authorid") {
        const author = authors.find((item) => item.id === record.authorid);
        return author ? author.name.toLowerCase().includes(value.toLowerCase()) : false;
      }
      if (dataIndex === "bookid") {
        const book = books.find((item) => item.id === record.bookid);
        return book ? book.title.toLowerCase().includes(value.toLowerCase()) : false;
      }
      return record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : "";
    },
  });

  const columns = [
    {
      title: "AuthorBook ID",
      dataIndex: "authorbookid",
      key: "authorbookid",
      ...getColumnSearchProps("authorbookid"),
    },
    {
      title: "Author",
      dataIndex: "authorid",
      key: "authorid",
      render: (authorid) => {
        const author = authors.find((item) => item.id === authorid);
        return author ? author.name : "Unknown Author";
      },
      ...getColumnSearchProps("authorid"),
    },
    {
      title: "Book",
      dataIndex: "bookid",
      key: "bookid",
      render: (bookid) => {
        const book = books.find((item) => item.id === bookid);
        return book ? book.title : "Unknown Book";
      },
      ...getColumnSearchProps("bookid"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record.authorbookid)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAddRow} style={{ marginBottom: 16 }}>
        Add New AuthorBook
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="authorbookid"
        bordered
        pagination
        title={() => "AuthorBooks List Information"}
        footer={() => `Total items: ${data.length}`}
      />
      <Modal
        title={editingRecord ? "Edit AuthorBook" : "Add AuthorBook"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="author"
            label="Author"
            rules={[{ required: true, message: "Please select an author!" }]}
          >
            <Select placeholder="Select an Author">
              {authors.map((author) => (
                <Select.Option key={author.id} value={author.id}>
                  {author.name}
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
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {editingRecord ? "Update AuthorBook" : "Add AuthorBook"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AuthorBook;
