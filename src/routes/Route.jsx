import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import SideBar from "../layouts/SideBar";
import Dashboard from "../layouts/Dashboard";
import Book from "../layouts/Book";
import Category from "../layouts/Category";
import TechnologyBook from "../Types/TechnologyBook";
import HistoryBook from "../Types/HistoryBook";
import BusinessBook from "../Types/BusinessBook";
import Protected from "../security/Protected";
import Publishers from "../layouts/Publishers";
import Transaction from "../layouts/Transaction";
import TransactionReport from "../Reports/TransactionReport";
import BookReport from "../Reports/BookReport";
import Error404 from "../layouts/Error404";
import SideBarError404 from "../layouts/SideBarError404";
import Author from "../layouts/Author";
import AuthorBook from "../layouts/AuthorBook";

const Route = () => {

  //this useEffect use for reload to default web page
  useEffect(() => {
    const navigationEntity = performance.getEntriesByType("navigation")[0];
    // console.log(navigationEntity)
    if (navigationEntity && navigationEntity.type === "reload") {
      const defaultRoute = "/Layout";

      if (window.location.pathname != defaultRoute) {
        window.location.replace(defaultRoute);
      }
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
      errorElement: <Error404 />,
    },
    {
      path: "/Layout",
      element: (
        <Protected>
          <SideBar />
        </Protected>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: "Book", element: <Book /> },
        { path: "Categories", element: <Category /> },
        { path: "Publisher", element: <Publishers /> },
        { path: "Transaction", element: <Transaction /> },
        { path: "Author", element: <Author /> },
        { path: "AuthorBook", element: <AuthorBook /> },
        { path: "Technology", element: <TechnologyBook /> },
        { path: "History", element: <HistoryBook /> },
        { path: "Business", element: <BusinessBook /> },
        { path: "BookReport", element: <BookReport /> },
        { path: "TransactionReport", element: <TransactionReport /> },
        { path: "*", element: <SideBarError404 /> },
      ],
      errorElement: <SideBarError404 />,
    },
    {
      path: "/Signup",
      element: <Signup />,
    },
    {
      path: "*",
      element: <Error404 />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Route;
