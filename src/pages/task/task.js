import {
  Button,
  Table,
  Breadcrumb,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import "./task.css";

function Task(props) {
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [boolean, setBoolean] = useState(true);
  const [total] = useState(0);
  const [pagenum, setPagenum] = useState(1);
  const [pagesize] = useState(7);
  const [pagination, setPagination] = useState({});

  const fetchTravelData = async () => {
    try {
      // 发起 GET 请求到后端接口
      const response = await fetch("http://localhost:8080/all-travel-data");

      if (!response.ok) {
        // 如果响应状态码不是 2xx，抛出错误
        throw new Error("Network response was not ok");
      }

      // 解析 JSON 格式的响应体
      const response_data = await response.json();

      // 控制台打印获取到的数据
      console.log("后端返回的所有数据", response_data, typeof response_data);

      // 提取所需信息并构造新的数据源
      const extractedData1 = response_data.data.map((item, index) => ({
        key: index, // 为表格的每行数据添加一个唯一key
        id: item.id,
        nickname: item.user.nickname,
        title: item.title,
        mainImageUrl: item.summary.coverImage.url,
        lastEditTime: item.summary.publishDisplayTime,
        status:
          item.isChecked === 2
            ? "审核通过"
            : item.isChecked === 1
            ? "待审核"
            : item.isChecked === 0
            ? "被驳回"
            : "未知状态",
      }));

      setDataSource(extractedData1);
      console.log("主表格中提取的数据", extractedData1);
    } catch (error) {
      // 捕获并打印出任何在请求过程中发生的错误
      console.error("Failed to fetch travel data:", error);
    }
  };

  useEffect(() => {
    // 调用函数
    fetchTravelData();

    const showTravelDetail = (record) => {
      console.log(record);
    };

    setPagination({
      pagenum: pagenum,
      pageSize: pagesize,
      total: total,
      onChange: handlePageChange,
    });
    if (boolean) {
      setColumns([
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          align: "center", // 居中
          render: (text, record, index) => (pagenum - 1) * pagesize + index + 1,
        },
        {
          title: "游记ID",
          dataIndex: "id",
          key: "id",
          align: "center", // 居中
        },
        {
          title: "作者",
          dataIndex: "nickname",
          key: "nickname",
          align: "center", // 居中
        },
        {
          title: "标题",
          dataIndex: "title",
          key: "title",
          align: "center", // 居中
        },
        {
          title: "主图片",
          dataIndex: "mainImageUrl",
          key: "mainImage",
          align: "center", // 居中
          render: (text) => (
            <img
              src={text}
              alt="main"
              style={{ width: "50px", height: "auto" }}
            />
          ),
        },
        {
          title: "最后编辑时间",
          key: "lastEditTime",
          align: "center", // 居中
          render: (_, record) => record.lastEditTime,
        },
        {
          title: "当前状态",
          dataIndex: "status",
          key: "status",
          align: "center", // 居中
          render: (text, record) => {
            let color;
            switch (record.status) {
              case "审核通过":
                color = "green";
                break;
              case "待审核":
                color = "geekblue";
                break;
              case "被驳回":
                color = "volcano";
                break;
              default:
                color = "default";
            }
            // 使用 div 包裹 Tag 来进一步确保内容居中
            return (
              <div style={{ textAlign: "center" }}>
                <Tag color={color}>{text}</Tag>
              </div>
            );
          },
        },
        {
          title: "操作",
          key: "action",
          align: "center", // 居中
          render: (_, record) => (
            <Button onClick={() => showTravelDetail(record)}>查看详情</Button>
          ),
        },
      ]);
    }
    setBoolean(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boolean, pagenum, pagesize, total]);

  const handlePageChange = (pagenum) => {
    console.log(pagenum);
    setPagenum(pagenum);
    setBoolean(true);
  };

  return (
    <div className="taskBody">
      <div className="taskBread">
        <Breadcrumb>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>游记管理</Breadcrumb.Item>
          <Breadcrumb.Item>游记列表</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Table
        rowKey={(record, index) => index}
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
      ></Table>
    </div>
  );
}

export default Task;
