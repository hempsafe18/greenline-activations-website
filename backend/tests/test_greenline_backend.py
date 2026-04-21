"""Backend tests for Greenline Activations commerce flow."""
import os
import pytest
import requests

BASE_URL = os.environ.get("NEXT_PUBLIC_BACKEND_URL", "https://ff6a1df0-4c2f-4643-a00b-791d47270247.preview.emergentagent.com").rstrip("/")


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Banner / tiers ----------
class TestBanner:
    def test_root(self, api):
        r = api.get(f"{BASE_URL}/")
        assert r.status_code == 200
        assert r.json().get("service") == "Greenline Activations API"

    def test_api_root(self, api):
        r = api.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert r.json().get("service") == "Greenline Activations API"

    def test_tiers(self, api):
        r = api.get(f"{BASE_URL}/api/tiers")
        assert r.status_code == 200
        tiers = r.json()["tiers"]
        ids = [t["id"] for t in tiers]
        assert ids == ["test_sprint", "sprint_1", "sprint_2", "sprint_3"]
        price_map = {t["id"]: t["price_per"] for t in tiers}
        assert price_map["test_sprint"] == 200.00
        assert price_map["sprint_1"] == 190.00
        assert price_map["sprint_2"] == 180.00
        assert price_map["sprint_3"] == 165.00


# ---------- Quote pricing ----------
class TestQuote:
    def test_quote_sprint_1_qty_20(self, api):
        r = api.post(f"{BASE_URL}/api/quote", json={"items": [{"tier_id": "sprint_1", "qty": 20}]})
        assert r.status_code == 200
        data = r.json()
        assert data["subtotal"] == 3800
        li = data["line_items"][0]
        assert li["price_per"] == 190
        assert li["tier_id"] == "sprint_1"
        assert li["upsell"] is None

    def test_quote_gap_qty_8(self, api):
        r = api.post(f"{BASE_URL}/api/quote", json={"items": [{"tier_id": "test_sprint", "qty": 8}]})
        assert r.status_code == 200
        li = r.json()["line_items"][0]
        assert li["tier_id"] == "test_sprint"
        assert li["subtotal"] == 1600
        assert li["upsell"] is not None
        assert li["upsell"]["next_tier_id"] == "sprint_1"

    def test_quote_sprint_2_qty_35(self, api):
        r = api.post(f"{BASE_URL}/api/quote", json={"items": [{"tier_id": "sprint_2", "qty": 35}]})
        assert r.status_code == 200
        li = r.json()["line_items"][0]
        assert li["tier_id"] == "sprint_2"
        assert li["price_per"] == 180
        assert li["subtotal"] == 6300

    def test_quote_sprint_3_qty_75(self, api):
        r = api.post(f"{BASE_URL}/api/quote", json={"items": [{"tier_id": "sprint_3", "qty": 75}]})
        assert r.status_code == 200
        li = r.json()["line_items"][0]
        assert li["tier_id"] == "sprint_3"
        assert li["price_per"] == 165
        assert li["subtotal"] == 12375

    def test_quote_invalid_tier(self, api):
        r = api.post(f"{BASE_URL}/api/quote", json={"items": [{"tier_id": "bogus_tier", "qty": 20}]})
        assert r.status_code == 400

    def test_quote_server_recomputes_tier(self, api):
        """Send wrong tier_id for qty; server auto-picks the right tier."""
        r = api.post(f"{BASE_URL}/api/quote", json={"items": [{"tier_id": "test_sprint", "qty": 75}]})
        assert r.status_code == 200
        li = r.json()["line_items"][0]
        # server recomputed, so should be sprint_3 tier at 165/ea
        assert li["tier_id"] == "sprint_3"
        assert li["price_per"] == 165


# ---------- Checkout ----------
ORDER_CONTEXT = {}


class TestCheckout:
    def test_create_checkout_with_brief(self, api):
        payload = {
            "items": [{"tier_id": "sprint_1", "qty": 20}],
            "origin_url": BASE_URL,
            "skip_details": False,
            "event_brief": {
                "brand_name": "TEST_Brand",
                "contact_name": "TEST User",
                "contact_email": "test@example.com",
                "contact_phone": "555-1234",
                "product_skus": "Sparkling Citrus 12oz",
                "preferred_start_date": "2026-03-01",
                "preferred_end_date": "2026-04-01",
                "locations": "Miami, Tampa",
                "staffing_notes": "",
                "additional_notes": "",
            },
        }
        r = api.post(f"{BASE_URL}/api/checkout/session", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "checkout.stripe.com" in data["url"]
        assert data["subtotal"] == 3800.0
        assert data["session_id"]
        assert data["order_id"]
        ORDER_CONTEXT["order_id"] = data["order_id"]
        ORDER_CONTEXT["session_id"] = data["session_id"]

    def test_invalid_tier_rejected(self, api):
        # invalid qty (0) should be rejected by pydantic validation (422)
        payload = {
            "items": [{"tier_id": "sprint_1", "qty": 0}],
            "origin_url": BASE_URL,
        }
        r = api.post(f"{BASE_URL}/api/checkout/session", json=payload)
        assert r.status_code in (400, 422)

    def test_checkout_skip_details_empty_brief(self, api):
        payload = {
            "items": [{"tier_id": "test_sprint", "qty": 3}],
            "origin_url": BASE_URL,
            "skip_details": True,
        }
        r = api.post(f"{BASE_URL}/api/checkout/session", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "checkout.stripe.com" in data["url"]
        assert data["subtotal"] == 600.0

    def test_empty_cart_rejected(self, api):
        r = api.post(f"{BASE_URL}/api/checkout/session", json={"items": [], "origin_url": BASE_URL})
        assert r.status_code == 400

    def test_checkout_status(self, api):
        if "session_id" not in ORDER_CONTEXT:
            pytest.skip("checkout not created")
        r = api.get(f"{BASE_URL}/api/checkout/status/{ORDER_CONTEXT['session_id']}")
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["session_id"] == ORDER_CONTEXT["session_id"]
        assert data["status"] in ("open", "complete", "expired")
        assert data["payment_status"] in ("unpaid", "paid", "initiated", "no_payment_required")
        assert data["currency"] == "usd"
        # amount_total is in cents typically
        assert data["amount_total"] is not None

    def test_get_order(self, api):
        if "order_id" not in ORDER_CONTEXT:
            pytest.skip("order not created")
        r = api.get(f"{BASE_URL}/api/orders/{ORDER_CONTEXT['order_id']}")
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["order_id"] == ORDER_CONTEXT["order_id"]
        assert data["subtotal"] == 3800.0
        assert len(data["line_items"]) == 1
        assert data["line_items"][0]["tier_id"] == "sprint_1"
        assert data["event_brief"]["brand_name"] == "TEST_Brand"

    def test_get_order_not_found(self, api):
        r = api.get(f"{BASE_URL}/api/orders/nonexistent-id-xxx")
        assert r.status_code == 404


# ---------- Onboarding ----------
class TestOnboarding:
    def test_onboarding_request(self, api):
        payload = {
            "order_id": ORDER_CONTEXT.get("order_id", "test-order"),
            "name": "TEST User",
            "email": "test@example.com",
            "phone": "555-0000",
            "preferred_times": "Weekdays 2-5pm ET",
            "notes": "TEST note",
        }
        r = api.post(f"{BASE_URL}/api/onboarding/request", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["ok"] is True
