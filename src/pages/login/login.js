import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import "./login.css";
import { getLoginData, getRegisterData } from "../../service/index";

function Login(props) {
  const [isLoginView, setIsLoginView] = useState(true); // 新增状态变量控制视图切换

  const onSubmit = (values) => {
    const userData = {
      username: values.username,
      password: values.password,
    };
    if (isLoginView) {
      // 使用封装的接口进行登录
      getLoginData(userData)
        .then((response) => {
          if (response.success) {
            console.log("登录成功，返回的数据", response);
            message.success("登录成功");

            // 存储token
            sessionStorage.setItem("token", response.token);
            // 存储用户信息
            sessionStorage.setItem("user", userData.username);
            // 存储用户角色
            sessionStorage.setItem("role", response.role);

            // 导航到主页
            props.history.push("/home/content");
          } else {
            message.error(response.message);
          }
        })
        .catch((error) => {
          message.error("登录失败，请稍后重试");
        });
    } else {
      // 注册逻辑
      console.log("注册的发送：用户名", values.username);
      console.log("注册的发送，密码", values.password);
      // 使用封装的接口进行注册
      getRegisterData(userData)
        .then((response) => {
          if (response.success) {
            console.log("注册成功，返回的数据", response);
            message.success(response.message); // 使用后端返回的成功消息
            setIsLoginView(true); // 切换回登录视图
          } else {
            message.error(response.message); // 使用后端返回的失败消息，如“用户已存在”
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            message.error(error.response.data.message); // 后端返回的具体错误消息
          } else {
            message.error("注册失败，请稍后重试"); // 网络或其他未知错误
          }
        });
    }
  };

  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <div className="loginBody">
      <div className="loginBox">
        <Form
          initialValues={{
            remember: true,
            username: "admin",
            password: 123456,
          }}
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item>
            <div className="loginTitle">
              <img
                src={require("../../assets/1.jpeg")}
                className="loginImg"
                alt=""
              />
            </div>
          </Form.Item>
          <Form.Item
            label="账号"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          {isLoginView ? (
            <Form.Item>
              <Button type="primary" htmlType="submit">
                登录
              </Button>
              <Button type="link" onClick={toggleView}>
                没有账号？注册
              </Button>
            </Form.Item>
          ) : (
            <Form.Item>
              <Button type="primary" htmlType="submit">
                注册
              </Button>
              <Button type="link" onClick={toggleView}>
                已有账号？登录
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
}

export default Login;
