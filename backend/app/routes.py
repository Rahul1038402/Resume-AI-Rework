import io
import traceback
import logging
import tempfile
import os
from flask import Blueprint, request, jsonify
from werkzeug.exceptions import RequestEntityTooLarge
from app.groq_analyzer import analyze_resume_with_groq, extract_text_from_pdf, extract_text_from_docx, test_groq_connection
from app.ats_scorer import calculate_ats_score
from app.resume_comparator import compare_resumes
from app.skills_analyzer import analyze_skills_gap

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

routes = Blueprint("routes", __name__)

@routes.route("/", methods=["GET"])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "running",
        "message": "Resume AI backend is running with Groq!"
    })

@routes.route("/health", methods=["GET"])
def health_check():
    """Comprehensive health check including Groq connectivity"""
    try:
        groq_status = test_groq_connection()
        return jsonify({
            "status": "healthy" if groq_status else "degraded",
            "groq_connected": groq_status,
            "message": "All systems operational" if groq_status else "Groq API connection issue"
        })
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "groq_connected": False,
            "error": str(e)
        }), 500

@routes.route("/analyze", methods=["POST", "OPTIONS"])
def analyze_resume_api():
    """Analyze resume against a target job using Gemini AI."""
    if request.method == "OPTIONS":
        return "", 200

    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        job_title = request.form.get("target_job", "").strip().lower()
        job_description = request.form.get("job_description", "").strip()

        # Validate file type
        if not file.filename.lower().endswith(('.pdf', '.docx')):
            return jsonify({"error": "Only PDF and DOCX files are supported"}), 400

        # Save file to a temporary location
        suffix = os.path.splitext(file.filename)[-1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        logger.info(f"Saved uploaded file to {tmp_path}")
        logger.info(f"Analyzing for job: {job_title}")
        if job_description:
            logger.info(f"Job description provided: {job_description[:100]}...")

        # Run Groq-powered analysis with job description
        result = analyze_resume_with_groq(
            file_path=tmp_path, 
            job_title=job_title, 
            job_skills=None,  # Always None - let Gemini decide
            job_description=job_description if job_description else None
        )

        # Clean up temp file
        os.remove(tmp_path)
        logger.info("Analysis completed successfully")

        return jsonify(result)

    except RequestEntityTooLarge:
        return jsonify({"error": "File too large. Maximum allowed size is 10MB."}), 413

    except Exception as e:
        # Clean up temp file if it exists
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.remove(tmp_path)
        
        logger.error(f"Unexpected error in /analyze: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({
            "error": f"Analysis failed: {str(e)}",
            "skills": [],
            "projects": [],
            "projects_with_skills": {},
            "quantifiable_impacts": {},
            "relevant_projects": [],
            "analysis": {
                "total_skills_found": 0,
                "total_projects": 0,
                "relevant_projects": 0,
                "skills_with_metrics": 0,
                "achieved_score": 0,
                "max_possible_score": 100
            }
        }), 500

