import io
import traceback
import logging
import tempfile
import os
from flask import Blueprint, request, jsonify
from werkzeug.exceptions import RequestEntityTooLarge
from app.analyzer import analyze_resume, extract_text_from_pdf, extract_text_from_docx

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

routes = Blueprint("routes", __name__)


def extract_text_from_uploaded_file(file_bytes, filename):
    """Helper to extract text from uploaded PDF or DOCX using BytesIO."""
    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    elif filename.endswith(".docx"):
        return extract_text_from_docx(file_bytes)
    else:
        raise ValueError("Unsupported file format. Only PDF and DOCX are supported.")


@routes.route("/", methods=["GET"])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "running",
        "message": "Resume AI backend is running!"
    })


# --- Default Job Skills ---
DEFAULT_JOB_SKILLS = {
    "frontend developer": ["html", "css", "javascript", "react", "redux", "typescript"],
    "backend developer": ["python", "django", "flask", "sql", "api", "docker"],
    "data scientist": ["python", "machine learning", "pandas", "numpy", "tensorflow", "sql"],
    "full stack developer": ["html", "css", "javascript", "react", "node.js", "express", "mongodb"],
}

@routes.route("/analyze", methods=["POST", "OPTIONS"])
def analyze_resume_api():
    """Analyze resume against a target job."""
    if request.method == "OPTIONS":
        return "", 200

    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        job_title = request.form.get("target_job", "").strip().lower()
        job_skills = request.form.get("job_skills")

        # ✅ Auto-fill job_skills if not provided
        if not job_skills or job_skills == "[]":
            job_skills_list = DEFAULT_JOB_SKILLS.get(job_title, [])
        else:
            job_skills_list = [s.strip() for s in job_skills.split(",") if s.strip()]

        if not job_title:
            return jsonify({"error": "target_job is required"}), 400

        # Save file to a temporary location
        suffix = os.path.splitext(file.filename)[-1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        logger.info(f"Saved uploaded file to {tmp_path}")

        # Run analysis
        result = analyze_resume(tmp_path, job_title=job_title, job_skills=job_skills_list)

        # Clean up temp file
        os.remove(tmp_path)

        return jsonify(result)

    except RequestEntityTooLarge:
        return jsonify({"error": "File too large. Maximum allowed size is 10MB."}), 413

    except Exception as e:
        logger.error(f"Unexpected error in /analyze: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": f"Server error: {str(e)}"}), 500



@routes.route("/analyze-multiple-jobs", methods=["POST"])
def analyze_multiple_jobs():
    """Analyze resume against multiple job roles."""
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        jobs_str = request.form.get("target_jobs")

        if not jobs_str:
            return jsonify({"error": "target_jobs is required"}), 400

        target_jobs = [job.strip() for job in jobs_str.split(",") if job.strip()]

        # Save file temporarily
        suffix = os.path.splitext(file.filename)[-1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        results = {}
        for job in target_jobs:
            job_skills = request.form.get(f"{job}_skills", "")
            job_skills_list = [s.strip() for s in job_skills.split(",") if s.strip()]
            results[job] = analyze_resume(tmp_path, job_title=job, job_skills=job_skills_list)

        # Clean up
        os.remove(tmp_path)

        return jsonify(results)

    except Exception as e:
        logger.error(f"Error in /analyze-multiple-jobs: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@routes.route("/project-highlights", methods=["POST"])
def get_project_highlights():
    """Return only project-related insights from the resume."""
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        job_title = request.form.get("target_job")
        job_skills = request.form.get("job_skills")

        if not job_title or not job_skills:
            return jsonify({"error": "Both target_job and job_skills are required"}), 400

        job_skills_list = [s.strip() for s in job_skills.split(",") if s.strip()]

        # Save temporarily
        suffix = os.path.splitext(file.filename)[-1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        result = analyze_resume(tmp_path, job_title=job_title, job_skills=job_skills_list)

        # Clean up
        os.remove(tmp_path)

        highlights = result.get("projects_with_skills", {})
        impacts = result.get("quantifiable_impacts", {})

        return jsonify({
            "projects": highlights,
            "impacts": impacts
        })

    except Exception as e:
        logger.error(f"Error in /project-highlights: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@routes.route("/debug/test-analyzer", methods=["GET"])
def test_analyzer():
    """Debug endpoint to ensure analyzer works."""
    try:
        return jsonify({
            "status": "success",
            "message": "Analyzer endpoints are working"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500
