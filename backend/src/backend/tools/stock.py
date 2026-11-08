from backend.services import sap


def check_stock(product_name: str) -> dict:
    """Vérifie le stock disponible d'un arôme dans l'entrepôt.

    Args:
        product_name: Nom de l'arôme, par exemple "vanille bourbon".
    """

    quantity = sap.get_stock(product_name)

    if quantity is None:
        return {"found": False, "product": product_name}
    return {"found": True, "product": product_name, "quantity_kg": quantity}
