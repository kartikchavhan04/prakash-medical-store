"""Create or update the single store administrator using environment credentials."""
import os
import sys
from datetime import datetime, timezone

import bcrypt
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()
uri = os.getenv("MONGO_URI", "").strip()
db_name = os.getenv("MONGO_DB_NAME", "prakash_medical_store")
email = os.getenv("ADMIN_EMAIL", "").strip().lower()
password = os.getenv("ADMIN_PASSWORD", "")
name = os.getenv("ADMIN_NAME", "Prakash Medical Admin").strip()

if not uri or not email or len(password.encode("utf-8")) < 10 or len(password.encode("utf-8")) > 72:
    sys.exit("Set MONGO_URI, ADMIN_EMAIL, and ADMIN_PASSWORD (10–72 UTF-8 bytes) in backend/.env first.")

client = MongoClient(uri, serverSelectionTimeoutMS=10000)
client.admin.command("ping")
db = client[db_name]
hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
db.admins.update_one(
    {"email": email},
    {"$set": {"name": name, "email": email, "password_hash": hashed, "updated_at": datetime.now(timezone.utc)},
     "$setOnInsert": {"created_at": datetime.now(timezone.utc)}},
    upsert=True,
)
print(f"Admin account is ready for {email}")
client.close()
