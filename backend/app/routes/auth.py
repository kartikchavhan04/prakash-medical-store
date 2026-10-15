from datetime import datetime, timezone

from bson import ObjectId
from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity
from pymongo.errors import DuplicateKeyError

from .common import check_password, customer_required, hash_password, serialize_doc

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    mobile = str(data.get("mobile", "")).strip()
    password = str(data.get("password", ""))
    if not name or not email or not mobile or not password:
        return jsonify({"message": "Name, email, mobile and password are required."}), 400
    if len(password) < 8:
        return jsonify({"message": "Password must contain at least 8 characters."}), 400
    if len(password.encode("utf-8")) > 72:
        return jsonify({"message": "Password must not exceed 72 UTF-8 bytes."}), 400
    if "@" not in email or "." not in email.rsplit("@", 1)[-1]:
        return jsonify({"message": "Enter a valid email address."}), 400
    document = {
        "name": name,
        "email": email,
        "mobile": mobile,
        "password_hash": hash_password(password),
        "created_at": datetime.now(timezone.utc),
    }
    try:
        result = current_app.db.users.insert_one(document)
    except DuplicateKeyError:
        return jsonify({"message": "An account with this email already exists."}), 409
    token = create_access_token(identity=str(result.inserted_id), additional_claims={"role": "customer"})
    return jsonify({"message": "Registration successful.", "token": token, "user": serialize_doc({**document, "_id": result.inserted_id})}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    user = current_app.db.users.find_one({"email": email}) if email and password else None
    if not user or not check_password(password, user.get("password_hash")):
        return jsonify({"message": "Incorrect email or password."}), 401
    token = create_access_token(identity=str(user["_id"]), additional_claims={"role": "customer"})
    return jsonify({"message": "Login successful.", "token": token, "user": serialize_doc(user)})


@auth_bp.get("/me")
@customer_required
def me():
    user_id = get_jwt_identity()
    if not ObjectId.is_valid(user_id):
        return jsonify({"message": "Invalid user token."}), 401
    user = current_app.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"message": "Account not found."}), 404
    return jsonify({"user": serialize_doc(user)})
