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
  Image,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const TableProduct = () => {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

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
        publisherID: item.publisherid, // Make sure to use the correct ID field
        categoryID: item.categoryid, // Make sure to use the correct ID field
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

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleAddRow = () => {
    setEditingRecord(null);
    form.setFieldsValue({
      title: "",
      image: "",
      publisher: "",
      category: "",
      publishedYear: "",
      quantity: "",
      price: "",
    });
    setIsModalVisible(true);
  };

  // for adding product
  const addNewProduct = async (formData) => {
    try {
      await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "application/json" },
      });

      notification.success({
        message: "Product added successfully!",
        duration: 2,
        placement: "topRight",
      });

      fetchData(); // Refresh data after adding
    } catch (error) {
      console.error("Error adding product:", error);
      notification.error({
        message: "Error",
        description: "Failed to add the product.",
        duration: 2,
        placement: "topRight",
      });
    }
  };

  // for updating a product
  const updateProduct = async (formData) => {
    try {
      await axios.put(
        `${apiUrl}/${formData.bookID}`,
        {
          title: formData.title,
          image: formData.image,
          publisherid: formData.publisherid,
          categoryid: formData.categoryid,
          published_year: formData.published_year,
          quantity: formData.quantity,
          price: formData.price,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      notification.success({
        message: "Product updated successfully!",
        duration: 2,
        placement: "topRight",
      });

      fetchData(); // Refresh data after update
    } catch (error) {
      console.error("Error updating product:", error);
      notification.error({
        message: "Error",
        description: "Failed to update the product.",
        duration: 2,
        placement: "topRight",
      });
    }
  };

  // Handle Form Submission
  const handleSubmit = async (values) => {
    const formData = {
      title: values.title,
      image: values.image,
      publisherid: values.publisher, // Use the ID of the publisher
      categoryid: values.category, // Use the ID of the category
      published_year: values.publishedYear,
      quantity: values.quantity,
      price: values.price,
    };

    try {
      if (editingRecord) {
        // If editing an existing record, update it
        await updateProduct({ ...formData, bookID: editingRecord.bookID });
      } else {
        // If adding a new record, create it
        await addNewProduct(formData);
      }

      // Close the modal and reset the form
      setIsModalVisible(false);
      form.resetFields(); // Ensure the form is cleared after submission
    } catch (error) {
      console.error("Error submitting form:", error);
      notification.error({
        message: "Error",
        description: "Failed to submit the form.",
        duration: 2,
        placement: "topRight",
      });
    }
  };
  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      title: record.title,
      image: record.image,
      publisher: record.publisherID, // Ensure this is the publisher ID
      category: record.categoryID, // Ensure this is the category ID
      publishedYear: record.publishedYear,
      quantity: record.quantity,
      price: record.price,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (bookID, title) => {
    notification.open({
      message: "Confirm Deletion",
      description: `Are you sure you want to delete book: ${title}?`,
      btn: (
        <Space>
          <Button
            type="primary"
            danger
            onClick={() => confirmDelete(bookID, title)}
          >
            Confirm
          </Button>
          <Button onClick={() => notification.destroy()}>Cancel</Button>
        </Space>
      ),
      duration: 0,
      placement: "top",
    });
  };

  const confirmDelete = async (bookID, title) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/Books/${bookID}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      notification.destroy();
      notification.success({
        message: "Deletion Successful",
        description: `Book ${title} has been successfully deleted.`,
        duration: 2,
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting book:", error);
      notification.error({
        message: "Error",
        description: `Failed to delete book ${title}.`,
        duration: 2,
      });
    }
  };
  const getColumnSearchProps = (dataIndex, searchText) => ({
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
      // Search logic for Publisher by name
      if (dataIndex === "publisher") {
        const publisher = searchText.find(
          (item) => item.id === record.publisherID
        );
        return publisher
          ? publisher.name.toLowerCase().includes(value.toLowerCase())
          : false;
      }

      // Search logic for Category by name
      if (dataIndex === "category") {
        const category = searchText.find(
          (item) => item.id === record.categoryID
        );
        return category
          ? category.name.toLowerCase().includes(value.toLowerCase())
          : false;
      }

      // Default search logic
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
      render: (_, record) => {
        return record.image ? (
          <Image width={70} src={record.image} />
        ) : (
          <span>No Image</span>
        );
      },
    },
    {
      title: "Publisher",
      dataIndex: "publisherID",
      key: "publisherID",
      render: (publisherID) => {
        const publisher = publishers.find((item) => item.id === publisherID);
        return publisher ? publisher.name : "Unknown Publisher";
      },
      ...getColumnSearchProps("publisher", publishers),
    },
    {
      title: "Category",
      dataIndex: "categoryID",
      key: "categoryID",
      render: (categoryID) => {
        const category = categories.find((item) => item.id === categoryID);
        return category ? category.name : "Unknown Category";
      },
      ...getColumnSearchProps("category", categories),
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
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleDelete(record.bookID, record.title)}
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
        Add New Book
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="bookID"
        bordered
        pagination={true}
        title={() => "Books List Information"}
        footer={() => `Total items: ${data.length}`}
      />

      <Modal
        title={editingRecord ? "Update Book" : "Add New Book"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false); // Close modal
          form.resetFields(); // Reset form when closing the modal
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={editingRecord || {}}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Image URL"
            name="image"
            rules={[{ required: true, message: "Please input the image URL!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="publisher"
            label="Publisher"
            rules={[{ required: true, message: "Please select a publisher!" }]}
          >
            <Select placeholder="Select a Publisher">
              {publishers.map((publisher) => (
                <Select.Option key={publisher.id} value={publisher.id}>
                  {publisher.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select placeholder="Select a Category">
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Published Year"
            name="publishedYear"
            rules={[
              { required: true, message: "Please input the published year!" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please input the quantity!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {editingRecord ? "Update Book" : "Add Book"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default TableProduct;
