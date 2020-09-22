import operator
from flask import Flask, request, render_template, jsonify

app = Flask(__name__)

ops = {
    '+' : operator.add,
    '-' : operator.sub,
    '*' : operator.mul,
    '/' : operator.truediv,
    '%' : operator.mod,
    }

class database:
    data = []
    def __init__(self):
        self.data = []

    def save(self, entry):
        self.data.append(entry)
    
db = database()

@app.route("/", methods=["GET"])
def mainpage():
    return render_template("index.html")

#####===API ROUTES===######
API_V1_prefix = "/api/v1/"

#------------------------------------------------------------------------
@app.route(API_V1_prefix+"create", methods=["POST"])
def process():
    if not request.is_json:
        return "wrong data format", 500

    resp = {}
    data = request.get_json()
    db.save(data)
    answer = calculator(data)
    resp = {"value": answer}
    return jsonify(resp)

def calculator(data):
    operand1= data['operand1']
    operand2= data['operand2']
    oper = data['oper']
    answer = ops[oper](operand1, operand2)
    return answer
#------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
