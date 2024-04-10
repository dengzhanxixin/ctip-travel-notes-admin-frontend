from flask import Flask, send_file

app = Flask(__name__)

@app.route("/", methods=["GET"])
def get_index_page():
    return send_file('./dist/index.html')

@app.route("/css/<filename>", methods=["GET"])
def get_css_file(filename):
    return send_file(f"./dist/css/{filename}")

@app.route("/js/<filename>", methods=["GET"])
def get_js_file(filename):
    return send_file(f"./dist/js/{filename}")

@app.route("/fonts/<filename>", methods=["GET"])
def get_font_file(filename):
    return send_file(f"./dist/fonts/{filename}")

@app.route("/img/<filename>", methods=["GET"])
def get_image_file(filename):
    return send_file(f"./dist/img/{filename}")

if __name__ == "__main__":
    # 在开发服务器上运行应用。注意：不建议在生产环境中使用这种方式。
    app.run(host="0.0.0.0", port=9100,debug=True)
