import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from pymongo.errors import PyMongoError

from .routes.auth import auth_bp
from .routes.products import products_bp
from .routes.staff import staff_bp
from .routes.contact import contact_bp
from .routes.admin import admin_bp


def create_app(test_config=None):
    load_dotenv()
    app = Flask(__name__)
    base_dir = Path(__file__).resolve().parent.parent
    upload_folder = os.getenv("UPLOAD_FOLDER", "app/uploads")
    upload_path = Path(upload_folder)
    if not upload_path.is_absolute():
        upload_path = base_dir / upload_path
    upload_path.mkdir(parents=True, exist_ok=True)

    app.config.update(
        SECRET_KEY=os.getenv("SECRET_KEY", "dev-secret-change-me"),
        JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "dev-jwt-secret-change-me"),
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=12),
        MONGO_URI=os.getenv("MONGO_URI", "mongodb://localhost:27017"),
        MONGO_DB_NAME=os.getenv("MONGO_DB_NAME", "prakash_medical_store"),
        UPLOAD_FOLDER=str(upload_path),
        PUBLIC_API_URL=os.getenv("PUBLIC_API_URL", "http://localhost:5000").rstrip("/"),
        FRONTEND_URL=os.getenv("FRONTEND_URL", ""),
        MAX_CONTENT_LENGTH=int(os.getenv("MAX_CONTENT_LENGTH_MB", "8")) * 1024 * 1024,
        DEBUG=os.getenv("FLASK_ENV", "development") == "development",
    )
    if test_config:
        app.config.update(test_config)

    origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
    configured_frontend = app.config["FRONTEND_URL"].strip()
    if configured_frontend:
        origins.extend([origin.strip() for origin in configured_frontend.split(",") if origin.strip()])
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": origins,
                "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
            }
        },
        supports_credentials=False,
    )
    JWTManager(app)

    if app.config.get("MONGO_URI"):
        app.mongo_client = MongoClient(app.config["MONGO_URI"], serverSelectionTimeoutMS=5000)
        app.db = app.mongo_client[app.config["MONGO_DB_NAME"]]
        try:
            # Indexes keep login and registration predictable under concurrent requests.
            app.db.users.create_index("email", unique=True)
            app.db.admins.create_index("email", unique=True)
        except PyMongoError:
            app.logger.warning("Could not create MongoDB indexes at startup; check database connectivity.")
    else:
        app.mongo_client = None
        app.db = None

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(staff_bp, url_prefix="/api/staff")
    app.register_blueprint(contact_bp, url_prefix="/api/contact")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    @app.get("/api/health")
    def health():
        status = {"status": "ok", "service": "Prakash Medical API"}
        try:
            if app.mongo_client:
                app.mongo_client.admin.command("ping")
                status["database"] = "connected"
            else:
                status["database"] = "not-configured"
        except PyMongoError:
            status["database"] = "unavailable"
            return jsonify(status), 503
        return jsonify(status)

    @app.get("/uploads/<path:filename>")
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    @app.errorhandler(413)
    def file_too_large(_error):
        return jsonify({"message": "Upload too large. Maximum request size is configured by MAX_CONTENT_LENGTH_MB."}), 413

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"message": "Resource not found."}), 404

    @app.errorhandler(500)
    def server_error(_error):
        app.logger.exception("Unhandled application error")
        return jsonify({"message": "Something went wrong. Please try again."}), 500

    return app
