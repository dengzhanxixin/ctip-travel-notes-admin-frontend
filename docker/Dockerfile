
WORKDIR /app/frontend
COPY  ./requirement.txt .
COPY ./flaskbackend.py .
RUN python3 -m pip install -r ./requirement.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
COPY ./build ./build
RUN apt-get update -y
RUN apt-get install python3-pip -y

ENTRYPOINT ["python3","flaskbackend.py"] 