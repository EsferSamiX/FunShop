import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db
from app.models.category import Category
from app.models.product import Product

SQLITE_URL = "sqlite://"

engine = create_engine(
    SQLITE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSession()

    category = Category(name="Electronics", slug="electronics")
    db.add(category)
    db.flush()

    product = Product(
        title="Test Phone",
        description="A test phone product",
        price=299.99,
        thumbnail="https://example.com/phone.jpg",
        images=["https://example.com/phone.jpg"],
        stock=10,
        rating=4.5,
        category_id=category.id,
    )
    db.add(product)
    db.commit()
    db.close()

    yield

    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)
