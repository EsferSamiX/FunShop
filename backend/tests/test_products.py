from fastapi.testclient import TestClient


def test_get_products_returns_200(client: TestClient):
    response = client.get("/api/products")
    assert response.status_code == 200


def test_get_products_response_shape(client: TestClient):
    response = client.get("/api/products")
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "limit" in data
    assert "has_more" in data


def test_get_products_default_pagination(client: TestClient):
    response = client.get("/api/products")
    data = response.json()
    assert data["page"] == 1
    assert data["limit"] == 20
    assert data["total"] >= 1


def test_get_products_search_filter(client: TestClient):
    response = client.get("/api/products?search=Test Phone")
    data = response.json()
    assert data["total"] >= 1
    assert any("Test Phone" in item["title"] for item in data["items"])


def test_get_products_search_no_results(client: TestClient):
    response = client.get("/api/products?search=xyznotexist999")
    data = response.json()
    assert data["total"] == 0
    assert data["items"] == []


def test_get_products_category_filter(client: TestClient):
    response = client.get("/api/products?category=electronics")
    data = response.json()
    assert data["total"] >= 1
    assert all(item["category"]["slug"] == "electronics" for item in data["items"])


def test_get_products_invalid_page(client: TestClient):
    response = client.get("/api/products?page=0")
    assert response.status_code == 422


def test_get_products_invalid_limit(client: TestClient):
    response = client.get("/api/products?limit=999")
    assert response.status_code == 422


def test_get_product_by_id_returns_200(client: TestClient):
    products = client.get("/api/products").json()["items"]
    product_id = products[0]["id"]

    response = client.get(f"/api/products/{product_id}")
    assert response.status_code == 200


def test_get_product_by_id_response_shape(client: TestClient):
    products = client.get("/api/products").json()["items"]
    product_id = products[0]["id"]

    data = client.get(f"/api/products/{product_id}").json()
    assert "id" in data
    assert "title" in data
    assert "price" in data
    assert "category" in data
    assert "slug" in data["category"]


def test_get_product_not_found(client: TestClient):
    response = client.get("/api/products/99999")
    assert response.status_code == 404
