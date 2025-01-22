import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
const SideBarError404 = () => {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate("/Layout");
  };
  return (
    <Result
      style={{ fontWeight: "bold" }}
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={handleGoHome}>
          Back Home
        </Button>
      }
    />
  );
};
export default SideBarError404;
