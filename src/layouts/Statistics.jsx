import React, { useEffect, useState } from "react";
import { Row, Col, Statistic } from "antd";
import axios from "axios";

const Statistics = () => {
  const [book, setBook] = useState([]);
  const [publisher, setPublisher] = useState([]);
  const [transaction, setTransaction] = useState([]);

  async function getBook() {
    const api = "http://127.0.0.1:8000/Books";
    const response = await axios.get(api);
    const { data } = response;
    setBook(data);
  }
  const getPublisher = async () => {
    const api = "http://127.0.0.1:8000/Publishers";
    const response = await axios.get(api);
    const { data } = response;
    setPublisher(data);
  };
  const getTransaction = async () => {
    const api = "http://127.0.0.1:8000/Transactions";
    const response = await axios.get(api);
    const { data } = response;
    setTransaction(data);
  };
  useEffect(() => {
    getBook();
    getPublisher();
    getTransaction();
  }, []);
  const totalBook = book.reduce((total, book) => total + book.quantity, 0);
  const totalTransaction = transaction.reduce(
    (total, transaction) => total + transaction.quantity,
    0
  );
  const totalPrice = transaction.reduce((total, transactionItem) => {
    const matchedBook = book.find(
      (bookItem) => bookItem.id === transactionItem.bookid
    );
    if (matchedBook) {
      return total + matchedBook.price * transactionItem.quantity;
    }
    return total;
  }, 0);
  const formattedTotalPrice = new Intl.NumberFormat('en-US',{
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(totalPrice);
  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <div
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <Statistic title="Books In Stock" value={totalBook} />
        </div>
      </Col>
      <Col span={6}>
        <div
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <Statistic title="Publishers" value={publisher.length} />
        </div>
      </Col>
      <Col span={6}>
        <div
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <Statistic title="Transactions" value={totalTransaction} />
        </div>
      </Col>
      <Col span={6}>
        <div
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <Statistic title="Sale" value={formattedTotalPrice} />
        </div>
      </Col>
      {/* <Col span={6}>
        <div
          style={{
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <Statistic title="Sale" value={formattedTotalPrice} />
        </div>
      </Col> */}
    </Row>
  );
};

export default Statistics;
