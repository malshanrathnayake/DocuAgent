import os
from dotenv import load_dotenv

def load_env():
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env'))
    load_dotenv(dotenv_path=env_path)
