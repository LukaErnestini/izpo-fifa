from flask import Flask, jsonify
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy

from config import DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME

app = Flask(__name__)
api = Api(app)

# Configure SQLAlchemy
app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class HelloWorld(Resource):
    def get(self):
        return jsonify(message="Hello, World!")

api.add_resource(HelloWorld, "/")

if __name__ == "__main__":
    app.run(debug=True)