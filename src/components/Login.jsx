import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification, Spin } from "antd";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const em = useRef();
  const pwd = useRef();
  const [pro, setPro] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  function handleShowPassword() {
    setVisible(!visible);
  }
  async function handleLogin(e) {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const email = em.current.value;
      const password = pwd.current.value;
      const api = "http://127.0.0.1:8000/AdminList";

      const response = await axios.get(api);

      const { data } = response;
      setPro(data);
      let loginSuccess = false;
      const anAdmin = data.find(
        (admin) => admin.email === email && admin.password === password
      );
      const username = anAdmin ? anAdmin.name : null;
      console.log(anAdmin);
      if (anAdmin) {
        loginSuccess = true;
        
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("password", password);
        notification.success({
          message: "Login Successful",
          description: "You have logged in successfully.",
          duration: 3,
        });
        navigate("/Layout");
      }
      if (
        sessionStorage.getItem("email") == email &&
        sessionStorage.getItem("password") == password
      ) {
        navigate("/Layout");
      } else {
        notification.error({
          message: "Login Failed",
          description: "Invalid Email or Password",
          duration: 3,
        });
        setVisible(true);
      }
    } catch (error) {
      notification.error({
        message: "Server Shutdown.  ",
        description: error.message,
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initLogin = async () => {
      try {
        const api = "http://127.0.0.1:8000/AdminList";
        axios.get(api).then((response) => {
          console.log(response);
          const { data } = response;
          setPro(data);
          console.log(data);
        });
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };
    initLogin();
  }, []);

  return (
    <article className="h-screen flex  justify-center items-center login-bg">
      <form
        className="max-w-full mx-auto full-border bg-blur p-20 login-container"
        onSubmit={handleLogin}
      >
        <div className="mb-5 bg-b">
          <h3 className="text-4xl font-bold p-5 dark:text-white  text-white rounded-full text-center mb-5">
            Please Login here!
          </h3>
          <label
            htmlFor="email"
            className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
          >
            Enter your email
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

        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
          >
            Enter password
          </label>
          <div className="flex">
            <input
              onFocus={(e) => (e.target.placeholder = "")}
              onBlur={(e) => (e.target.placeholder = "Ex: sfe#24!fxy&")}
              required
              ref={pwd}
              type={visible ? "text" : "password"}
              placeholder="Ex: sfe#24!fxy&"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <div
              className="p-2 font-bold text-2xl absolute right-20 cursor-pointer"
              onClick={handleShowPassword}
            >
              {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </div>
          </div>
        </div>

        <div className="flex items-start mb-5">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              required
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
            />
            <label
              htmlFor="remember"
              className="ms-2 text-lg font-medium text-white dark:text-gray-300"
            >
              Remember me
            </label>
            <div className="ml-40">
              <button
                onClick={() => navigate("/Signup")}
                className="ms text-lg text-white hover:text-yellow-400 font-bold transition-all duration-150 "
              >
                Create account
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
              <span style={{ marginLeft: 10 }}>Loggin in...</span>
            </>
          ) : (
            "Login "
          )}
        </button>
      </form>
    </article>
  );
};

export default Login;
