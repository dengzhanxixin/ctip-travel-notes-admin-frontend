import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Button, Card, Carousel, Row, Col } from "antd";
import Cookies from 'js-cookie';

/**
 * Content组件显示首页内容，包括轮播图、任务管理系统介绍以及导航卡片。
 * @param {Object} props - React组件属性，包括history对象。
 * @returns {JSX.Element} Content组件的JSX元素。
 */
function Content(props) {
  const { history } = props;

  /**
   * navigateTo函数用于根据指定路径进行路由导航。
   * @param {string} path - 路径字符串。
   */
  const navigateTo = (path) => {
    history.push(`/home${path}`);
  };

  // 轮播图图片数组
  const images = [
    require("../../assets/back1.jpg"),
    require("../../assets/back2.jpg"),
    require("../../assets/back3.jpeg"),
  ];

  useEffect(() => {
    // 检查用户是否已登录，如果未登录则重定向到登录页面

  }, []);

  return (
    <div style={{ margin: "20px" }}>
      {/* 轮播图 */}
      <Carousel autoplay style={{ width: "100%" }}>
        {images.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`Slide ${index}`}
              style={{
                width: "100%", 
                height: "150px", 
                objectFit: "contain", // 容纳图片以显示完整内容
                display: "block", 
              }}
            />
          </div>
        ))}
      </Carousel>

      {/* 任务管理系统介绍 */}
      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Card title="任务管理系统">
            <p>
              任务管理系统可以帮助企业或个人高效地管理任务和项目，包括任务分配、进度跟踪、团队协作等功能。
            </p>
          </Card>
        </Col>
      </Row>

      {/* 导航卡片 */}
      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col span={12}>
          <Card title="人员管理" bordered={false}>
            <p>管理系统内的所有人员信息。</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="游记管理" bordered={false}>
            <p>创建、修改和删除游记。</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default withRouter(Content);
