import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Empty, notification, Spin } from "antd";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
{
  /* <EyeOutlined />
<EyeInvisibleOutlined /> */
}
import axios from "axios";
const Signup = () => {
  const navigate = useNavigate();
  const name = useRef();
  const em = useRef();
  const pwd = useRef();
  const confPwd = useRef();
  const idNumber = useRef();
  const validateIdNumber = "bbu123"
  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(false);
  //this state use to show eye icon
  const [visible, setVisible] = useState(false);
  const api = "http://127.0.0.1:8000/AdminList";

  function handleShowPassword() {
    setVisible(!visible);
  }
  async function getAdmin() {
    const respone = await axios.get(api);
    const { data } = respone;
    setAdminList(data);
    return data;
  }
  async function handSignUp(e) {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const email = em.current.value;
      const password = pwd.current.value;
      const inputName = name.current.value;
      const confirmPassword = confPwd.current.value;
      const codeNumber = idNumber.current.value;
      const adminWithEmail = adminList.find((item) => item.email === email);
      const adminWithName = adminList.find((item) => item.name === inputName);
    
      if (adminWithEmail) {
        notification.error({
          message: "Email already exists",
          description: "Please use a different email.",
          duration: 2,
        });
        setLoading(false);  
        return; // Stop execution if email exists
      }

      if (adminWithName) {
        notification.error({
          message: "Username already exists",
          description: "Please use a different username.",
          duration: 2,
        });
        setLoading(false);
        return; // Stop execution if username exists
      }

      if (password === confirmPassword && codeNumber === validateIdNumber) {
        notification.success({
          message: "Successful",
          description: "Account has been created successfully.",
          duration: 2,
        });

        const body = {
          name: inputName,
          email: email,
          password: password,
        };

        await axios.post(api, body, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        getAdmin();
        navigate("/");
      } else {
        notification.error({
          message: "Passwords do not match or Wrong ID card",
          description: "Please re-enter your information.",
          duration: 2,
        });
      }
    } catch (error) {
      notification.error({
        message: "Signup Failed",
        description: error.message,
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getAdmin();
  }, []);
  return (
    <article className="flex items-center justify-center h-screen login-bg">
      <form
        action="/AdminList"
        method="post"
        className="max-w-full p-10 mx-auto full-border bg-blur login-container"
        onSubmit={handSignUp}
      >
        <div className="mb-4 bg-b">
          <h3 className="p-5 mb-4 text-4xl font-bold text-center text-white rounded-full dark:text-white">
            Welcome to Sign up!
          </h3>
          <div className="flex items-end justify-between ">
          <label
            htmlFor="name"
            className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
          >
            Enter new name
          </label>
          <input 
          className="w-32 mb-2 bg-gray-100 rounded-lg"
            ref={idNumber}
            type="text"
            id="name"
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "ID Card")}
            placeholder="ID Card"
            required
            />
          </div>
          <input
            ref={name}
            type="text"
            id="name"
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "my name is")}
            className="bg-gray-50 border mb-4 border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="my name is"
            required
          />
          <label
            htmlFor="email"
            className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
          >
            Enter an email
          </label>
          <input
            ref={em}
            type="email"
            id="email"
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) => (e.target.placeholder = "@gmail.com")}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="@gmail.com"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
          >
            Enter Password
          </label>
          <div className="flex ">
            <input
              onFocus={(e) => (e.target.placeholder = "")}
              onBlur={(e) => (e.target.placeholder = "EX: sfe#24!fxy&")}
              placeholder="Ex: sfe#24!fxy&"
              ref={pwd}
              type={visible ? "text" : "password"}
              id="password"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <div
              className="absolute p-2 text-2xl font-bold cursor-pointer right-14"
              onClick={handleShowPassword}
            >
              {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
          >
            Confirm Password
          </label>
          <div className="flex">
            <input
              onFocus={(e) => (e.target.placeholder = "")}
              onBlur={(e) => (e.target.placeholder = "EX: sfe#24!fxy&")}
              ref={confPwd}
              type={visible ? "text" : "password"}
              placeholder="Ex: sfe#24!fxy&"
              id="password"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <div
              className="absolute p-2 text-2xl font-bold cursor-pointer right-14"
              onClick={handleShowPassword}
            >
              {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </div>
          </div>
        </div>

        <div className="flex items-start mb-4">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
            />
            <label
              htmlFor="remember"
              className="text-lg font-medium text-white cursor-pointer ms-2 dark:text-gray-300"
            >
              Remember me
            </label>
            <div className="ml-40 text-white">
              <span>Already have account? </span>
              <button
                onClick={() => navigate("/")}
                className="font-bold text-yellow-300 transition-all duration-150 ms hover:text-amber-200 "
              >
                Login
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="text-white bg-amber-700 hover:bg-amber-800 transition-all focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg w-full lg:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {loading ? (
            <>
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 22, color: "white" }}
                    spin
                  />
                }
                size="small"
              />
              <span style={{ marginLeft: 10 }}>Loading...</span>
            </>
          ) : (
            "Sign up"
          )}
        </button>
      </form>
    </article>
  );
};

export default Signup;
