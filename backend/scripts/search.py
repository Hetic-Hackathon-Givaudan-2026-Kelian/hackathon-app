import asyncio

from backend.services.data_client import search_sources


async def main() -> None:
    sources = await search_sources(
        "Je cherche quelque chose de plutôt sucrée et fruitée"
    )

    for source in sources:
        print(source)


asyncio.run(main())
