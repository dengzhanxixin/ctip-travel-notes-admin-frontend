import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Breadcrumb,
  Spin,
  notification,
} from "antd";
import { getUsers, assignRoleToUser } from "../../service/index";
import "./user.css";

const { Option } = Select;

// 定义角色常量，用于下拉选择框
const ROLES = {
  SUPER_ADMIN: "super_admin",
  USER: "user",
};

const userRole = sessionStorage.getItem("role"); // 获取当前登录用户的角色

// 角色分配模态框组件
function RoleAssignModal({ visible, onOk, onCancel }) {
  const [form] = Form.useForm(); // 使用Form.useForm创建表单实例
  return (
    <Modal
      title="分配角色"
      visible={visible}
      onOk={() => onOk(form)}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="role"
          label="角色"
          rules={[{ required: true, message: "请选择一个角色" }]}
        >
          <Select>
            <Option value={ROLES.SUPER_ADMIN}>最高权限管理员</Option>
            <Option value={ROLES.USER}>普通管理员</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

// 用户管理组件
function User(props) {
  const [users, setUsers] = useState([]); // 用户列表状态
  const [loading, setLoading] = useState(false); // 加载状态
  const [isModalVisible, setIsModalVisible] = useState(false); // 控制角色分配模态框的可见性
  const [currentUserId, setCurrentUserId] = useState(null); // 当前操作的用户ID

  useEffect(() => {
    // 检查用户是否已登录，如果未登录则重定向到登录页面
    const userRole = sessionStorage.getItem("role");
    if (!userRole) {
      // 未登录，重定向到登录页面
      props.history.push("/login");
    }
  }, []);

  // 组件挂载时获取用户列表
  useEffect(() => {
    fetchUsers();
  }, []);

  // 获取用户列表的函数
  const fetchUsers = async () => {
    setLoading(true); // 开始加载
    try {
      const data = await getUsers();
      setUsers(data); // 假设后端返回的格式是{ users: [] }
    } catch (error) {
      notification.error({ message: "获取用户列表失败" }); // 出错时的反馈
    } finally {
      setLoading(false); // 结束加载
    }
  };

  // 处理角色分配的函数
  const handleRoleAssign = async (form) => {
    if (userRole !== "super_admin") {
      // 如果当前用户不是 super_admin，显示权限不足的提示
      notification.error({
        message: "权限不足",
        description: "只有超级管理员才能执行此操作",
      });
    } else {
      try {
        const values = await form.validateFields(); // 验证并获取表单值
        await assignRoleToUser(currentUserId, values.role); // 调用角色分配API
        notification.success({ message: "角色分配成功" }); // 分配成功的反馈
        setIsModalVisible(false); // 关闭模态框
        fetchUsers(); // 重新获取用户列表
      } catch (error) {
        notification.error({ message: "角色分配失败" }); // 分配失败的反馈
      }
    }
  };

  // 定义表格列的配置
  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      align: "center",
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role) =>
        role === "super_admin" ? "最高权限管理员" : "普通管理员",
    },
    { title: "ID", dataIndex: "id", key: "id", align: "center" },
    {
      title: "操作",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            setCurrentUserId(record.id);
            setIsModalVisible(true);
          }}
        >
          分配角色
        </Button>
      ),
    },
  ];

  return (
    <div className="userBody">
      <Breadcrumb>
        <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item>用户管理</Breadcrumb.Item>
      </Breadcrumb>
      <Spin spinning={loading}>
        {" "}
        {/* 显示加载指示器 */}
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          className="custom-table" // 应用自定义样式类
          bordered
          style={{ marginTop: 24 }}
        />
      </Spin>
      <RoleAssignModal
        visible={isModalVisible}
        onOk={handleRoleAssign}
        onCancel={() => setIsModalVisible(false)}
      />
    </div>
  );
}

export default User;
