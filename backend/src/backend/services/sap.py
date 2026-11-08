_STOCKS: dict[str, int] = {
    "vanille bourbon": 500,
    "fraise des bois": 120,
    "citron de sicile": 0,
}


def get_stock(product_name: str) -> int | None:
    return _STOCKS.get(product_name.lower())
