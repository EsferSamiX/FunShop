from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from fastapi import HTTPException, status

from app.models.product import Product
from app.models.category import Category
from app.schemas.product import ProductListResponse, ProductResponse


def get_products(
    db: Session,
    page: int = 1,
    limit: int = 20,
    search: str | None = None,
    category: str | None = None,
) -> ProductListResponse:
    query = db.query(Product).join(Category).options(joinedload(Product.category))

    if search:
        query = query.filter(Product.title.ilike(f"%{search}%"))

    if category:
        query = query.filter(Category.slug == category)

    total = query.with_entities(func.count(Product.id)).scalar()

    items = query.offset((page - 1) * limit).limit(limit).all()

    return ProductListResponse(
        items=[ProductResponse.model_validate(item) for item in items],
        total=total,
        page=page,
        limit=limit,
        has_more=(page * limit) < total,
    )


def get_product_by_id(db: Session, product_id: int) -> ProductResponse:
    product = (
        db.query(Product)
        .options(joinedload(Product.category))
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found",
        )

    return ProductResponse.model_validate(product)


def get_categories(db: Session) -> list[Category]:
    return db.query(Category).order_by(Category.name).all()
