import { request } from "./requir";

// 发送登录请求并获取登录数据
export function getLoginData(data) {
  // 进行封装
  console.log("登陆时发给后端的数据", data);
  return request({
    url: "/login", 
    method: "post", 
    headers: { "Content-Type": "application/json" }, // 请求头设置为 JSON 格式
    data: JSON.stringify(data), // 请求体数据转换为 JSON 字符串
  });
}

// 发送注册请求并获取注册数据
export function getRegisterData(data) {
  console.log("注册时发给后端的数据", data);
  return request({
    url: "/register",
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify(data),
  });
}

// 获取菜单数据
export function getMenusdata() {
  return request({
    url: "/menus",
    method: "get",
  });
}

// 添加用户信息
export function getAddUsers(data) {
  return request({
    url: "/people",
    method: "post",
    data,
  });
}

// 获取任务列表
export function getTasks(params) {
  return request({
    url: "/tasks",
    method: "get",
    params,
  });
}

// 添加任务
export function addTask(data) {
  return request({
    url: "/tasks",
    method: "post",
    data,
  });
}

// 删除任务
export function deleteTask(taskNumber) {
  return request({
    url: `/tasks/${taskNumber}`,
    method: "delete",
  });
}

// 获取所有旅行数据
export function fetchTravelData() {
  return request({
    url: "/all-travel-data",
    method: "get",
  });
}

// 删除旅行数据
export function deleteTravel(travelId) {
  return request({
    url: `/delete-travel/${travelId}`,
    method: "delete",
  });
}

// 审核旅行数据
export function auditTravel(auditData) {
  return request({
    url: "/audit-travel",
    method: "post",
    data: auditData,
  });
}

// 获取用户列表
export const getUsers = async (params) => {
  const response = await request({
    url: "/people",
    method: "get",
    params, // 传递给后端的查询参数，例如分页信息
  });
  return response.data;
};

// 给用户分配角色
export const assignRoleToUser = async (userId, role) => {
  const response = await request({
    url: "/assign-role",
    method: "post",
    data: { userId, role },
  });
  return response.data;
};
