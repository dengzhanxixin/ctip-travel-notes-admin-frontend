
# WORKDIR /app/frontend
# COPY  ./requirement.txt .
# COPY ./flaskbackend.py .
# RUN python3 -m pip install -r ./requirement.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
# COPY ./build ./build
# RUN apt-get update -y
# RUN apt-get install python3-pip -y

# ENTRYPOINT ["python3","flaskbackend.py"] 

# 使用nginx的官方镜像作为基础镜像
FROM nginx:alpine

# （可选）删除nginx默认的配置文件和默认的index.html
# 这一步不是必须的，因为我们会覆盖默认文件
RUN rm /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

# 将打包好的React应用文件复制到nginx的工作目录
COPY build/ /usr/share/nginx/html

# （可选）如果您有自定义的nginx配置文件，复制到容器中
# COPY path/to/your/custom/nginx.conf /etc/nginx/nginx.conf

# 暴露80端口
EXPOSE 80

# 启动nginx服务器
CMD ["nginx", "-g", "daemon off;"]
