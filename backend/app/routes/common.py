from functools import wraps
from datetime import datetime, timezone
from uuid import uuid4

import bcrypt
import cloudinary
import cloudinary.uploader
from bson import ObjectId
from cloudinary.exceptions import Error as CloudinaryError
from flask import current_app, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from werkzeug.utils import secure_filename

ALLOWED_IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "gif"}
IMAGE_MIME_TYPES = {
    "jpg": {"image/jpeg"},
    "jpeg": {"image/jpeg"},
    "png": {"image/png"},
    "webp": {"image/webp"},
    "gif": {"image/gif"},
}


class ImageStorageError(Exception):
    def __init__(self, message, status_code=503):
        super().__init__(message)
        self.status_code = status_code


def _has_valid_image_signature(content, extension):
    if extension in {"jpg", "jpeg"}:
        return content.startswith(b"\xff\xd8\xff")
    if extension == "png":
        return content.startswith(b"\x89PNG\r\n\x1a\n")
    if extension == "webp":
        return content.startswith(b"RIFF") and content[8:12] == b"WEBP"
    if extension == "gif":
        return content.startswith((b"GIF87a", b"GIF89a"))
    return False


def now_utc():
    return datetime.now(timezone.utc)


def as_iso(value):
    return value.isoformat() if hasattr(value, "isoformat") else value


def serialize_doc(document):
    if not document:
        return None
    result = dict(document)
    result["id"] = str(result.pop("_id", ""))
    for key, value in list(result.items()):
        if hasattr(value, "isoformat"):
            result[key] = value.isoformat()
        elif isinstance(value, ObjectId):
            result[key] = str(value)
    result.pop("password_hash", None)
    return result


def valid_object_id(value):
    return ObjectId.is_valid(value)


def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def check_password(password, password_hash):
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except (ValueError, TypeError, AttributeError):
        return False


def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        if get_jwt().get("role") != "admin":
            return jsonify({"message": "Administrator access required."}), 403
        return fn(*args, **kwargs)
    return wrapper


def customer_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        if get_jwt().get("role") != "customer":
            return jsonify({"message": "Customer login required."}), 403
        return fn(*args, **kwargs)
    return wrapper


def save_images(file_list, validate_content=False, cloudinary_folder="products"):
    validated = []
    for file in file_list:
        if not file or not file.filename:
            continue
        original = secure_filename(file.filename)
        if "." not in original:
            continue
        extension = original.rsplit(".", 1)[1].lower()
        if extension not in ALLOWED_IMAGE_EXTENSIONS:
            raise ValueError(f"Unsupported image type for {original}. Use JPG, PNG, WEBP or GIF.")
        if validate_content:
            mime_type = (file.mimetype or "").lower().split(";", 1)[0]
            if mime_type and mime_type not in IMAGE_MIME_TYPES[extension]:
                raise ValueError(f"The file type for {original} does not match its extension.")
            max_size = current_app.config.get("MAX_CONTENT_LENGTH") or 8 * 1024 * 1024
            content = file.stream.read(max_size + 1)
            file.stream.seek(0)
            if len(content) > max_size:
                raise ValueError(f"{original} exceeds the maximum allowed image size.")
            if not _has_valid_image_signature(content, extension):
                raise ValueError(f"{original} is not a valid {extension.upper()} image.")
        validated.append((file, extension))

    if not validated:
        return []

    cloudinary_settings = {
        "cloud_name": current_app.config.get("CLOUDINARY_CLOUD_NAME"),
        "api_key": current_app.config.get("CLOUDINARY_API_KEY"),
        "api_secret": current_app.config.get("CLOUDINARY_API_SECRET"),
        "secure": True,
    }
    if not all(cloudinary_settings.values()):
        raise ImageStorageError(
            "Cloud image storage is not configured. Set CLOUDINARY_CLOUD_NAME, "
            "CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
        )

    cloudinary.config(**cloudinary_settings)
    saved = []
    for file, _extension in validated:
        try:
            result = cloudinary.uploader.upload(
                file,
                folder=f"prakash-medical-store/{cloudinary_folder}",
                public_id=uuid4().hex,
                overwrite=False,
                unique_filename=False,
                resource_type="image",
            )
        except CloudinaryError as exc:
            current_app.logger.error(
                "Cloudinary image upload failed (%s).", type(exc).__name__
            )
            raise ImageStorageError(
                "Image storage failed. Please try again.", status_code=502
            ) from exc

        secure_url = result.get("secure_url") if isinstance(result, dict) else None
        if not isinstance(secure_url, str) or not secure_url.startswith("https://"):
            current_app.logger.error("Cloudinary returned no HTTPS image URL.")
            raise ImageStorageError(
                "Image storage returned an invalid URL. Please try again.",
                status_code=502,
            )
        saved.append(secure_url)
    return saved


def public_product(document):
    result = serialize_doc(document)
    if result:
        result.setdefault("images", [])
        result["discount_percent"] = round(max(0, (float(result.get("mrp", 0)) - float(result.get("price", 0))) / float(result.get("mrp", 1)) * 100)) if float(result.get("mrp", 0)) > 0 else 0
        result["in_stock"] = int(result.get("stock", 0)) > 0
    return result
