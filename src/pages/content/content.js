import React from "react";
import { withRouter } from "react-router-dom";
import { Button, Card, Carousel, Row, Col } from "antd";
import { useEffect } from "react";
import Cookies from 'js-cookie';

function Content(props) {

  const { history } = props;

  const navigateTo = (path) => {
    history.push(`/home${path}`);
  };

  const images = [
    require("../../assets/back1.jpg"),
    require("../../assets/back2.jpg"),
    require("../../assets/back3.jpeg"),
  ];

  useEffect(() => {
    const isLoggedIn = Cookies.get('isLoggedIn');
    if (!isLoggedIn) {
      console.log('cookies中的isloggedin为false', isLoggedIn)
      // 如果未登录（没有token），重定向到登录页面
      props.history.push("/login");
    }
  })

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
            <Button type="primary" onClick={() => navigateTo("/users")}>
              进入人员管理
            </Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="任务管理" bordered={false}>
            <p>创建、修改和删除任务，确保项目按时完成。</p>
            <Button type="primary" onClick={() => navigateTo("/tasks")}>
              进入任务管理
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default withRouter(Content);
