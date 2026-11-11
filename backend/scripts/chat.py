import asyncio

from backend.agent.factory import build_agent


async def main() -> None:
    agent = build_agent()
    async for event in agent.run(
        "Bonjour ! Je cherche un arôme assez sucrée et avec un goût qui se rapproche de la vanille ",
        history=[],
    ):
        print(event)


asyncio.run(main())
