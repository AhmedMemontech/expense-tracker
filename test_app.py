from app import app


def test_health_check():
    client = app.test_client()

    response = client.get("/health")

    assert response.status_code == 200
    assert response.get_json()["status"] == "OK"


def test_view_expense_list():
    client = app.test_client()

    response = client.get("/items")

    assert response.status_code == 200
    assert isinstance(response.get_json(), list)