from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    neo4j_uri: str = "bolt://neo4j:7687"
    neo4j_username: str = "neo4j"
    neo4j_password: str = "navpass"

    class Config:
        env_prefix = ""
        env_file = ".env"


settings = Settings()
