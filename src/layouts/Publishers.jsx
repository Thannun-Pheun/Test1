import React, { useState, useEffect } from "react";
import { Button, Input, Space, Table, Modal, Form, notification } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const Publishers = () => {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const apiUrl = "http://127.0.0.1:8000/Publishers";

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      const { data } = response;
      console.log("API Response:", data);
      const fetchedData = data.map((item, index) => ({
        key: index,
        publisherID: item.id, 
        name: item.name,
        address: item.address,
        phone: item.phone,
        email: item.email,
      }));
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Error",
        description: "Failed to fetch data from the server.",
        duration: 2,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
  });

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleAddRow = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const addNewPublisher = async (formData) => {
    try {
      await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "application/json" },
      });
      notification.success({
        message: "Publisher added successfully!",
        duration: 2,
      });
      fetchData();
    } catch (error) {
      console.error("Error adding publisher:", error);
      notification.error({
        message: "Error",
        description: "Failed to add the publisher.",
        duration: 2,
      });
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      address: record.address,
      phone: record.phone,
      email: record.email,
    });
    setIsModalVisible(true);
  };

  const updatePublisher = async (formData) => {
    try {
      
      await axios.put(`${apiUrl}/${editingRecord.publisherID}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      notification.success({
        message: "Publisher updated successfully!",
        duration: 2,
      });
      console.log("Updating publisher with data:", formData);
      console.log(`Request URL:, ${apiUrl}/${editingRecord.publisherID}`);
      fetchData();
    } catch (error) {
      console.error("Error updating publisher:", error);
      notification.error({
        message: "Error",
        description: "Failed to update the publisher.",
        duration: 2,
      });
    }
  };


  const handleSubmit = async (values) => {
    const formData = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      email: values.email,
    };
    try {
      if (editingRecord) {
        await updatePublisher({ ...formData, id: editingRecord.publisherID });
      } else {
        await addNewPublisher(formData);
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const confirmDelete = async (publisherID, name) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/Publishers/${publisherID}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      notification.destroy();
      notification.success({
        message: "Deletion Successful",
        description: `Publisher ${name} has been successfully deleted.`,
        duration: 2,
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting publisher:", error);
      notification.error({
        message: "Error",
        description: `Failed to delete publisher ${name}.`,
        duration: 2,
      });
    }
  };
  const handleDelete = (publisherID, name) => {
    notification.open({
      message: "Confirm Deletion",
      description: `Are you sure you want to delete publisher:${name}?`,
      btn: (
        <Space>
          <Button
            type="primary"
            danger
            onClick={() => confirmDelete(publisherID, name)}
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
  const columns = [
    {
      title: "Publisher ID",
      dataIndex: "publisherID",
      key: "publisherID",
      ...getColumnSearchProps("publisherID"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
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
            style={{ fontWeight: "bold" }}
            type="primary"
            danger
            onClick={() => handleDelete(record.publisherID, record.name)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];


  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAddRow}>
          Add Publisher
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="publisherID"
        bordered
        pagination={true}
        title={() => "Publishers List Information"}
        footer={() => `Total items: ${data.length}`}
      />
      <Modal
        title={editingRecord ? "Edit Publisher" : "Add New Publisher"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter the address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter the phone!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter the email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {editingRecord ? "Update Publisher" : "Add Publisher"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Publishers;
