import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Button, Card, Carousel, Row, Col } from "antd";

function Content(props) {
  // 轮播图图片数组
  const images = [
    require("../../assets/back1.png"),
    require("../../assets/back2.png"),
    require("../../assets/back3.png"),
    require("../../assets/back4.png"),
  ];

  useEffect(() => {
    // 检查用户是否已登录，如果未登录则重定向到登录页面
    const userRole = sessionStorage.getItem("role");
    if (!userRole) {
      // 未登录，重定向到登录页面
      props.history.push("/login");
    }
  }, []);
  

  return (
    <div style={{ margin: "20px" }}>
      {/* 轮播图 */}
      <Carousel autoplay style={{ width: "100%", marginBottom: "10px" }}>
        {images.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`Slide ${index}`}
              style={{
                width: "100%", 
                height: "250px", 
                objectFit: "cover", // 覆盖图片以填充整个容器
                display: "block", 
              }}
            />
          </div>
        ))}
      </Carousel>

      {/* 权限管理系统介绍 */}
      <Row gutter={16} style={{ marginBottom: "10px" }}>
        <Col span={24}>
          <Card title="权限管理系统">
            <p>
              权限管理系统可以帮助高效地管理权限和维护系统，包括权限分配、进度跟踪、团队协作等功能。
            </p>
          </Card>
        </Col>
      </Row>

      {/* 导航卡片 */}
      <Row gutter={16}>
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
