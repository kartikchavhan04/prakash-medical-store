from datetime import datetime, timezone
import re

from bson import ObjectId
from flask import Blueprint, current_app, jsonify, request

from .common import ImageStorageError, admin_required, public_product, save_images, serialize_doc, valid_object_id

products_bp = Blueprint("products", __name__)
CATEGORIES = ["Tablets", "Syrups", "Capsules", "Supplements", "Ayurvedic", "General Store", "Surgical Items", "Baby Care", "Personal Care", "First Aid"]


def parse_product_form(data):
    name = str(data.get("name", "")).strip()
    category = str(data.get("category", "")).strip()
    description = str(data.get("description", "")).strip()
    try:
        price = float(data.get("price", 0))
        mrp = float(data.get("mrp", 0))
        stock = int(data.get("stock", 0))
    except (ValueError, TypeError):
        return None, "Price, MRP and stock must be numeric."
    if not name or not category:
        return None, "Product name and category are required."
    if price < 0 or mrp < 0 or stock < 0:
        return None, "Price, MRP and stock cannot be negative."
    if mrp and price > mrp:
        return None, "Selling price cannot be greater than MRP."
    prescription = str(data.get("prescription_required", "false")).lower() in {"true", "1", "yes", "on"}
    return {"name": name, "description": description, "price": price, "mrp": mrp, "category": category, "stock": stock, "prescription_required": prescription}, None


@products_bp.get("")
def list_products():
    query = {}
    search = re.escape(request.args.get("search", "").strip())
    category = request.args.get("category", "").strip()
    if search:
        query["$or"] = [{"name": {"$regex": search, "$options": "i"}}, {"description": {"$regex": search, "$options": "i"}}]
    if category and category.lower() != "all":
        query["category"] = category
    products = [public_product(p) for p in current_app.db.products.find(query).sort("created_at", -1)]
    return jsonify({"products": products, "count": len(products), "categories": CATEGORIES})


@products_bp.get("/<product_id>")
def get_product(product_id):
    if not valid_object_id(product_id):
        return jsonify({"message": "Product not found."}), 404
    product = current_app.db.products.find_one({"_id": ObjectId(product_id)})
    if not product:
        return jsonify({"message": "Product not found."}), 404
    return jsonify({"product": public_product(product)})


@products_bp.post("")
@admin_required
def create_product():
    data, error = parse_product_form(request.form)
    if error:
        return jsonify({"message": error}), 400
    try:
        images = save_images(
            request.files.getlist("images"),
            validate_content=True,
            cloudinary_folder="products",
        )
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400
    except ImageStorageError as exc:
        return jsonify({"message": str(exc)}), exc.status_code
    data["images"] = images
    data["created_at"] = datetime.now(timezone.utc)
    data["updated_at"] = data["created_at"]
    result = current_app.db.products.insert_one(data)
    product = current_app.db.products.find_one({"_id": result.inserted_id})
    return jsonify({"message": "Product added successfully.", "product": public_product(product)}), 201


@products_bp.put("/<product_id>")
@admin_required
def update_product(product_id):
    if not valid_object_id(product_id):
        return jsonify({"message": "Product not found."}), 404
    existing = current_app.db.products.find_one({"_id": ObjectId(product_id)})
    if not existing:
        return jsonify({"message": "Product not found."}), 404
    data, error = parse_product_form(request.form)
    if error:
        return jsonify({"message": error}), 400
    existing_images = existing.get("images", [])
    retained_images = None
    if request.form.get("existing_images_present") == "true":
        retained_images = request.form.getlist("existing_images")
        if any(image not in existing_images for image in retained_images):
            return jsonify({"message": "One or more selected existing images are invalid."}), 400
    try:
        new_images = save_images(
            request.files.getlist("images"),
            validate_content=True,
            cloudinary_folder="products",
        )
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 400
    except ImageStorageError as exc:
        return jsonify({"message": str(exc)}), exc.status_code
    if retained_images is not None:
        data["images"] = retained_images + new_images
    else:
        data["images"] = new_images or existing_images
    data["updated_at"] = datetime.now(timezone.utc)
    current_app.db.products.update_one({"_id": ObjectId(product_id)}, {"$set": data})
    return jsonify({"message": "Product updated successfully.", "product": public_product(current_app.db.products.find_one({"_id": ObjectId(product_id)}))})


@products_bp.delete("/<product_id>")
@admin_required
def delete_product(product_id):
    if not valid_object_id(product_id):
        return jsonify({"message": "Product not found."}), 404
    result = current_app.db.products.delete_one({"_id": ObjectId(product_id)})
    if not result.deleted_count:
        return jsonify({"message": "Product not found."}), 404
    return jsonify({"message": "Product deleted successfully."})
