def refine_search(client_criteria: dict[str, str]) -> dict:
    """Rechercher des arômes à partir des critères du client.

    Appeler à chaque nouvelle information du client sur ce qu'il recherche.
    En paramètre, passer tous les critères connus depuis le début
    de la conversation, pas seulement le dernier.

    Args:
        client_criteria: Critères du client, sous la forme nom du critère -> valeur.
            Par exemple : {"famille": "fruité", "sucrosité": "faible"}.

    Returns:
        aromas_remaining_number: Nombre d'arômes qui correspondent encore aux critères.
        next_criterion: Le critère sur lequel poser la prochaine question au client.
            Si vide, ne plus poser de question.
        aromas_list: Les arômes restants, remplie seulement s'il en reste 3 ou moins.
            Les présenter au client sans rien ajouter qui n'est pas dans la liste,
            ni prix, ni délai.
    """

    return {
        "aromas_remaining_number": 10,
        "next_criterion": "sucrosité",
        "aromas_list": [],
    }
