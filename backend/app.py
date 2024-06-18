from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import date
import model

app = Flask(__name__)
CORS(app)

m = model.Model()

@app.route('/', methods=['GET'])
def index():
    return "<center><h2>Stock prediction API home. Please use <br><code><span style='color:black;'> /predict?symbol={symbol}&period={period} </span></code> <br> to get the prediction.</h2></center>"

@app.route('/predict', methods=['GET'])
def predict():
    symbol = request.args.get('symbol').upper()
    if symbol is not None:
        symbol = symbol.upper()
    else:
        return jsonify({'error': 'Symbol parameter is missing'}), 400

    period = int(request.args.get('period'))

    TODAY = date.today().strftime("%Y-%m-%d")
    data = m.load_data(symbol, TODAY)
    if(data.empty):
        return jsonify([])

    if m.train(data, symbol):
        m.save_model(f'{symbol}.pkl')

    forecast = m.predict(period)
    forecast_list = forecast_list = [[x[0].strftime('%Y-%m-%d'), x[1]] for x in forecast.values.tolist()]
    # print(forecast_list)
    return jsonify(forecast_list)

if __name__ == '__main__':
    app.run(debug=True)