from fastapi.testclient import TestClient

REGISTER_URL = "/api/auth/register"
LOGIN_URL = "/api/auth/login"
ME_URL = "/api/auth/me"

TEST_USER = {
    "name": "Test User",
    "email": "test@funshop.com",
    "password": "testpassword123",
}


def test_register_returns_201(client: TestClient):
    response = client.post(REGISTER_URL, json=TEST_USER)
    assert response.status_code == 201


def test_register_returns_token(client: TestClient):
    response = client.post(REGISTER_URL, json=TEST_USER)
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"


def test_register_duplicate_email_returns_409(client: TestClient):
    client.post(REGISTER_URL, json=TEST_USER)
    response = client.post(REGISTER_URL, json=TEST_USER)
    assert response.status_code == 409


def test_register_invalid_email_returns_422(client: TestClient):
    response = client.post(REGISTER_URL, json={**TEST_USER, "email": "notanemail"})
    assert response.status_code == 422


def test_login_returns_200(client: TestClient):
    client.post(REGISTER_URL, json=TEST_USER)
    response = client.post(LOGIN_URL, json={"email": TEST_USER["email"], "password": TEST_USER["password"]})
    assert response.status_code == 200


def test_login_returns_token(client: TestClient):
    client.post(REGISTER_URL, json=TEST_USER)
    response = client.post(LOGIN_URL, json={"email": TEST_USER["email"], "password": TEST_USER["password"]})
    data = response.json()
    assert "access_token" in data


def test_login_wrong_password_returns_401(client: TestClient):
    client.post(REGISTER_URL, json=TEST_USER)
    response = client.post(LOGIN_URL, json={"email": TEST_USER["email"], "password": "wrongpassword"})
    assert response.status_code == 401


def test_login_wrong_email_returns_401(client: TestClient):
    response = client.post(LOGIN_URL, json={"email": "nobody@funshop.com", "password": "whatever"})
    assert response.status_code == 401


def test_get_me_with_valid_token(client: TestClient):
    token = client.post(REGISTER_URL, json=TEST_USER).json()["access_token"]
    response = client.get(ME_URL, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200


def test_get_me_response_shape(client: TestClient):
    token = client.post(REGISTER_URL, json=TEST_USER).json()["access_token"]
    data = client.get(ME_URL, headers={"Authorization": f"Bearer {token}"}).json()
    assert "id" in data
    assert "name" in data
    assert "email" in data
    assert "password" not in data


def test_get_me_without_token_returns_401(client: TestClient):
    response = client.get(ME_URL)
    assert response.status_code == 401


def test_get_me_with_invalid_token_returns_401(client: TestClient):
    response = client.get(ME_URL, headers={"Authorization": "Bearer faketoken123"})
    assert response.status_code == 401
