from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import create_access_token

from .common import admin_required, check_password, serialize_doc

admin_bp = Blueprint("admin", __name__)


@admin_bp.post("/auth/login")
def login():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    admin = current_app.db.admins.find_one({"email": email}) if email and password else None
    if not admin or not check_password(password, admin.get("password_hash")):
        return jsonify({"message": "Incorrect administrator email or password."}), 401
    token = create_access_token(identity=str(admin["_id"]), additional_claims={"role": "admin"})
    return jsonify({"message": "Admin login successful.", "token": token, "admin": serialize_doc(admin)})


@admin_bp.get("/stats")
@admin_required
def stats():
    return jsonify({
        "products": current_app.db.products.count_documents({}),
        "staff": current_app.db.staff.count_documents({}),
        "messages": current_app.db.messages.count_documents({}),
        "unread_messages": current_app.db.messages.count_documents({"status": {"$ne": "read"}}),
        "customers": current_app.db.users.count_documents({}),
    })
