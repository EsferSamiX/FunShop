from fastapi.testclient import TestClient


def test_get_categories_returns_200(client: TestClient):
    response = client.get("/api/categories")
    assert response.status_code == 200


def test_get_categories_returns_list(client: TestClient):
    response = client.get("/api/categories")
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_get_categories_response_shape(client: TestClient):
    response = client.get("/api/categories")
    category = response.json()[0]
    assert "id" in category
    assert "name" in category
    assert "slug" in category


def test_get_categories_has_seeded_category(client: TestClient):
    response = client.get("/api/categories")
    slugs = [cat["slug"] for cat in response.json()]
    assert "electronics" in slugs
