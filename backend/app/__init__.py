import os
from flask import Flask
from flask_cors import CORS
from app.routes import routes

def create_app():
    app = Flask(__name__)
    
    # Configure CORS for your frontend
    CORS(app, resources={
        r"/*": {
            "origins": [
                "http://localhost:8080",
                "http://localhost:3000",  # Added for React dev server
                "https://resume-ai-rework.vercel.app"
            ],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Set maximum file upload size (10MB)
    app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024
    
    # Validate Groq API key on startup
    if not os.environ.get('GROQ_API_KEY'):
        print("WARNING: GROQ_API_KEY environment variable not set!")
        print("Please set your Groq API key: export GROQ_API_KEY=your_key_here")
        print("Get your free API key at: https://console.groq.com/keys")
    else:
        print("✓ Groq API key found")
    
    # Register routes
    app.register_blueprint(routes)
    
    return app