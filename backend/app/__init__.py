import spacy
from flask import Flask
from flask_cors import CORS
from app.routes import routes  

nlp = spacy.load("en_core_web_sm") 

def create_app():
    app = Flask(__name__)
    CORS(app, resources={
        r"/analyze": {
            "origins": [
                "http://localhost:8080",
                "https://resume-ai-gzed.vercel.app"
            ],
            "methods": ["POST"],
            "allow_headers": ["Content-Type"]
        }
    })
    app.register_blueprint(routes)

    return app
