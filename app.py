import os
from flask import Flask, render_template, request, jsonify
from game_of_life import GameOfLife

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "a secret key"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/next_generation', methods=['POST'])
def next_generation():
    data = request.json
    board = data['board']
    game = GameOfLife(board)
    next_gen = game.next_generation()
    return jsonify({'board': next_gen})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
