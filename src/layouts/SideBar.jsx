import React, { useState } from "react";
import {
  UserOutlined,
  FilePdfOutlined,
  ProductOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LoadingOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  BookFilled,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, notification, Spin } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import ScrollToTop from "../Scroll";
import authorIcon from "../Images/author.png"
const { Header, Sider, Content } = Layout;
// const { SubMenu } = Menu;

const SideBar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isloading, setIsLoading] = useState(false);
  const username = sessionStorage.getItem("username");

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  function handleNavigate(path) {
    navigate(path);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }

  // Logout function with custom spinner
  const handleLogout = () => {
    setLoading(true);

    setTimeout(() => {
      sessionStorage.clear();
      notification.success({
        message: "Logged Out",
        description: "You have logged out successfully.",
        duration: 2,
      });

      navigate("/");

      setLoading(false);
    }, 2000);
  };
  const categoryItems = [
    {
      key: 5,
      label: "Publisher",
      onClick: () => handleNavigate("Publisher"),
    },
    {
      key: 6,
      label: "Transaction",
      onClick: () => handleNavigate("Transaction"),
    },
   
    {
      key: 7,
      label: "Author",
      onClick: () => handleNavigate("Author"),
    }
  ];
  const bookTypes = [
    {
      key: 8,
      label: "Business",
      onClick: () => handleNavigate("Business"),
    },
    {
      key: 9,
      label: "Technology",
      onClick: () => handleNavigate("Technology"),
    },
    {
      key: 10,
      label: "History",
      onClick: () => handleNavigate("History"),
    },
  ];
  const reportItems = [
    {
      key: 11,
      label: "Book Report",
      onClick: () => handleNavigate("BookReport"),
    },
    {
      key: 12,
      label: "Transaction Report",
      onClick: () => handleNavigate("TransactionReport"),
    },
  ];
  const menuItems = [
    {
      key: 0,
      icon: <UserOutlined style={{ fontSize: 20 }} />,
      label: `${username}`,
      disabled: true,
    },
    {
      key: 1,
      icon: <ProductOutlined style={{ fontSize: 20 }} />,
      label: "Dashboard",
      onClick: () => handleNavigate("/Layout"),
    },
    {
      key: 2,
      icon: <BookFilled style={{ fontSize: 20 }} />,
      label: "All Books",
      onClick: () => handleNavigate("Book"),
    },
    {
      key: 3,
      icon: <img src={authorIcon} className="" style={{width:20 , background:"none" }}/>,
      label: "Book By Author",
      onClick: () => handleNavigate("AuthorBook"),
    },
    {
      key: "sub1",
      icon: <AppstoreOutlined style={{ fontSize: 20 }} />,
      label: "Categories",
      items: categoryItems,
    },
    {
      key: "sub2",
      icon: <MenuFoldOutlined style={{ fontSize: 20 }} />,
      label: "Book Types",
      items: bookTypes,
    },
    {
      key: "sub3",
      icon: <FilePdfOutlined style={{ fontSize: 20 }} />,
      label: "Reports",
      items: reportItems,
    },
    {
      key: 4,
      icon: loading ? (
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />}
          size="small"
        />
      ) : (
        <LogoutOutlined style={{ fontSize: 20 }} />
      ),
      label: loading ? "Logging out" : "Log out",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ fontFamily: "Poppins", fontWeight: "bold" }}>
      {/* Sticky Sidebar */}
      <ScrollToTop />
      <Sider
        trigger={null}
        collapsible
        width={270}
        collapsed={collapsed}
        style={{
          position: "sticky", // Make sidebar sticky
          top: 0, // Keep sidebar at the top when scrolling
          height: "100lvh", // Make sure the sidebar covers the full height
          // zIndex: 100, // Ensure it is on top of other elements
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          style={{
            fontSize: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems.map((item) => {
            // Check if the item is a category dropdown (SubMenu)
            if (item.items) {
              return {
                ...item,
                children: item.items.map((categoryItem) => ({
                  key: categoryItem.key,
                  label: categoryItem.label,
                  onClick: categoryItem.onClick,
                })),
              };
            }
            return {
              ...item,
              onClick: item.onClick,
            };
          })}
        />
      </Sider>

          {/* for delay fetching data */}
      {isloading ? (
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
          size="large"
          className="flex items-center justify-center w-full"
        />
      ) : (
        <Layout>
          <Header
            style={{
              display: "flex",
              // justifyContent: "space-around"
              alignItems: "center",
              padding: 0,
              background: colorBgContainer,
              position: "sticky", // Make header sticky
              top: 0, // Keep it at the top
              zIndex: 1, // Ensure the header stays above content
            }}
          >
            <Button
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined style={{ fontSize: 20 }} />
                ) : (
                  <MenuFoldOutlined style={{ fontSize: 20 }} />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>

          <Content
            style={{
              fontSize: "22px",
              margin: "24px 16px",
              padding: 24,
              minHeight: "100vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      )}
    </Layout>
  );
};
export default SideBar;
