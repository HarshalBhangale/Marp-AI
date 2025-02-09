import os
import sys
import time
from dotenv import load_dotenv

from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent

# Import CDP Agentkit Langchain Extension.
from cdp_langchain.agent_toolkits import CdpToolkit
from cdp_langchain.utils import CdpAgentkitWrapper
from cdp_langchain.tools import CdpTool
from pydantic import BaseModel, Field
from cdp import wallet
# from twitter_langchain import TwitterApiWrapper, TwitterToolkit  # Commented out Twitter integration
from langchain_community.tools import DuckDuckGoSearchRun

# Load environment variables
load_dotenv()

# Configure a file to persist the agent's CDP MPC Wallet Data.
wallet_data_file = "wallet_data.txt"


def read_script_file(file_path):
    """Read content from a script file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        print(f"Error reading script file {file_path}: {e}")
        return ""


def initialize_agent():
    """Initialize the agent with CDP Agentkit."""
    # Load API keys from environment
    openai_api_key = os.getenv("OPENAI_API_KEY")
    cdp_api_key_name = os.getenv("CDP_API_KEY_NAME")
    cdp_api_private_key = os.getenv("CDP_API_KEY_PRIVATE_KEY")
    cdp_api_private_key  = cdp_api_private_key .replace('\\n', '\n')
    # twitter_api_key = os.getenv("TWITTER_API_KEY")  # Commented out Twitter integration
    # twitter_api_secret = os.getenv("TWITTER_API_SECRET")

    if not openai_api_key:
        raise ValueError("Missing OpenAI API Key. Set OPENAI_API_KEY in .env")
    if not cdp_api_key_name or not cdp_api_private_key:
        raise ValueError("Missing CDP API credentials. Set them in .env")
    # if not twitter_api_key or not twitter_api_secret:
    #     raise ValueError("Missing Twitter API credentials. Set them in .env")

    # Initialize LLM with API key
    llm = ChatOpenAI(model="gpt-4o-mini", openai_api_key=openai_api_key)

    wallet_data = None

    if os.path.exists(wallet_data_file):
        with open(wallet_data_file) as f:
            wallet_data = f.read()

    values = {}
    if wallet_data is not None:
        # If there is a persisted agentic wallet, load it and pass to the CDP Agentkit Wrapper.
        values = {"cdp_wallet_data": wallet_data}

    # Initialize CDP Agentkit with API key
    agentkit = CdpAgentkitWrapper(api_key=cdp_api_key_name,api_private_key=cdp_api_private_key, **values)

    # Persist the agent's CDP MPC Wallet Data
    wallet_data = agentkit.export_wallet()
    with open(wallet_data_file, "w") as f:
        f.write(wallet_data)

    # Initialize CDP Agentkit Toolkit and get tools
    cdp_toolkit = CdpToolkit.from_cdp_agentkit_wrapper(agentkit)
    tools = cdp_toolkit.get_tools()

    # Initialize Twitter API with credentials (Commented out Twitter integration)
    # twitter_api_wrapper = TwitterApiWrapper(api_key=twitter_api_key, api_secret=twitter_api_secret)
    # twitter_toolkit = TwitterToolkit.from_twitter_api_wrapper(twitter_api_wrapper)
    # tools.extend(twitter_toolkit.get_tools())

    # Add DuckDuckGo search tool
    tools.append(DuckDuckGoSearchRun())

    # Store conversation history in memory
    memory = MemorySaver()
    config = {"configurable": {"thread_id": "CDP Agentkit Chatbot Example!"}}

    # Read script files
    script_files = [f"script{i}.txt" for i in range(1, 8)] + ["Tweets.txt"]
    scripts_content = {file: read_script_file(file) for file in script_files}

    # Create ReAct Agent
    return create_react_agent(
        llm,
        tools=tools,
        checkpointer=memory,
        state_modifier=(
            "You are a helpful agent acting as the persona of GPTony, an AI agent for the popular crypto YouTuber Tony Edward from Thinking Crypto. "
            "You are empowered to interact on-chain using your tools. If you ever need funds, you can request them from the faucet if you are on network ID `base-sepolia`. "
            "For additional context, you have access to the following script content from Tony's videos:\n\n" +
            "\n".join(f"{file.upper()}:\n'''\n{content}\n'''\n" for file, content in scripts_content.items()) +
            "If someone asks you to do something you can't do with your currently available tools, you must say so and encourage them to implement it themselves using the CDP SDK + Agentkit."
        ),
    ), config


# Autonomous Mode
def run_autonomous_mode(agent_executor, config, interval=10):
    """Run the agent autonomously with specified intervals."""
    print("Starting autonomous mode...")
    while True:
        try:
            thought = "Be creative and do something interesting on the blockchain."
            for chunk in agent_executor.stream({"messages": [HumanMessage(content=thought)]}, config):
                if "agent" in chunk:
                    print(chunk["agent"]["messages"][0].content)
                elif "tools" in chunk:
                    print(chunk["tools"]["messages"][0].content)
                print("-------------------")
            time.sleep(interval)
        except KeyboardInterrupt:
            print("Goodbye Agent!")
            sys.exit(0)


# Chat Mode
def run_chat_mode(agent_executor, config):
    """Run the agent interactively based on user input."""
    print("Starting chat mode... Type 'exit' to end.")
    while True:
        try:
            user_input = input("\nUser: ")
            if user_input.lower() == "exit":
                break
            for chunk in agent_executor.stream({"messages": [HumanMessage(content=user_input)]}, config):
                if "agent" in chunk:
                    print(chunk["agent"]["messages"][0].content)
                elif "tools" in chunk:
                    print(chunk["tools"]["messages"][0].content)
                print("-------------------")
        except KeyboardInterrupt:
            print("Goodbye Agent!")
            sys.exit(0)


# Mode Selection
def choose_mode():
    """Choose whether to run in autonomous or chat mode based on user input."""
    while True:
        print("\nAvailable modes:\n1. chat    - Interactive chat mode\n2. auto    - Autonomous action mode")
        choice = input("\nChoose a mode (enter number or name): ").lower().strip()
        if choice in ["1", "chat"]:
            return "chat"
        elif choice in ["2", "auto"]:
            return "auto"
        print("Invalid choice. Please try again.")


def main():
    """Start the chatbot agent."""
    agent_executor, config = initialize_agent()
    mode = choose_mode()
    if mode == "chat":
        run_chat_mode(agent_executor=agent_executor, config=config)
    elif mode == "auto":
        run_autonomous_mode(agent_executor=agent_executor, config=config)


if __name__ == "__main__":
    print("Starting Agent...")
    main()
