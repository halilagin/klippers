
# flake8: noqa: E501
import asyncio
from fastapi import WebSocket, WebSocketDisconnect
import json
from app.actors.actor_chat import ActorChat
from app.schemas.schema_chat import ChatMessage
from fastapi import APIRouter
from app.schemas.schema_chat import WSConnection


router = APIRouter(prefix="/chat", tags=["chat"])

actor_chat = ActorChat.remote()
print("ActorChat remote instance created.")

# Dictionary to hold active WebSocket connections, keyed by clientId.
# This is used for sending messages directly to a specific client.
# ws_connection = active_connections[roomId][clientId]
active_connections: dict[str, dict[str, WSConnection]] = {}


@router.post("/message/{roomId}/{clientId}")
async def post_message(chat_message: ChatMessage, roomId: str, clientId: str):
    """
    Handles posting of a new message to the chat via REST API.
    The message is sent to an LLM and the reply is broadcasted back to the chat room.
    """
    print(f"Received from {chat_message.clientId}:", chat_message)
    # First, add the user's own message to the chat history and broadcast it.
    user_message_to_broadcast = await actor_chat.add_message.remote(roomId, clientId, chat_message)
    user_message_json = json.dumps({
        "clientId": user_message_to_broadcast.clientId,
        "message": user_message_to_broadcast.message,
        "timestamp": user_message_to_broadcast.timestamp,
        "roomId": user_message_to_broadcast.roomId
    })
    if roomId in active_connections:
        for ws_conn in active_connections[roomId].values():
            await ws_conn.queue.put(user_message_json)

    if chat_message.isTesting:
        pass
    else:
        pass

    # Add the LLM's reply to the chat history and broadcast it.
    llm_message_json = {}
    if roomId in active_connections:
        for ws_conn in active_connections[roomId].values():
            await ws_conn.queue.put(llm_message_json)

    return {"status": "message sent"}


@router.websocket("/ws/{roomId}/{clientId}")
async def websocket_endpoint(websocket: WebSocket, roomId: str, clientId: str):
    """
    Handles WebSocket connections for the chat room.

    Upon connection, it assigns a unique ID, sends chat history, and then
    concurrently manages receiving messages from the client and sending
    messages back to the client via its dedicated message queue.
    """
    await websocket.accept()
    if roomId not in active_connections:
        active_connections[roomId] = {}

    ws_conn = WSConnection(websocket=websocket, queue=asyncio.Queue(), clientId=clientId, roomId=roomId)
    active_connections[roomId][clientId] = ws_conn
    print(f"Client {clientId} connected to room {roomId}.")

    try:
        while True:
            # Wait for a message to be put into this client's queue.
            # This blocks until a message is available.
            message_to_send = await ws_conn.queue.get()
            await websocket.send_json(message_to_send)
    except WebSocketDisconnect:
        print(f"Client {clientId} disconnected from room {roomId}.")
    except Exception as e:
        print(f"An error occurred with client {clientId}: {e}")
    finally:
        # Clean up connection
        if roomId in active_connections and clientId in active_connections[roomId]:
            del active_connections[roomId][clientId]
            if not active_connections[roomId]:
                del active_connections[roomId]
        print(f"Resources for client {clientId} in room {roomId} cleaned up.")
