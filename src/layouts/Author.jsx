import React, { useState, useEffect } from "react";
import { Button, Input, Space, Table, Modal, Form, notification } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const Author = () => {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const apiUrl = "http://127.0.0.1:8000/Authors";

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      const { data } = response;
      console.log("API Response:", data);
      const fetchedData = data.map((item, index) => ({
        key: index,
        authID: item.id, 
        name: item.name,
        created_at:item.created_at,
        updated_at: item.updated_at,
      }))
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
        message: "Author added successfully!",
        duration: 2,
      });
      fetchData();
    } catch (error) {
      console.error("Error adding author:", error);
      notification.error({
        message: "Error",
        description: "Failed to add the Author.",
        duration: 2,
      });
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,

    });
    setIsModalVisible(true);
  };

  const updatePublisher = async (formData) => {
    try {
      
      await axios.put(`${apiUrl}/${editingRecord.authID}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      notification.success({
        message: "Author updated successfully!",
        duration: 2,
      });
      console.log("Updating publisher with data:", formData);
      console.log(`Request URL:, ${apiUrl}/${editingRecord.authID}`);
      fetchData();
    } catch (error) {
      console.error("Error updating author:", error);
      notification.error({
        message: "Error",
        description: "Failed to update the author.",
        duration: 2,
      });
    }
  };


  const handleSubmit = async (values) => {
    const formData = {
      name: values.name,
 
    };
    try {
      if (editingRecord) {
        await updatePublisher({ ...formData, id: editingRecord.authID });
      } else {
        await addNewPublisher(formData);
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const confirmDelete = async (authID, name) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/Author/${authID}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      notification.destroy();
      notification.success({
        message: "Deletion Successful",
        description: `Author ${name} has been successfully deleted.`,
        duration: 2,
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting Author:", error);
      notification.error({
        message: "Error",
        description: `Failed to delete author ${name}.`,
        duration: 2,
      });
    }
  };
  const handleDelete = (authID, name) => {
    notification.open({
      message: "Confirm Deletion",
      description: `Are you sure you want to delete author:${name}?`,
      btn: (
        <Space>
          <Button
            type="primary"
            danger
            onClick={() => confirmDelete(authID, name)}
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
      title: "Author ID",
      dataIndex: "authID",
      key: "authID",
      ...getColumnSearchProps("authID"),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
        title: "Created Date",
        dataIndex: "created_at",
        key: "created_at",
        render: (value) => new Date(value).toLocaleString(),
      
    },
    {
        title: "Updated Date",
        dataIndex: "updated_at",
        key: "updated_at",
        render: (value) => new Date(value).toLocaleString(),
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
            onClick={() => handleDelete(record.authID, record.name)}
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
          Add Author
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="authID"
        bordered
        pagination={true}
        title={() => "Author List Information"}
        footer={() => `Total items: ${data.length}`}
      />
      <Modal
        title={editingRecord ? "Edit Publisher" : "Add New Auhor"}
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
export default Author;
