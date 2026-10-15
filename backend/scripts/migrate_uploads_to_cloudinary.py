"""Migrate MongoDB image references backed by local uploads to Cloudinary.

Run without --apply first to report which referenced local files are available.
The script updates only matching image URL fields and never deletes local or
Cloudinary files.
"""

import argparse
import os
from pathlib import Path
from urllib.parse import unquote, urlsplit
from uuid import uuid4

import cloudinary
import cloudinary.uploader
from cloudinary.exceptions import Error as CloudinaryError
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import PyMongoError


BACKEND_DIR = Path(__file__).resolve().parents[1]
UPLOAD_FIELDS = ("CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET")


def local_upload_filename(image_url):
    if not isinstance(image_url, str):
        return None
    path = unquote(urlsplit(image_url).path)
    if not path.startswith("/uploads/"):
        return None
    filename = path.removeprefix("/uploads/")
    if not filename or Path(filename).name != filename:
        return None
    return filename


def upload_local_file(path, folder):
    try:
        result = cloudinary.uploader.upload(
            str(path),
            folder=f"prakash-medical-store/{folder}",
            public_id=uuid4().hex,
            overwrite=False,
            unique_filename=False,
            resource_type="image",
        )
    except CloudinaryError as exc:
        raise RuntimeError(f"Cloudinary upload failed ({type(exc).__name__}).") from exc
    secure_url = result.get("secure_url") if isinstance(result, dict) else None
    if not isinstance(secure_url, str) or not secure_url.startswith("https://"):
        raise RuntimeError("Cloudinary did not return an HTTPS image URL.")
    return secure_url


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Upload available files and update matching MongoDB image fields.",
    )
    args = parser.parse_args()

    load_dotenv(BACKEND_DIR / ".env")
    upload_folder = Path(os.getenv("UPLOAD_FOLDER", "app/uploads"))
    if not upload_folder.is_absolute():
        upload_folder = BACKEND_DIR / upload_folder

    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        parser.error("MONGO_URI must be configured in backend/.env.")
    if args.apply:
        missing = [name for name in UPLOAD_FIELDS if not os.getenv(name)]
        if missing:
            parser.error(f"Cloudinary configuration is missing: {', '.join(missing)}.")
        cloudinary.config(
            cloud_name=os.environ["CLOUDINARY_CLOUD_NAME"],
            api_key=os.environ["CLOUDINARY_API_KEY"],
            api_secret=os.environ["CLOUDINARY_API_SECRET"],
            secure=True,
        )

    db_name = os.getenv("MONGO_DB_NAME", "prakash_medical_store")
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=10000)
    try:
        db = client[db_name]
        try:
            db.command("ping")
        except PyMongoError:
            parser.error("Could not connect to the configured MongoDB database.")
        cache = {}
        counts = {"available": 0, "missing": 0, "updated": 0, "conflicts": 0}

        def migrate_reference(kind, document, field, index, old_url, folder):
            filename = local_upload_filename(old_url)
            if not filename:
                return
            source = upload_folder / filename
            label = f"{kind} {document.get('_id')} image {filename}"
            if not source.is_file():
                counts["missing"] += 1
                print(f"MISSING {label}")
                return

            counts["available"] += 1
            print(f"AVAILABLE {label}")
            if not args.apply:
                return

            cache_key = (folder, filename)
            new_url = cache.get(cache_key)
            if not new_url:
                new_url = upload_local_file(source, folder)
                cache[cache_key] = new_url

            if index is None:
                result = db.staff.update_one(
                    {"_id": document["_id"], field: old_url},
                    {"$set": {field: new_url}},
                )
            else:
                result = db.products.update_one(
                    {"_id": document["_id"], f"{field}.{index}": old_url},
                    {"$set": {f"{field}.{index}": new_url}},
                )
            if result.matched_count:
                counts["updated"] += 1
                print(f"UPDATED {label}")
            else:
                counts["conflicts"] += 1
                print(f"CONFLICT {label}; database value changed, left untouched")

        for product in db.products.find({}, {"images": 1}):
            for index, image in enumerate(product.get("images", [])):
                migrate_reference(
                    "product",
                    product,
                    "images",
                    index,
                    image,
                    "products",
                )

        for person in db.staff.find({}, {"image": 1}):
            migrate_reference(
                "staff",
                person,
                "image",
                None,
                person.get("image"),
                "staff",
            )

        mode = "APPLY" if args.apply else "DRY RUN"
        print(
            f"{mode} complete: {counts['available']} available, "
            f"{counts['missing']} missing, {counts['updated']} updated, "
            f"{counts['conflicts']} conflicts."
        )
    finally:
        client.close()


if __name__ == "__main__":
    main()
