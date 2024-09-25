from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    data = {
      "kornbot380@hotmail.com": {
        "Davian_Robots": {
          "Motion_system": {
            "PCA9548A.pdf": "PCA9548A.glb"
          }
        }
      }
    }
    return render_template('index2.html', json_data=data)

if __name__ == '__main__':
    app.run(debug=True)
