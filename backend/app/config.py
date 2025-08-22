import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration"""
    DEBUG = False
    TESTING = False
    
    # Flask settings
    SECRET_KEY = os.getenv('FLASK_SECRET_KEY', 'your-default-secret-key')
    
    # CORS settings
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')
    CORS_METHODS = ['POST', 'GET', 'OPTIONS']
    CORS_ALLOW_HEADERS = ['Content-Type']
    
    # File upload settings
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB limit
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

class DevelopmentConfig(Config):
    """Development-specific configuration"""
    DEBUG = True
    CORS_SUPPORTS_CREDENTIALS = True

class ProductionConfig(Config):
    """Production-specific configuration"""
    DEBUG = False
    CORS_ORIGINS = os.getenv('PROD_CORS_ORIGINS', 'https://your-frontend-domain.com').split(',')

# Dictionary to map config names to classes
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}