@routes.route("/analyze-multiple-jobs", methods=["POST"])
def analyze_multiple_jobs():
    """Analyze resume against multiple job roles using Gemini AI."""
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        jobs_str = request.form.get("target_jobs")

        if not jobs_str:
            return jsonify({"error": "target_jobs is required"}), 400

        target_jobs = [job.strip().lower() for job in jobs_str.split(",") if job.strip()]

        if not target_jobs:
            return jsonify({"error": "At least one target job is required"}), 400

        # Validate file type
        if not file.filename.lower().endswith(('.pdf', '.docx')):
            return jsonify({"error": "Only PDF and DOCX files are supported"}), 400

        # Save file temporarily
        suffix = os.path.splitext(file.filename)[-1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        logger.info(f"Analyzing resume against multiple jobs: {target_jobs}")

        results = {}
        for job in target_jobs:
            try:
                # Get job description if provided
                job_description = request.form.get(f"{job}_description", "").strip()
                
                # Analyze with Groq - let it determine required skills
                result = analyze_resume_with_groq(
                    file_path=tmp_path, 
                    job_title=job, 
                    job_skills=None,  # Let Gemini decide
                    job_description=job_description if job_description else None
                )
                results[job] = result
                logger.info(f"Completed analysis for {job}")
                
            except Exception as job_error:
                logger.error(f"Error analyzing for job {job}: {str(job_error)}")
                results[job] = {
                    "error": f"Failed to analyze for {job}: {str(job_error)}",
                    "skills": [],
                    "projects": [],
                    "projects_with_skills": {},
                    "quantifiable_impacts": {},
                    "relevant_projects": [],
                    "analysis": {
                        "total_skills_found": 0,
                        "total_projects": 0,
                        "relevant_projects": 0,
                        "skills_with_metrics": 0,
                        "achieved_score": 0,
                        "max_possible_score": 100
                    }
                }

        # Clean up
        os.remove(tmp_path)

        return jsonify(results)

    except Exception as e:
        # Clean up temp file if it exists
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.remove(tmp_path)
            
        logger.error(f"Error in /analyze-multiple-jobs: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@routes.route("/project-highlights", methods=["POST"])
def get_project_highlights():
    """Return only project-related insights from the resume using Gemini AI."""
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        job_title = request.form.get("target_job", "").strip().lower()
        job_description = request.form.get("job_description", "").strip()

        # Validate file type
        if not file.filename.lower().endswith(('.pdf', '.docx')):
            return jsonify({"error": "Only PDF and DOCX files are supported"}), 400

        # Save temporarily
        suffix = os.path.splitext(file.filename)[-1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        # Run analysis with Groq - let it determine skills based on job
        result = analyze_resume_with_groq(
            file_path=tmp_path, 
            job_title=job_title if job_title else None, 
            job_skills=None,  # Let Gemini decide
            job_description=job_description if job_description else None
        )

        # Clean up
        os.remove(tmp_path)

        # Extract just the project highlights
        highlights = result.get("projects_with_skills", {})
        impacts = result.get("quantifiable_impacts", {})

        return jsonify({
            "projects": highlights,
            "impacts": impacts,
            "total_projects": len(highlights),
            "projects_with_metrics": len(impacts)
        })

    except Exception as e:
        # Clean up temp file if it exists
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.remove(tmp_path)
            
        logger.error(f"Error in /project-highlights: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@routes.route("/skills-only", methods=["POST"])
def extract_skills_only():
    """Extract only skills from resume using Gemini AI."""
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        # Validate file type
        if not file.filename.lower().endswith(('.pdf', '.docx')):
            return jsonify({"error": "Only PDF and DOCX files are supported"}), 400

        # Save temporarily
        suffix = os.path.splitext(file.filename)[-1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        # Run basic analysis with Groq (no job matching)
        result = analyze_resume_with_groq(file_path=tmp_path)

        # Clean up
        os.remove(tmp_path)

        return jsonify({
            "skills": result.get("skills", []),
            "total_skills": len(result.get("skills", []))
        })

    except Exception as e:
        # Clean up temp file if it exists
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.remove(tmp_path)
            
        logger.error(f"Error in /skills-only: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@routes.route("/ats-score", methods=["POST"])
def get_ats_score():
    """Calculate ATS compatibility score for resume."""
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        job_description = request.form.get("job_description", "").strip()

        if not file.filename.lower().endswith(('.pdf', '.docx')):
            return jsonify({"error": "Only PDF and DOCX files are supported"}), 400

        suffix = os.path.splitext(file.filename)[-1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        if tmp_path.endswith(".pdf"):
            text = extract_text_from_pdf(tmp_path)
        else:
            text = extract_text_from_docx(tmp_path)

        os.remove(tmp_path)

        ats_result = calculate_ats_score(text, job_description if job_description else None)
        return jsonify(ats_result)

    except Exception as e:
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.remove(tmp_path)
        logger.error(f"Error in /ats-score: {str(e)}")
        return jsonify({"error": f"ATS scoring failed: {str(e)}"}), 500

@routes.route("/compare-resumes", methods=["POST"])
def compare_two_resumes():
    """Compare two resumes and highlight differences."""
    try:
        if "file1" not in request.files or "file2" not in request.files:
            return jsonify({"error": "Two files required for comparison"}), 400

        file1 = request.files["file1"]
        file2 = request.files["file2"]

        for file in [file1, file2]:
            if not file.filename.lower().endswith(('.pdf', '.docx')):
                return jsonify({"error": "Only PDF and DOCX files are supported"}), 400

        # Process first file
        suffix1 = os.path.splitext(file1.filename)[-1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix1) as tmp1:
            file1.save(tmp1.name)
            tmp1_path = tmp1.name

        # Process second file
        suffix2 = os.path.splitext(file2.filename)[-1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix2) as tmp2:
            file2.save(tmp2.name)
            tmp2_path = tmp2.name

        # Extract text from both files
        text1 = extract_text_from_pdf(tmp1_path) if tmp1_path.endswith(".pdf") else extract_text_from_docx(tmp1_path)
        text2 = extract_text_from_pdf(tmp2_path) if tmp2_path.endswith(".pdf") else extract_text_from_docx(tmp2_path)

        # Clean up temp files
        os.remove(tmp1_path)
        os.remove(tmp2_path)

        comparison_result = compare_resumes(text1, text2)
        return jsonify(comparison_result)

    except Exception as e:
        # Clean up temp files if they exist
        for tmp_path in ['tmp1_path', 'tmp2_path']:
            if tmp_path in locals() and os.path.exists(locals()[tmp_path]):
                os.remove(locals()[tmp_path])
        
        logger.error(f"Error in /compare-resumes: {str(e)}")
        return jsonify({"error": f"Comparison failed: {str(e)}"}), 500

@routes.route("/skills-gap", methods=["POST"])
def analyze_skills_gap_api():
    """Analyze skills gap for a target role."""
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        target_role = request.form.get("target_role", "software engineer").strip()

        if not file.filename.lower().endswith(('.pdf', '.docx')):
            return jsonify({"error": "Only PDF and DOCX files are supported"}), 400

        suffix = os.path.splitext(file.filename)[-1].lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        text = extract_text_from_pdf(tmp_path) if tmp_path.endswith(".pdf") else extract_text_from_docx(tmp_path)
        os.remove(tmp_path)

        gap_analysis = analyze_skills_gap(text, target_role)
        return jsonify(gap_analysis)

    except Exception as e:
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.remove(tmp_path)
        logger.error(f"Error in /skills-gap: {str(e)}")
        return jsonify({"error": f"Skills gap analysis failed: {str(e)}"}), 500

@routes.route("/debug/test-analyzer", methods=["GET"])
def test_analyzer():
    """Debug endpoint to ensure Groq analyzer works."""
    try:
        groq_status = test_groq_connection()
        return jsonify({
            "status": "success" if groq_status else "error",
            "message": "Groq analyzer is working" if groq_status else "Groq connection failed",
            "groq_connected": groq_status
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "traceback": traceback.format_exc()
        }), 500