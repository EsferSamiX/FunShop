from pydantic import BaseModel
from decimal import Decimal
from app.schemas.category import CategoryResponse


class ProductBase(BaseModel):
    title: str
    description: str
    price: Decimal
    thumbnail: str
    images: list[str] = []
    stock: int = 0
    rating: float = 0.0


class ProductResponse(ProductBase):
    id: int
    category: CategoryResponse

    model_config = {"from_attributes": True}


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    limit: int
    has_more: bool
