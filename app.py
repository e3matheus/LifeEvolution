import os
import json
import uuid
from flask import Flask, render_template, request, jsonify
from game_of_life import GameOfLife3D

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "a secret key"

@app.route('/')
def index():
    config_id = request.args.get('config')
    initial_board = None
    if config_id:
        with open(f'configurations/{config_id}.json', 'r') as f:
            initial_board = json.load(f)
    return render_template('index.html', initial_board=initial_board)

@app.route('/next_generation', methods=['POST'])
def next_generation():
    data = request.json
    board = data['board']
    game = GameOfLife3D(board)
    next_gen = game.next_generation()
    return jsonify({'board': next_gen})

@app.route('/save_configuration', methods=['POST'])
def save_configuration():
    data = request.json
    board = data['board']
    config_id = str(uuid.uuid4())
    os.makedirs('configurations', exist_ok=True)
    with open(f'configurations/{config_id}.json', 'w') as f:
        json.dump(board, f)
    return jsonify({'success': True, 'config_id': config_id})

@app.route('/configurations')
def configurations():
    config_files = os.listdir('configurations')
    configs = []
    for file in config_files:
        with open(f'configurations/{file}', 'r') as f:
            config = json.load(f)
        configs.append({'id': file.split('.')[0], 'board': config})
    return render_template('configurations.html', configs=configs)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
