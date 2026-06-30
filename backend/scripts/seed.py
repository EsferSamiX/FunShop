import sys
import os
import urllib.request
import json

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.core.database import SessionLocal
from app.models.category import Category
from app.models.product import Product


DUMMYJSON_URL = "https://dummyjson.com/products?limit=100&skip=0"


def fetch_products() -> dict:
    req = urllib.request.Request(
        DUMMYJSON_URL,
        headers={"User-Agent": "Mozilla/5.0"}
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())


def seed():
    db = SessionLocal()

    try:
        if db.query(Product).count() > 0:
            print("Database already seeded. Skipping.")
            return

        print("Fetching products from DummyJSON...")
        data = fetch_products()
        products = data["products"]

        category_map: dict[str, Category] = {}

        print("Seeding categories...")
        for item in products:
            cat_name: str = item["category"]
            slug: str = cat_name.lower().replace(" ", "-").replace("'", "")

            if slug not in category_map:
                category = Category(name=cat_name.replace("-", " ").title(), slug=slug)
                db.add(category)
                db.flush()
                category_map[slug] = category

        print("Seeding products...")
        for item in products:
            cat_name: str = item["category"]
            slug: str = cat_name.lower().replace(" ", "-").replace("'", "")
            category = category_map[slug]

            product = Product(
                title=item["title"],
                description=item["description"],
                price=item["price"],
                thumbnail=item["thumbnail"],
                images=item.get("images", []),
                stock=item.get("stock", 0),
                rating=item.get("rating", 0.0),
                category_id=category.id,
            )
            db.add(product)

        db.commit()
        print(f"Done. {len(products)} products and {len(category_map)} categories seeded.")

    except Exception as e:
        db.rollback()
        print(f"Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
