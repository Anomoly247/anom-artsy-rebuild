from dataclasses import dataclass
from decimal import Decimal

@dataclass
class CatalogItem:
    id: int
    slug: str
    status: str
    guardian_status: str
    price: Decimal

@dataclass
class Entitlement:
    user_id: int
    item_id: int

class MockEconomy:
    def __init__(self):
        self.balance = {7: Decimal("100")}
        self.catalog = [
            CatalogItem(1, "cyan-thread-glow", "published", "approved", Decimal("25")),
            CatalogItem(2, "moonberry-background", "published", "approved", Decimal("40")),
            CatalogItem(3, "pending-background", "published", "pending", Decimal("10")),
            CatalogItem(4, "rejected-glow", "published", "rejected", Decimal("5")),
        ]
        self.entitlements: list[Entitlement] = []
        self.coin_events: list[tuple[int, str, Decimal]] = []
        self.social_good_events: list[tuple[int, int]] = []

    def list_catalog(self):
        return [item for item in self.catalog if item.status == "published" and item.guardian_status == "approved"]

    def unlock(self, user_id: int, item_id: int):
        item = next((item for item in self.catalog if item.id == item_id), None)
        assert item is not None, "unknown catalog item must fail"
        assert item.status == "published" and item.guardian_status == "approved", "unapproved item must fail"
        existing = next((e for e in self.entitlements if e.user_id == user_id and e.item_id == item_id), None)
        if existing:
            return existing, True
        assert self.balance[user_id] >= item.price, "insufficient balance must fail"
        self.balance[user_id] -= item.price
        self.coin_events.append((user_id, "spend", item.price))
        entitlement = Entitlement(user_id, item_id)
        self.entitlements.append(entitlement)
        return entitlement, False


def main():
    economy = MockEconomy()
    catalog = economy.list_catalog()
    assert [item.slug for item in catalog] == ["cyan-thread-glow", "moonberry-background"]

    before_social = list(economy.social_good_events)
    first, already_owned = economy.unlock(7, 1)
    assert first.item_id == 1 and already_owned is False
    assert economy.balance[7] == Decimal("75")
    assert len(economy.coin_events) == 1
    assert economy.social_good_events == before_social

    second, already_owned = economy.unlock(7, 1)
    assert second.item_id == 1 and already_owned is True
    assert economy.balance[7] == Decimal("75")
    assert len(economy.coin_events) == 1

    for blocked_id in (3, 4):
        try:
            economy.unlock(7, blocked_id)
        except AssertionError:
            pass
        else:
            raise AssertionError("blocked catalog item unlocked")
    assert len(economy.entitlements) == 1

    economy.balance[7] = Decimal("10")
    try:
        economy.unlock(7, 2)
    except AssertionError:
        pass
    else:
        raise AssertionError("insufficient balance unlocked an item")
    assert len(economy.entitlements) == 1
    assert len(economy.coin_events) == 1
    assert economy.social_good_events == before_social
    print("MOCK ECONOMY PASS: catalog filter, unlock, duplicate ownership, blocked review states, insufficient balance, and Social Good separation")


if __name__ == "__main__":
    main()
