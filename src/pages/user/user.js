import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Select, Breadcrumb, message } from "antd";
import { getUsers, assignRoleToUser } from "../../service/index";
import "./user.css";

const { Option } = Select;

function User() {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null); // 新增状态来存储当前用户的角色
  const [form] = Form.useForm();

  useEffect(() => {
    // 调用getUsers获取用户列表
    fetchUsers();

    // 假设在登录时已经将用户角色保存到了localStorage
    const role = sessionStorage.getItem("user");
    setCurrentUserRole(role);
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers(); // 假设返回的数据是{ users: [] }
      console.log("从后端拿到的数据",data)
      setUsers(data);
    } catch (error) {
      message.error("获取用户列表失败");
    }
  };

  const showRoleAssignModal = (userId) => {
    // 在这里检查用户角色
    if (currentUserRole !== "admin") {
      message.error("权限不足，无法分配角色");
      return;
    }
    setCurrentUserId(userId);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        // 调用分配角色的服务函数，这里需要实现assignRoleToUser
        await assignRoleToUser(currentUserId, values.role);
        message.success("角色分配成功");
        setIsModalVisible(false);
        fetchUsers(); // 重新获取用户列表
      } catch (error) {
        message.error("角色分配失败");
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "ID",
      dataIndex: "_id",
      key: "id",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => showRoleAssignModal(record._id)}>分配角色</Button>
      ),
    },
  ];
  

  return (
    <div className="userBody">
      <Breadcrumb>
        <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item>用户管理</Breadcrumb.Item>
      </Breadcrumb>
      <Table dataSource={users} columns={columns} rowKey="_id" />
      <Modal title="分配角色" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select>
              <Option value="admin">Admini</Option>
              <Option value="user">user</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default User;
