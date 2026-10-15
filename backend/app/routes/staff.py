from datetime import datetime, timezone

from bson import ObjectId
from flask import Blueprint, current_app, jsonify, request

from .common import admin_required, save_images, serialize_doc, valid_object_id

staff_bp = Blueprint("staff", __name__)


def staff_payload(data, existing=None):
    name = str(data.get("name", "")).strip()
    title = str(data.get("title", data.get("role", "")).strip())
    if not name or not title:
        return None, "Staff name and role/title are required."
    payload = {
        "name": name,
        "title": title,
        "description": str(data.get("description", "")).strip(),
        "phone": str(data.get("phone", "")).strip(),
        "email": str(data.get("email", "")).strip(),
    }
    if existing and existing.get("image"):
        payload["image"] = existing["image"]
    return payload, None


@staff_bp.get("")
def list_staff():
    staff = [serialize_doc(person) for person in current_app.db.staff.find().sort("created_at", -1)]
    return jsonify({"staff": staff})


@staff_bp.post("")
@admin_required
def create_staff():
    data, error = staff_payload(request.form)
    if error:
        return jsonify({"message": error}), 400
    try:
        images = save_images([request.files.get("image")])
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400
    if images:
        data["image"] = images[0]
    data["created_at"] = datetime.now(timezone.utc)
    result = current_app.db.staff.insert_one(data)
    return jsonify({"message": "Staff card added successfully.", "staff": serialize_doc(current_app.db.staff.find_one({"_id": result.inserted_id}))}), 201


@staff_bp.put("/<staff_id>")
@admin_required
def update_staff(staff_id):
    if not valid_object_id(staff_id):
        return jsonify({"message": "Staff card not found."}), 404
    existing = current_app.db.staff.find_one({"_id": ObjectId(staff_id)})
    if not existing:
        return jsonify({"message": "Staff card not found."}), 404
    data, error = staff_payload(request.form, existing)
    if error:
        return jsonify({"message": error}), 400
    try:
        images = save_images([request.files.get("image")])
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400
    if images:
        data["image"] = images[0]
    current_app.db.staff.update_one({"_id": ObjectId(staff_id)}, {"$set": data})
    return jsonify({"message": "Staff card updated successfully.", "staff": serialize_doc(current_app.db.staff.find_one({"_id": ObjectId(staff_id)}))})


@staff_bp.delete("/<staff_id>")
@admin_required
def delete_staff(staff_id):
    if not valid_object_id(staff_id):
        return jsonify({"message": "Staff card not found."}), 404
    result = current_app.db.staff.delete_one({"_id": ObjectId(staff_id)})
    if not result.deleted_count:
        return jsonify({"message": "Staff card not found."}), 404
    return jsonify({"message": "Staff card deleted successfully."})
