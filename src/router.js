import Home from "./pages/home/home"
import Login from "./pages/login/login"
import Content from "./pages/content/content"
import User from "./pages/user/user"
import Task from "./pages/task/task"

// 使用react-router-config进行配置
const routes = [
  {
    path: "/login",
    name: "登录",
    component: Login,
  },
  {
    path: "/home",
    name: "首页",
    component: Home,
    routes: [
      {
        path: "/home/content",
        component: Content,
      },
      {
        path: "/home/user",
        component: User
      },
      {
        path: "/home/task",
        component: Task
      },
    ],
  },
  {
    path: "/",
    component: Login,
    exact: true,
  },
]
export default routes
