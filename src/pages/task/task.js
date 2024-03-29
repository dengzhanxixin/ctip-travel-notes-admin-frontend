import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  message,
  Breadcrumb,
  DatePicker,
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import { getTasks, addTask, deleteTask } from "../../service/index";
import "./task.css";
import moment from "moment";
import Cookies from "js-cookie";

function Task(props) {
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [boolean, setBoolean] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);
  const [pagenum, setPagenum] = useState(1);
  const [pagesize] = useState(5);
  const [pagination, setPagination] = useState({});
  const { confirm } = Modal;

  // 假设是在同一个 Task 组件中
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // 显示编辑任务的模态框，并设置当前正在编辑的任务
  const showEditModal = (task) => {
    const editedTask = {
      ...task,
      time: moment(task.time), // 确保 time 是一个 moment 对象
    };
    setEditingTask(editedTask);
    setIsEditModalVisible(true);
  };

  // 更新任务信息
  const handleUpdateTask = async (values) => {
    try {
      console.log(
        "修改任务的时候发给后端的数据",
        editingTask.taskNumber,
        JSON.stringify(values)
      );
      const res = await fetch(
        `http://localhost:8080/tasks/${editingTask.taskNumber}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      if (data.meta.status === 200) {
        message.success("任务更新成功");
        setIsEditModalVisible(false);
        // 重新获取任务列表
        setBoolean(true);
      } else {
        message.error("任务更新失败");
      }
    } catch (error) {
      console.error("更新任务请求失败:", error);
      message.error("更新任务请求失败");
    }
  };

  // 编辑任务的模态框
  const EditTaskModal = ({ visible, onOk, onCancel, task }) => {
    const [form] = Form.useForm();

    useEffect(() => {
      // const isLoggedIn = Cookies.get('isLoggedIn');
      // if (!isLoggedIn) {
      //   console.log('cookies中的isloggedin为false', isLoggedIn)
      //   // 如果未登录（没有token），重定向到登录页面
      //   props.history.push("/login");
      // }
      // 当任务数据变化时重置表单的值
      form.resetFields();
    }, [task, form]);

    return (
      <Modal
        title="编辑任务"
        visible={visible}
        onOk={() => form.submit()}
        onCancel={onCancel}
      >
        <Form
          form={form}
          initialValues={task} // 使用编辑中的任务数据作为初始值
          onFinish={onOk}
        >
          {/* 表单项 */}
          <Form.Item
            name="details"
            label="任务详情"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="time"
            label="任务时间"
            rules={[{ required: true, message: "请选择任务时间!" }]}
          >
            <DatePicker
              showTime
              // 注意这里不是使用 defaultValue，而是确保 initialValues 中的 time 字段已经被转换为 moment 对象
            />
          </Form.Item>
          <Form.Item name="completed" label="是否完成" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  useEffect(() => {
    const showDeleteConfirm = (taskNumber) => {
      confirm({
        title: "确定要删除这个任务吗？",
        content: `任务编号: ${taskNumber}`,
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          deleteTask(taskNumber)
            .then(() => {
              message.success("任务删除成功");
              // 重新获取任务列表
              setBoolean(true);
            })
            .catch((err) => {
              message.error("任务删除失败");
              console.error("删除任务失败:", err);
            });
        },
      });
    };

    setPagination({
      pagenum: pagenum,
      pageSize: pagesize,
      total: total,
      onChange: handlePageChange,
    });
    if (boolean) {
      const queryInfo = { pagenum: pagenum, pagesize: pagesize };
      getTasks(queryInfo).then((res) => {
        console.log(res);
        setDataSource(res.data.tasks);
        setTotal(res.data.total);
        setColumns([
          {
            title: "任务编号",
            dataIndex: "taskNumber",
            key: "taskNumber",
          },
          {
            title: "任务详情",
            dataIndex: "details",
            key: "details",
          },
          {
            title: "任务时间",
            dataIndex: "time",
            key: "time",
          },
          {
            title: "任务是否完成",
            dataIndex: "completed",
            key: "completed",
            render: (completed) => (completed ? "是" : "否"),
          },
          {
            title: "操作",
            key: "action",
            render: (_, record) => (
              <>
                <Button type="link" onClick={() => showEditModal(record)}>
                  编辑
                </Button>
                <Button
                  type="danger"
                  onClick={() => showDeleteConfirm(record.taskNumber)}
                  style={{ marginLeft: 8 }}
                >
                  删除
                </Button>
              </>
            ),
          },
        ]);
      });
    }
    setBoolean(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boolean, pagenum, pagesize, total]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      addTask(values)
        .then((res) => {
          if (res.meta.status === 201) {
            message.info("添加任务成功");
            setIsModalVisible(false);
            // 重置表单字段
            form.resetFields();
            // 无需手动设置 setBoolean(true) 来触发 useEffect
            // 直接调用 getTasks 更新任务列表
            const queryInfo = { pagenum: pagenum, pagesize: pagesize };
            getTasks(queryInfo).then((res) => {
              setDataSource(res.data.tasks);
              setTotal(res.data.total);
              // 由于已经成功获取了最新数据，此时不需要再次触发 useEffect
              // 因此这里不再需要 setBoolean(false)
            });
          } else {
            message.info("添加任务失败");
            setIsModalVisible(false);
          }
        })
        .catch((err) => {
          // 处理请求失败的情况
          console.error("添加任务请求失败:", err);
          message.error("添加任务请求失败");
          setIsModalVisible(false);
        });
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
          <Breadcrumb.Item>任务管理</Breadcrumb.Item>
          <Breadcrumb.Item>任务列表</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div>
        <Button type="primary" onClick={showModal} className="taskButton">
          添加任务
        </Button>
        {isModalVisible && (
          <Modal
            title="添加任务"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form
              form={form}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              autoComplete="off"
            >
              <Form.Item
                label="任务详情"
                name="details"
                rules={[{ required: true, message: "请输入任务详情!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="任务时间"
                name="time"
                rules={[{ required: true, message: "请选择任务时间!" }]}
              >
                <DatePicker showTime />
              </Form.Item>
              <Form.Item
                label="任务是否完成"
                name="completed"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Form>
          </Modal>
        )}
      </div>
      <Table
        rowKey={(record, index) => index} // 测试
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
      ></Table>
      <EditTaskModal
        visible={isEditModalVisible}
        onOk={(values) => {
          handleUpdateTask(values);
          setIsEditModalVisible(false);
        }}
        onCancel={() => setIsEditModalVisible(false)}
        task={editingTask}
      />
    </div>
  );
}

export default Task;
