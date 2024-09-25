from flask import Flask, request, jsonify
from Exercice import Exercice

app = Flask(__name__)

@app.route('/generatequizz', methods=['POST']) 
def generatequizz():
    data = request.json
    print(data)
    myExo= Exercice(data)
    final_data=myExo.renvois_final_json()
    return final_data

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=8000)