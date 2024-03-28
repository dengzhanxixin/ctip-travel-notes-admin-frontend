import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { getHomeMultidata } from "../../service/index";
import axios from "axios";
import "./login.css";
import Cookies from 'js-cookie';

function Login(props) {
  const [isLoginView, setIsLoginView] = useState(true); // 新增状态变量控制视图切换

  

  const onSubmit = (values) => {
    if (isLoginView) {
      // 登录逻辑
      getHomeMultidata(values).then((res) => {
        console.log("响应对象:", res);
        if (res.meta.status === 200) {
          message.info("登录成功");
          // 登录成功
          sessionStorage.setItem("isLoggedIn", "true");
          console.log("登陆成功", res);

          window.sessionStorage.setItem("token", res.token);
          window.sessionStorage.setItem("user", res.meta.role);
          // 设置token有效期为1小时（3600000毫秒）
          const timeout = 3600000; // 1小时
          // 在设置token的同时，设置一个定时器，到时间后清除token
          setTimeout(() => {
            localStorage.removeItem("token");
          }, timeout);
          Cookies.set('isLoggedIn', 'true', { expires: 1, path: '/' }); // Cookie有效期1天
          props.history.push("/home/content");
        } else {
          message.info("登录失败");
        }
      });
    } else {
      // 注册逻辑
      console.log("注册的发送：用户名", values.username);
      console.log("注册的发送，密码", values.password);
      axios
        .post("http://localhost:8080/register", {
          username: values.username,
          password: values.password,
        })
        .then((response) => {
          console.log("注册的返回", response);
          if (response.data.success) {
            message.success("注册成功，请登录");
            setIsLoginView(true); // 切换回登录视图
          } else {
            message.error("注册失败");
          }
        })
        .catch(() => {
          message.error("注册失败，请稍后重试");
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
