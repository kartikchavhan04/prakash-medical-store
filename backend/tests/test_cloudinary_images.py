import io
import unittest
from types import SimpleNamespace
from unittest.mock import patch

from flask import Flask
from cloudinary.exceptions import Error as CloudinaryError
from bson import ObjectId
from flask_jwt_extended import JWTManager, create_access_token
from werkzeug.datastructures import FileStorage

from app.routes.common import ImageStorageError, save_images
from app.routes.products import products_bp
from app.routes.staff import staff_bp


PNG_BYTES = b"\x89PNG\r\n\x1a\n" + b"test-image-data"


def image_file(filename="sample.png", mimetype="image/png", content=PNG_BYTES):
    return FileStorage(
        stream=io.BytesIO(content),
        filename=filename,
        content_type=mimetype,
    )


class CloudinaryImageUploadTests(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config.update(
            CLOUDINARY_CLOUD_NAME="test-cloud",
            CLOUDINARY_API_KEY="test-key",
            CLOUDINARY_API_SECRET="test-secret",
            MAX_CONTENT_LENGTH=8 * 1024 * 1024,
        )

    @patch("app.routes.common.cloudinary.uploader.upload")
    def test_upload_returns_cloudinary_https_url_and_uses_folder(self, upload):
        upload.return_value = {
            "secure_url": "https://res.cloudinary.com/test-cloud/image/upload/test.png"
        }
        with self.app.app_context():
            urls = save_images(
                [image_file()],
                validate_content=True,
                cloudinary_folder="products",
            )

        self.assertEqual(
            urls,
            ["https://res.cloudinary.com/test-cloud/image/upload/test.png"],
        )
        self.assertEqual(upload.call_args.kwargs["folder"], "prakash-medical-store/products")
        self.assertEqual(upload.call_args.kwargs["resource_type"], "image")
        self.assertFalse(upload.call_args.kwargs["overwrite"])

    @patch("app.routes.common.cloudinary.uploader.upload")
    def test_upload_fails_clearly_when_cloudinary_is_not_configured(self, upload):
        self.app.config.update(
            CLOUDINARY_CLOUD_NAME="",
            CLOUDINARY_API_KEY="",
            CLOUDINARY_API_SECRET="",
        )
        with self.app.app_context(), self.assertRaisesRegex(
            ImageStorageError, "Cloud image storage is not configured"
        ):
            save_images([image_file()], validate_content=True)
        upload.assert_not_called()

    @patch("app.routes.common.cloudinary.uploader.upload")
    def test_invalid_image_is_rejected_before_cloudinary_upload(self, upload):
        with self.app.app_context(), self.assertRaisesRegex(ValueError, "not a valid PNG"):
            save_images(
                [image_file(content=b"not-an-image")],
                validate_content=True,
                cloudinary_folder="staff",
            )
        upload.assert_not_called()

    @patch("app.routes.common.cloudinary.uploader.upload")
    def test_upload_provider_errors_do_not_expose_provider_details(self, upload):
        upload.side_effect = CloudinaryError("private provider details")
        with self.app.app_context(), self.assertRaisesRegex(
            ImageStorageError, "Image storage failed"
        ) as raised:
            save_images(
                [image_file()],
                validate_content=True,
                cloudinary_folder="staff",
            )
        self.assertEqual(raised.exception.status_code, 502)
        self.assertNotIn("private provider details", str(raised.exception))


class InMemoryCollection:
    def __init__(self, documents=None):
        self.documents = documents or []

    def find_one(self, query):
        return next(
            (
                document
                for document in self.documents
                if all(document.get(key) == value for key, value in query.items())
            ),
            None,
        )

    def update_one(self, query, update):
        document = self.find_one(query)
        if not document:
            return SimpleNamespace(matched_count=0)
        document.update(update["$set"])
        return SimpleNamespace(matched_count=1)

    def insert_one(self, document):
        document["_id"] = ObjectId()
        self.documents.append(document)
        return SimpleNamespace(inserted_id=document["_id"])


class ImageRouteBehaviorTests(unittest.TestCase):
    def setUp(self):
        self.product_id = ObjectId()
        self.staff_id = ObjectId()
        self.products = InMemoryCollection(
            [
                {
                    "_id": self.product_id,
                    "name": "Test product",
                    "category": "Tablets",
                    "description": "",
                    "price": 10,
                    "mrp": 12,
                    "stock": 1,
                    "prescription_required": False,
                    "images": ["https://res.cloudinary.com/example/products/old.png"],
                }
            ]
        )
        self.staff = InMemoryCollection(
            [
                {
                    "_id": self.staff_id,
                    "name": "Test staff",
                    "title": "Staff",
                    "description": "",
                    "phone": "",
                    "email": "",
                    "image": "https://res.cloudinary.com/example/staff/old.png",
                }
            ]
        )
        app = Flask(__name__)
        app.config.update(
            TESTING=True,
            SECRET_KEY="test-secret-long-enough-for-hmac",
            JWT_SECRET_KEY="test-jwt-secret-long-enough-for-hmac",
            CLOUDINARY_CLOUD_NAME="test-cloud",
            CLOUDINARY_API_KEY="test-key",
            CLOUDINARY_API_SECRET="test-secret",
            MAX_CONTENT_LENGTH=8 * 1024 * 1024,
        )
        JWTManager(app)
        app.db = SimpleNamespace(products=self.products, staff=self.staff)
        app.register_blueprint(products_bp, url_prefix="/api/products")
        app.register_blueprint(staff_bp, url_prefix="/api/staff")
        self.app = app
        self.client = app.test_client()
        with app.app_context():
            token = create_access_token(
                identity="test-admin",
                additional_claims={"role": "admin"},
            )
        self.admin_headers = {"Authorization": f"Bearer {token}"}

    def test_product_and_staff_upload_endpoints_require_admin_auth(self):
        product_response = self.client.post(
            "/api/products",
            data={"name": "Unauthorized", "category": "Tablets"},
        )
        staff_response = self.client.post(
            "/api/staff",
            data={"name": "Unauthorized", "title": "Staff"},
        )
        self.assertEqual(product_response.status_code, 401)
        self.assertEqual(staff_response.status_code, 401)

    def test_product_edit_without_new_image_preserves_existing_images(self):
        response = self.client.put(
            f"/api/products/{self.product_id}",
            headers=self.admin_headers,
            data={
                "name": "Updated product",
                "category": "Tablets",
                "price": "9",
                "mrp": "12",
                "stock": "1",
                "prescription_required": "false",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json["product"]["images"],
            ["https://res.cloudinary.com/example/products/old.png"],
        )

    def test_staff_edit_without_new_image_preserves_existing_image(self):
        response = self.client.put(
            f"/api/staff/{self.staff_id}",
            headers=self.admin_headers,
            data={"name": "Updated staff", "title": "Staff"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json["staff"]["image"],
            "https://res.cloudinary.com/example/staff/old.png",
        )

    @patch("app.routes.common.cloudinary.uploader.upload")
    def test_product_upload_stores_cloudinary_https_url_in_existing_image_field(self, upload):
        upload.return_value = {
            "secure_url": "https://res.cloudinary.com/test-cloud/products/new-product.png"
        }
        response = self.client.post(
            "/api/products",
            headers=self.admin_headers,
            data={
                "name": "New product",
                "category": "Tablets",
                "price": "10",
                "mrp": "12",
                "stock": "1",
                "prescription_required": "false",
                "images": (io.BytesIO(PNG_BYTES), "product.png", "image/png"),
            },
            content_type="multipart/form-data",
        )
        self.assertEqual(response.status_code, 201)
        image_url = response.json["product"]["images"][0]
        self.assertEqual(
            image_url,
            "https://res.cloudinary.com/test-cloud/products/new-product.png",
        )
        self.assertEqual(self.products.documents[-1]["images"], [image_url])
        self.assertEqual(
            upload.call_args.kwargs["folder"],
            "prakash-medical-store/products",
        )

    @patch("app.routes.common.cloudinary.uploader.upload")
    def test_staff_upload_stores_cloudinary_https_url_in_existing_image_field(self, upload):
        upload.return_value = {
            "secure_url": "https://res.cloudinary.com/test-cloud/staff/new-staff.png"
        }
        response = self.client.post(
            "/api/staff",
            headers=self.admin_headers,
            data={
                "name": "New staff",
                "title": "Staff",
                "image": (io.BytesIO(PNG_BYTES), "staff.png", "image/png"),
            },
            content_type="multipart/form-data",
        )
        self.assertEqual(response.status_code, 201)
        image_url = response.json["staff"]["image"]
        self.assertEqual(
            image_url,
            "https://res.cloudinary.com/test-cloud/staff/new-staff.png",
        )
        self.assertEqual(self.staff.documents[-1]["image"], image_url)
        self.assertEqual(upload.call_args.kwargs["folder"], "prakash-medical-store/staff")


if __name__ == "__main__":
    unittest.main()
