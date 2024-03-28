import {request}  from './requir'
// import qs from 'qs'

export function getHomeMultidata (data) {        //进行封装
    console.log('登陆时发给后端的数据', data)
    return request({
      url: '/login',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(data),
    });
  }
  

export function getMenusdata() {
  return request({
    url: "/menus",
    method: "get",
  });
}

// export function getUsers(params) {
//   return request({
//     url: "/people",
//     method: "get",
//     params
//   });
// }

export function getAddUsers(data) {
  return request({
    url: "/people",
    method: "post",
    data
  });
}

export function getTasks(params) {
  return request({
    url: "/tasks",
    method: "get",
    params
  });
}

export function addTask(data) {
  return request({
    url: "/tasks",
    method: "post",
    data
  });
}

export function deleteTask(taskNumber) {
  return request({
    url: `/tasks/${taskNumber}`,
    method: 'delete',
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
