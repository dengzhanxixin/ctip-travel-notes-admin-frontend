import React from "react";
import { withRouter } from "react-router-dom";
import { Button, Card, Carousel, Row, Col, Spin } from "antd";
import "./content.css"; // 引入CSS文件来自定义样式

function Content(props) {
  // 轮播图图片数组
  const images = [
    require("../../assets/back1.png"),
    require("../../assets/back2.png"),
    require("../../assets/back3.png"),
    require("../../assets/back4.png"),
  ];

  return (
    <div className="content-container">
      {/* 轮播图 */}
      <Carousel autoplay className="carousel">
        {images.map((image, index) => (
          <div key={index} className="image-slide">
            <img src={image} alt={`Slide ${index}`} />
          </div>
        ))}
      </Carousel>

      {/* 权限管理系统介绍 */}
      <Row gutter={12} className="card-row">
        <Col span={24}>
          <Card title={<span className="card-title">权限管理系统</span>} className="custom-card">
            <p className="card-content">
              权限管理系统可以帮助高效地管理权限和维护系统，包括权限分配、进度跟踪、团队协作等功能。
            </p>
          </Card>
        </Col>
      </Row>

      {/* 导航卡片 */}
      <Row gutter={12} className="card-row">
        <Col span={12}>
          <Card
            title={<TitleWithBackground>人员管理</TitleWithBackground>}
            bordered={false}
            className="custom-card hoverable"
          >
            <div className="card-content">
              <div className="image-container">
                {/* <img src="/people.png" alt="People" className="fixed-img-size" /> */}
              </div>
              <p>管理系统内的所有人员信息。</p>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={<TitleWithBackground>游记管理</TitleWithBackground>}
            bordered={false}
            className="custom-card hoverable"
          >
            <div className="card-content">
              <div className="image-container">
                {/* <img src="/task.png" alt="Task" className="fixed-img-size" /> */}
              </div>
              <p>创建、修改和删除游记。</p>
            </div>
          </Card>
          
        </Col>
      </Row>
    </div>
  );
}

const TitleWithBackground = ({ children }) => (
  <div className="title-with-background">
    {children}
  </div>
);

export default withRouter(Content);
