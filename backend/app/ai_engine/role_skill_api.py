import os
import time
from typing import List, Optional

import requests


def _get_env(name: str, default: Optional[str] = None) -> Optional[str]:
    value = os.getenv(name, default)
    return value if value not in (None, "") else default


class RoleSkillAPIClient:
    """Client to fetch role-specific skills from an external API."""

    def __init__(self):
        self.base_url = _get_env("ROLE_SKILL_API_URL")
        self.api_token = _get_env("ROLE_SKILL_API_TOKEN")
        self.cache_ttl = int(_get_env("ROLE_SKILL_API_CACHE_TTL_SECONDS", "3600"))
        self.cache = {}  # type: dict[str, tuple[float, List[str]]]
        self.session = requests.Session()

    def is_enabled(self) -> bool:
        return bool(self.base_url and self.api_token)

    def get_role_skills(self, role: str) -> Optional[List[str]]:
        if not self.is_enabled():
            return None

        role_key = role.strip().lower()
        cached = self.cache.get(role_key)
        now = time.time()
        if cached:
            timestamp, skills = cached
            if now - timestamp < self.cache_ttl:
                return skills

        try:
            url = self.base_url.rstrip("/")
            response = self.session.get(
                url,
                headers={
                    "Authorization": f"Bearer {self.api_token}",
                    "Accept": "application/json"
                },
                params={"role": role_key},
                timeout=6,
            )
            response.raise_for_status()
            data = response.json()

            if isinstance(data, dict) and "skills" in data and isinstance(data["skills"], list):
                skills = [str(item).strip() for item in data["skills"] if item]
            elif isinstance(data, list):
                skills = [str(item).strip() for item in data if item]
            else:
                return None

            if skills:
                self.cache[role_key] = (now, skills)
                return skills

        except requests.RequestException:
            return None

        return None
