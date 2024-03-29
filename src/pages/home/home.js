import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Image } from "antd";
import { getMenusdata } from "../../service/index";
import { renderRoutes } from "react-router-config";
import "./home.css";

const { Header, Footer, Sider, Content } = Layout;
function Home(props) {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState(["125"]);
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState([]);
  const [statu, setStatu] = useState(false);
  const [item, setItem] = useState([]);

  useEffect(() => {
    if (!statu) {
      getMenusdata().then((res) => {
        if (res.meta.status === 200) {
          const items = res.data.map((item) => {
            return {
              label: item.authName,
              key: item.id,
              path: item.path,
              children: item.children.map((arr) => {
                return { label: arr.authName, key: arr.id, path: arr.path };
              }),
            };
          });
          const rootSubmenuKeys = res.data.map((item) => {
            return item.id.toString();
          });
          setItem(items);
          setRootSubmenuKeys(rootSubmenuKeys);
          setStatu(true);
        } else {
          return this.$message.error(res.meta.msg);
        }
      });
    }
  }, [statu, item]);

  const logOut = () => {
    console.log(props.history);
    props.history.push("/login");
  };
  
  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onClick = (item) => {
    console.log(item);
    console.log(props);
    if (item.key === "11") {
      props.history.push("/home/content");
    } else if (item.key === "21") {
      props.history.push("/home/user");
    } else if (item.key === "31") {
      props.history.push("/home/task");
    }

  };

  return (
    <div>
      <Layout className="homeBodyBox">
        <Header className="homeHeader">
          <Image className="homeImage" src={require("../../assets/1.jpeg")} />
          <span className="homeSpanTitle">携程前端训练营-审核管理系统</span>
          <Button onClick={logOut} className="homeLogOut" type="primary">
            退出
          </Button>
        </Header>
        <Layout>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <Menu
              theme="dark"
              mode="inline"
              items={item}
              defaultOpenKeys={["125"]}
              openKeys={openKeys}
              onOpenChange={onOpenChange}
              onClick={onClick}
            />
          </Sider>
          <Content className="homeContent">
            {renderRoutes(props.route.routes)}
          </Content>
        </Layout>
        <Footer  className="homeFooter">
          Ant Design ©2024 Created by YHR
        </Footer>
      </Layout>
    </div>
  );
}
export default Home;
