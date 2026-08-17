from dataclasses import dataclass
from decimal import Decimal

@dataclass
class Plan:
    slug: str
    status: str

@dataclass
class Item:
    id: int
    slug: str
    status: str
    guardian_status: str
    price: Decimal

class MockStoreApi:
    def __init__(self):
        self.plans = [
            Plan("guardian-apprentice", "draft"),
            Plan("world-builder", "draft"),
            Plan("universe-guardian", "draft"),
            Plan("published-review-plan", "published"),
        ]
        self.items = [
            Item(1, "moonberry-background", "published", "pending", Decimal("40")),
            Item(2, "cyan-thread-glow", "published", "approved", Decimal("25")),
            Item(3, "rejected-glow", "published", "rejected", Decimal("5")),
        ]
        self.entitlements = []

    def list_membership_plans(self):
        return [plan for plan in self.plans if plan.status == "published"]

    def list_catalog(self):
        return [item for item in self.items if item.status == "published" and item.guardian_status == "approved"]

    def unlock(self, user_id: int, item_id: int):
        item = next(item for item in self.items if item.id == item_id)
        if item.status != "published" or item.guardian_status != "approved":
            raise ValueError("Catalog item is not available")
        existing = next((row for row in self.entitlements if row == (user_id, item_id)), None)
        if existing:
            return {"alreadyOwned": True, "entitlement": existing}
        entitlement = (user_id, item_id)
        self.entitlements.append(entitlement)
        return {"alreadyOwned": False, "entitlement": entitlement}

def main():
    api = MockStoreApi()
    assert [plan.slug for plan in api.list_membership_plans()] == ["published-review-plan"]
    assert [item.slug for item in api.list_catalog()] == ["cyan-thread-glow"]
    try:
        api.unlock(7, 1)
    except ValueError:
        pass
    else:
        raise AssertionError("Guardian-pending Moonberry item was unlockable")
    first = api.unlock(7, 2)
    assert first["alreadyOwned"] is False
    second = api.unlock(7, 2)
    assert second["alreadyOwned"] is True
    assert len(api.entitlements) == 1
    print("MOCK STORE API PASS: membership visibility, Guardian-pending filter, approved unlock, and idempotent entitlement")

if __name__ == "__main__":
    main()
