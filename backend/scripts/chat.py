import asyncio

from backend.agent.factory import build_agent


async def main() -> None:
    agent = build_agent()
    async for event in agent.run("Combien de vanille bourbon avez-vous en stock ?", history=[]):
        print(event)


asyncio.run(main())