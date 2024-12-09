import { Button, Input, Tooltip, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import TableItems from "../../components/admin/account/table/TableItems";
import BaseUrl from "../../apis/axios";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../services/user.service";
import Overview from "../../components/admin/account/Overview";

export default function User() {
  const dispatch = useDispatch();

  // handle function to block user
  const handleChangeStatusUser = async (id, status) => {
    try {
      let statusUpdate = null;
      if (status == 1) {
        statusUpdate = 0;
      } else {
        statusUpdate = 1;
      }
      const response = await BaseUrl.put(`user/${id}/status/${statusUpdate}`);
      if (response.status == 200) {
        message.success("Thay đổi trạng thái người dùng thành công");
        fetchUsersData();
      }
    } catch (error) {
      message.error("Thay đổi trạng thái người dùng thất bại");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await BaseUrl.delete(`user/${id}`);
      if (response.status == 200) {
        message.success("Xóa người dùng thành công");
        fetchUsersData();
      }
    } catch (error) {
      message.error("Xóa người dùng thất bại");
    }
  };

  // columns of table
  const column = [
    {
      title: "STT",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên người dùng",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) =>
        record.status == 1 ? "Đang hoạt động" : "Ngừng hoạt động",
    },
    {
      title: "Chức năng",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Danh sách đơn hàng" color="#2db7f5">
            <Button>
              <EyeOutlined />
            </Button>
          </Tooltip>
          <Tooltip
            title={record.status == 1 ? "Khoá tài khoản" : "Mở khoá"}
            color="#f50"
          >
            <Button
              onClick={() =>
                handleChangeStatusUser(record.user_id, record.status)
              }
            >
              {record.status == 1 ? <LockOutlined /> : <UnlockOutlined />}
            </Button>
          </Tooltip>
          <Tooltip title="Xoá tài khoản" color="red">
            <Button danger onClick={() => handleDeleteUser(record.user_id)}>
              <DeleteOutlined />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const fetchUsersData = () => {
    dispatch(getAllUsers());
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const users = useSelector((state) => state.user.data);
  return (
    <>
      <div className="flex flex-col gap-4">
        <Overview
          totalAccount={users.length}
          activeAccount={users.filter((user) => user.status == 1).length}
          inactiveAccount={users.filter((user) => user.status == 0).length}
        />
        <div className="bg-white">
          <div className=" p-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Quản lí tài khoản</h1>
            <div className="flex items-center gap-2">
              <Input placeholder="Tìm kiếm tài khoản" />
            </div>
          </div>
          <div>
            <TableItems column={column} dataSources={users} />
          </div>
        </div>
      </div>
    </>
  );
}
