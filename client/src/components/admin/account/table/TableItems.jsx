import { Table } from "antd";
import React from "react";

export default function TableItems({ column, dataSources }) {
  return (
    <>
      <Table columns={column} dataSource={dataSources} />
    </>
  );
}
