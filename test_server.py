#!/usr/bin/env python3
"""
Simple test WebSocket server to debug connection issues
"""

import asyncio
import websockets
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def handle_client(websocket, path):
    logger.info(f"New connection from {websocket.remote_address} to {path}")
    try:
        async for message in websocket:
            logger.info(f"Received: {message}")
            await websocket.send(f"Echo: {message}")
    except websockets.exceptions.ConnectionClosed:
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"Error: {e}")

async def main():
    logger.info("Starting test WebSocket server on 127.0.0.1:7777")
    
    server = await websockets.serve(
        handle_client,
        "127.0.0.1",
        7777,
        ping_interval=20,
        ping_timeout=10
    )
    
    logger.info("✅ Test server running on ws://127.0.0.1:7777")
    
    try:
        await server.wait_closed()
    except KeyboardInterrupt:
        logger.info("Server stopped by user")

if __name__ == "__main__":
    asyncio.run(main())
