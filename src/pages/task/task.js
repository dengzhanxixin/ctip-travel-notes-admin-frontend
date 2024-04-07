import {
  Button,
  Table,
  Breadcrumb,
  Tag,
  Card,
  Input,
  Select,
  Modal,
  Form,
  message,
  Carousel,
  Typography,
  Space,
  Descriptions,
} from "antd";
import { useEffect, useState } from "react";
import "./task.css";
import axios from "axios";

const { Title, Paragraph, Text } = Typography;

const { Search } = Input;
const { Option } = Select;

function Task(props) {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagenum, setPagenum] = useState(1);
  const [pagesize] = useState(7);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);

  const [auditStatus, setAuditStatus] = useState("");

  // 新增查看详情状态
  const [detailVisible, setDetailVisible] = useState(false);

  // 将状态码转换为文本
  const getStatusText = (statusCode) => {
    switch (statusCode) {
      case 0:
        return "待审核";
      case 1:
        return "审核通过";
      case 2:
        return "被驳回";
      case 3:
        return "已删除";
      default:
        return "未知状态";
    }
  };

  // 页面改变处理
  const handlePageChange = (page) => {
    setPagenum(page);
  };

  // 更新搜索文本时，只更新状态，不执行过滤
  const onSearch = (value) => {
    setSearchText(value);
  };

  // 更新状态筛选时，只更新状态，不执行过滤
  const onStatusChange = (value) => {
    setFilterStatus(value);
  };

  // 统一的数据过滤逻辑
  const filterData = () => {
    const lowercasedValue = searchText.toLowerCase();
    const filtered = dataSource.filter((item) => {
      // 检查搜索文本是否匹配
      const searchTextMatch =
        item.user.toLowerCase().includes(lowercasedValue) ||
        item.title.toLowerCase().includes(lowercasedValue);

      // 如果未选择状态，或状态匹配，则返回true
      const statusMatch = !filterStatus || item.status === filterStatus;

      return searchTextMatch && statusMatch;
    });

    setFilteredData(filtered);
    setPagenum(1); // 重置到第一页
  };

  useEffect(() => {
    // 处理查看详情操作
    const handleViewDetails = (record) => {
      setViewDetailRecord(record); // 保存当前选中的游记信息
      setDetailVisible(true); // 显示详情模态框
    };

    // 处理删除操作
    const handleDelete = (record) => {
      Modal.confirm({
        title: "确认删除",
        content: "您确定要删除这条游记吗？此操作不可撤销。",
        onOk: async () => {
          try {
            console.log("选中要删除的游记的id", record.id);
            // 发送删除请求到后端
            const response = await fetch(
              `http://localhost:8080/delete-travel/${record.id}`,
              {
                method: "DELETE",
              }
            );
            const result = await response.json();

            if (result.success) {
              message.success(result.message);
              // 重新获取数据列表
              fetchTravelData();
            } else {
              message.error(result.message);
            }
          } catch (error) {
            console.error("删除失败:", error);
            message.error("删除操作失败");
          }
        },
      });
    };
    const fetchTravelData = async () => {
      try {
        const response = await fetch("http://localhost:8080/all-travel-data");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (result.success) {
          console.log("后端返回的游记信息数据", result.data);
          const formattedData = result.data.map((item, index) => ({
            key: index,
            id: item.id,
            title: item.title,
            user: item.user.nickname, // 假设用户名称位于 user 对象的 name 字段
            traffic: item.traffic,
            img: item.img_Intrinsic,
            imgs: item.imgs,
            lastEditTime: item.summary.publishDisplayTime,
            status: getStatusText(item.isChecked),
            summary: item.summary,
          }));
          setDataSource(formattedData);
          setFilteredData(formattedData);
          setTotal(formattedData.length);
        }
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }
    };

    fetchTravelData();
    // 获取用户角色
    const userRole = sessionStorage.getItem("role");
    // 定义 columns
    setColumns([
      {
        title: "序号",
        dataIndex: "index",
        key: "index",
        align: "center",
        // 使用 render 方法来计算每行的序号
        render: (text, record, index) => (pagenum - 1) * pagesize + index + 1,
      },
      {
        title: "游记ID",
        dataIndex: "id",
        key: "id",
        align: "center",
      },
      {
        title: "标题",
        dataIndex: "title",
        key: "title",
        align: "center",
      },
      {
        title: "作者",
        dataIndex: "user",
        key: "user",
        align: "center",
      },
      {
        title: "主图片",
        dataIndex: "img",
        key: "img",
        align: "center",
        render: (text) => (
          <img
            src={text}
            alt="main"
            style={{ width: "50px", height: "auto" }}
          />
        ),
      },
      {
        title: "当前状态",
        dataIndex: "status",
        key: "status",
        align: "center",
        render: (text) => {
          let color =
            text === "审核通过"
              ? "green"
              : text === "待审核"
              ? "geekblue"
              : "volcano";
          return <Tag color={color}>{text}</Tag>;
        },
      },
      {
        title: "最后修改时间",
        dataIndex: "lastEditTime",
        key: "lastEditTime",
        align: "center",
        // render: (text) => new Date(text).toLocaleString(),
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        render: (text, record) => (
          <span>
            <Button onClick={() => handleViewDetails(record)}>查看详情</Button>
            {userRole === "root_admin" && (
              <Button
                onClick={() => handleDelete(record)}
                style={{ marginLeft: 8 }}
              >
                删除
              </Button>
            )}
          </span>
        ),
      },
    ]);
  }, [pagenum, pagesize]);

  // 过滤数据
  useEffect(() => {
    filterData();
  }, [searchText, filterStatus]); // 当搜索文本或筛选状态更改时过滤数据

  const [viewDetailRecord, setViewDetailRecord] = useState(null);

  // 新状态：选中行的 keys 和模态窗口的显示状态
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [form] = Form.useForm();

  // 处理行选择变化
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  // 打开模态窗口
  const handleEdit = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("请至少选择一条记录！");
      return;
    }
    const records = dataSource.filter((record) =>
      selectedRowKeys.includes(record.key)
    );
    setSelectedRecords(records);
    setCurrentRecordIndex(0); // 初始化索引
    setIsModalVisible(true);
  };

  // 审核表单的状态选择和驳回理由输入
  const auditForm = (
    <Form form={form} layout="vertical">
      <Form.Item
        name="status"
        label="审核状态"
        rules={[{ required: true, message: "请选择审核状态" }]}
      >
        <Select
          placeholder="选择审核状态"
          onChange={(value) => setAuditStatus(value)}
        >
          <Option value="1">审核通过</Option>
          <Option value="2">驳回</Option>
        </Select>
      </Form.Item>
      {auditStatus === "2" && (
        <Form.Item
          name="reason"
          label="驳回理由"
          rules={[{ required: true, message: "请输入驳回理由" }]}
        >
          <Input.TextArea placeholder="请填写驳回理由" />
        </Form.Item>
      )}
    </Form>
  );

  // 提交审核结果的处理函数
  const submitAudit = async () => {
    try {
      const values = await form.validateFields();
      const { status, reason } = values;

      // 这里替换成您的提交逻辑和API调用
      console.log(`审核状态: ${status}, 驳回理由: ${reason}`);
      const auditData = {
        id: viewDetailRecord
          ? viewDetailRecord.id
          : selectedRecords[currentRecordIndex].id,
        isChecked: status, // 1为通过，2为驳回
        reason: status === "2" ? reason : undefined, // 如果是驳回，添加驳回理由
      };

      // 发送请求到后端进行审核操作
      await axios.post("http://localhost:8080/audit-travel", auditData);

      message.success("审核操作已提交");

      // 关闭模态框并清除表单
      setIsModalVisible(false);
      form.resetFields();
    } catch (errorInfo) {
      console.error("提交失败:", errorInfo);
    }
  };

  // 关闭模态窗口并重置表单
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 渲染单篇游记详情的模态框内容
  const renderDetailModalContent = () => {
    if (!viewDetailRecord) return null;

    const { title, imgs, user, id, lastEditTime, status, summary } =
      viewDetailRecord;
    const cleanContent = summary.content.replace(
      /<ctag[^>]*>(.*?)<\/ctag>|<poi[^>]*>(.*?)<\/poi>/g,
      ""
    );

    return (
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Title level={2}>{title}</Title>
        <Carousel autoplay>
          {imgs.map((url, index) => (
            <div key={index}>
              <img
                src={url}
                alt={`游记图片 ${index + 1}`}
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </Carousel>
        <Paragraph>{cleanContent}</Paragraph>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{id}</Descriptions.Item>
          <Descriptions.Item label="用户">{user}</Descriptions.Item>
          <Descriptions.Item label="编辑时间">{lastEditTime}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={status === "审核通过" ? "green" : "volcano"}>
              {status}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Space>
    );
  };
  // 在Modal的内容中使用Carousel来展示游记的图片
  const renderModalContent = () => {
    if (selectedRecords.length === 0) {
      return null;
    }

    const record = selectedRecords[currentRecordIndex];
    const cleanContent = record.summary.content.replace(
      /<ctag[^>]*>(.*?)<\/ctag>|<poi[^>]*>(.*?)<\/poi>/g,
      ""
    );

    return (
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Title level={2}>{record.title}</Title>
        <Carousel autoplay>
          {record.imgs.map((url, index) => (
            <div key={index}>
              <img
                src={url}
                alt={`游记图片 ${index + 1}`}
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </Carousel>
        <Typography>
          <Title level={4}>游记内容</Title>
          <Paragraph>{cleanContent}</Paragraph>
        </Typography>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{record.id}</Descriptions.Item>
          <Descriptions.Item label="用户">{record.user}</Descriptions.Item>
          <Descriptions.Item label="编辑时间">
            {record.lastEditTime}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={record.status === "审核通过" ? "green" : "volcano"}>
              {record.status}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Space>
    );
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
      <Card style={{ boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="搜索用户名ID或游记标题"
            onSearch={onSearch}
            style={{ width: 200, marginRight: 8 }}
          />
          <Select
            placeholder="选择状态"
            style={{ width: 120 }}
            onChange={onStatusChange}
            allowClear
          >
            <Option value="">全部</Option>
            <Option value="审核通过">审核通过</Option>
            <Option value="待审核">待审核</Option>
            <Option value="被驳回">被驳回</Option>
          </Select>
          <Button onClick={handleEdit} disabled={selectedRowKeys.length === 0}>
            批量编辑
          </Button>
          <Modal
            title="游记详情"
            visible={isModalVisible}
            onOk={submitAudit}
            onCancel={handleCancel}
            width={800}
            footer={[
              <Button
                key="back"
                onClick={() =>
                  setCurrentRecordIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={currentRecordIndex === 0}
              >
                上一个
              </Button>,
              <Button key="submit" type="primary" onClick={submitAudit}>
                确认审核
              </Button>,
              <Button
                key="forward"
                onClick={() =>
                  setCurrentRecordIndex((prev) =>
                    Math.min(selectedRecords.length - 1, prev + 1)
                  )
                }
                disabled={currentRecordIndex === selectedRecords.length - 1}
              >
                下一个
              </Button>,
            ]}
          >
            {renderModalContent()}
            {auditForm}
          </Modal>
          {/* 单篇游记详情模态框 */}
          <Modal
            title="游记详情"
            visible={detailVisible}
            width={800}
            onCancel={() => setDetailVisible(false)}
            footer={[
              <Button key="submit" type="primary" onClick={submitAudit}>
                确认审核
              </Button>,
              <Button key="back" onClick={() => setDetailVisible(false)}>
                关闭
              </Button>,
            ]}
          >
            {renderDetailModalContent()}
            {auditForm}
          </Modal>
        </div>
        <Table
          rowKey={(record) => record.key}
          bordered
          dataSource={filteredData.slice(
            (pagenum - 1) * pagesize,
            pagenum * pagesize
          )}
          columns={columns}
          pagination={{
            current: pagenum,
            pageSize: pagesize,
            total: filteredData.length,
            onChange: handlePageChange,
          }}
          rowSelection={rowSelection}
        />
      </Card>
    </div>
  );
}

export default Task;
