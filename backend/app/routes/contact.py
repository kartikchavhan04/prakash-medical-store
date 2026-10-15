from datetime import datetime, timezone

from flask import Blueprint, current_app, jsonify, request

from .common import admin_required, serialize_doc

contact_bp = Blueprint("contact", __name__)


@contact_bp.post("")
def create_message():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    mobile = str(data.get("mobile", "")).strip()
    message = str(data.get("message", "")).strip()
    if not all((name, email, mobile, message)):
        return jsonify({"message": "Please complete all contact form fields."}), 400
    if len(message) > 5000:
        return jsonify({"message": "Message is too long (maximum 5000 characters)."}), 400
    document = {"name": name, "email": email, "mobile": mobile, "message": message, "created_at": datetime.now(timezone.utc), "status": "new"}
    current_app.db.messages.insert_one(document)
    return jsonify({"message": "Thank you! Your message has been sent to Prakash Medical."}), 201


@contact_bp.get("/messages")
@admin_required
def list_messages():
    messages = [serialize_doc(message) for message in current_app.db.messages.find().sort("created_at", -1)]
    return jsonify({"messages": messages, "count": len(messages)})


@contact_bp.patch("/messages/<message_id>/read")
@admin_required
def mark_message_read(message_id):
    from bson import ObjectId
    if not ObjectId.is_valid(message_id):
        return jsonify({"message": "Message not found."}), 404
    result = current_app.db.messages.update_one({"_id": ObjectId(message_id)}, {"$set": {"status": "read"}})
    if not result.matched_count:
        return jsonify({"message": "Message not found."}), 404
    return jsonify({"message": "Message marked as read."})


@contact_bp.delete("/messages/<message_id>")
@admin_required
def delete_message(message_id):
    from bson import ObjectId
    if not ObjectId.is_valid(message_id):
        return jsonify({"message": "Message not found."}), 404
    result = current_app.db.messages.delete_one({"_id": ObjectId(message_id)})
    if not result.deleted_count:
        return jsonify({"message": "Message not found."}), 404
    return jsonify({"message": "Message deleted."})
