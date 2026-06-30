from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    slug: str


class CategoryResponse(CategoryBase):
    id: int

    model_config = {"from_attributes": True}
