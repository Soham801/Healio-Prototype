from flask import Flask
import os

app = Flask(__name__)

# Load secret key from environment
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

@app.route('/')
def home():
    return f"Flask is running! 🔥 Secret Key: {app.config['SECRET_KEY'][:8]}..."

if __name__ == '__main__':
    app.run(debug=True)
