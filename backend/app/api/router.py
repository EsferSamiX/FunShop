from fastapi import APIRouter
from app.api import products, auth

api_router = APIRouter(prefix="/api")

api_router.include_router(products.router)
api_router.include_router(auth.router)
