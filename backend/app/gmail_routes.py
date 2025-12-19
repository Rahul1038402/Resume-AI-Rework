import os
import logging
from flask import Blueprint, request, jsonify
from datetime import datetime
from app.gmail_service import GmailSyncService

logger = logging.getLogger(__name__)

gmail_routes = Blueprint("gmail_routes", __name__)

# Initialize Gmail service
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
gmail_service = GmailSyncService(GROQ_API_KEY)

@gmail_routes.route("/gmail/sync", methods=["POST"])
def sync_gmail():
    """
    Sync job applications from Gmail
    
    Request body:
    {
        "credentials": {...},  // Google OAuth credentials
        "last_sync_time": "ISO datetime string or null",
        "cached_message_ids": ["msg_id_1", "msg_id_2", ...],
        "scan_days": 7  // Optional: How many days to scan (default: 7)
    }
    
    Response:
    {
        "status": "success" | "no_changes" | "error",
        "new_applications": [...],
        "message_ids": [...],
        "checked_count": int,
        "extracted_count": int,
        "updated_credentials": {...}  // Refreshed credentials if needed
    }
    """
    try:
        data = request.get_json()
        
        logger.info(f"Received sync request. Data keys: {data.keys() if data else 'None'}")
        
        if not data or 'credentials' not in data:
            return jsonify({"error": "Gmail credentials required"}), 400
        
        credentials = data['credentials']
        
        # Handle case where credentials might be nested or double-encoded
        if isinstance(credentials, str):
            import json
            try:
                credentials = json.loads(credentials)
                logger.info("Parsed credentials from JSON string")
            except:
                logger.error("Failed to parse credentials string as JSON")
                return jsonify({"error": "Invalid credentials format"}), 400
        
        # Validate credentials structure
        if not isinstance(credentials, dict):
            logger.error(f"Credentials is not a dict: {type(credentials)}")
            return jsonify({"error": f"Credentials must be an object, got {type(credentials).__name__}"}), 400
            
        if 'refresh_token' not in credentials:
            logger.error(f"Missing refresh_token. Available keys: {list(credentials.keys())}")
            return jsonify({"error": "Missing refresh_token in credentials"}), 400
        
        last_sync_time = data.get('last_sync_time')
        cached_message_ids = data.get('cached_message_ids', [])
        scan_days = data.get('scan_days', 7)  # Default to 7 days if not specified
        
        logger.info(f"Starting Gmail sync (last_sync: {last_sync_time}, cached: {len(cached_message_ids)}, scan_days: {scan_days})")
        logger.info(f"GOOGLE_CLIENT_ID present: {bool(os.environ.get('GOOGLE_CLIENT_ID'))}")
        logger.info(f"GOOGLE_CLIENT_SECRET present: {bool(os.environ.get('GOOGLE_CLIENT_SECRET'))}")
        
        # Perform sync
        result = gmail_service.sync_emails(
            credentials_dict=credentials,
            last_sync_time=last_sync_time,
            cached_message_ids=cached_message_ids,
            scan_days=scan_days
        )
        
        logger.info(f"Sync completed: {result['status']}, found {result['extracted_count']} applications")
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in /gmail/sync: {str(e)}", exc_info=True)
        return jsonify({
            "status": "error",
            "error": str(e),
            "error_type": type(e).__name__,
            "new_applications": [],
            "message_ids": [],
            "checked_count": 0,
            "extracted_count": 0
        }), 500

@gmail_routes.route("/gmail/test-connection", methods=["POST"])
def test_gmail_connection():
    """
    Test Gmail API connection with user credentials
    
    Request body:
    {
        "credentials": {...}
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'credentials' not in data:
            return jsonify({"error": "Gmail credentials required"}), 400
        
        credentials = data['credentials']
        
        logger.info(f"Testing connection with credentials type: {type(credentials)}")
        
        # Try to build service
        service, updated_creds = gmail_service.build_gmail_service(credentials)
        
        # Test by fetching profile
        profile = service.users().getProfile(userId='me').execute()
        
        return jsonify({
            "status": "success",
            "email": profile.get('emailAddress'),
            "messages_total": profile.get('messagesTotal', 0),
            "updated_credentials": updated_creds
        })
        
    except Exception as e:
        logger.error(f"Gmail connection test failed: {str(e)}", exc_info=True)
        return jsonify({
            "status": "error",
            "error": str(e),
            "error_type": type(e).__name__
        }), 500

@gmail_routes.route("/gmail/parse-email", methods=["POST"])
def parse_single_email():
    """
    Parse a single email for testing/debugging
    
    Request body:
    {
        "subject": "...",
        "sender": "...",
        "body": "...",
        "date": "..."
    }
    """
    try:
        data = request.get_json()
        
        required_fields = ['subject', 'sender', 'body', 'date']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Create email object
        email = {
            'message_id': 'test_' + datetime.now().isoformat(),
            'subject': data['subject'],
            'sender': data['sender'],
            'body': data['body'],
            'date': data['date']
        }
        
        # Extract job data
        job_data = gmail_service.extract_job_data_from_email(email)
        
        if not job_data:
            return jsonify({
                "status": "no_extraction",
                "message": "Could not extract job application data from email"
            })
        
        return jsonify({
            "status": "success",
            "extracted_data": job_data
        })
        
    except Exception as e:
        logger.error(f"Error parsing email: {str(e)}", exc_info=True)
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

@gmail_routes.route("/gmail/health", methods=["GET"])
def gmail_health():
    """Check if Gmail service is properly configured"""
    try:
        groq_key_exists = bool(GROQ_API_KEY)
        google_client_id = bool(os.environ.get('GOOGLE_CLIENT_ID'))
        google_client_secret = bool(os.environ.get('GOOGLE_CLIENT_SECRET'))
        
        all_configured = groq_key_exists and google_client_id and google_client_secret
        
        return jsonify({
            "status": "healthy" if all_configured else "degraded",
            "groq_configured": groq_key_exists,
            "google_client_id_configured": google_client_id,
            "google_client_secret_configured": google_client_secret,
            "message": "Gmail sync service is ready" if all_configured else "Missing required configuration"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500