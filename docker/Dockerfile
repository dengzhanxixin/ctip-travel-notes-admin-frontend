# 使用nginx的官方镜像作为基础镜像
FROM nginx:alpine

# 删除nginx默认的配置文件和默认的index.html
RUN rm /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

# 将打包好的React应用文件和Nginx配置文件复制到相应目录
COPY build/ /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/

# 暴露80端口
EXPOSE 80

# 启动nginx服务器
CMD ["nginx", "-g", "daemon off;"]
