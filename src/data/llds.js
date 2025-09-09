// src/data/llds.js
// Data model for LLD (Low Level Design) projects.
// Each project contains a description and an array of files. Each file has:
// { name: string, language: string, content: string, type?: 'code' | 'markdown' }
// Replace placeholder content with real implementations. You can also generate
// this file programmatically if you have a folder of LLD projects.

const lldProjects = {
  'URL Shortener': {
    description: 'Design a scalable URL shortening service similar to TinyURL. Focus areas: hashing strategy, storage model, expiration, analytics, and redirection performance.',
    files: [
      {
        name: 'README.md',
        language: 'markdown',
        type: 'markdown',
        content: `# URL Shortener LLD\n\n**Goal**: Convert long URLs to short tokens and redirect efficiently.\n\n**Key Components**:\n- API Layer (Create / Resolve)\n- Token Generator (Base62 + collision handling)\n- Storage (Key-Value / SQL)\n- Cache Layer (Redis)\n- Analytics (click tracking)\n\n**Class Diagram (Conceptual)**:\n\n\n**Improvements**:\n- Add rate limiting\n- Add custom aliases\n- Add batch shortening\n`
      },
      {
        name: 'models.py',
        language: 'python',
        content: `from dataclasses import dataclass, field\nfrom datetime import datetime, timedelta\nfrom typing import Optional\n\n@dataclass\nclass UrlMapping:\n    token: str\n    long_url: str\n    created_at: datetime = field(default_factory=datetime.utcnow)\n    expires_at: Optional[datetime] = None\n    visit_count: int = 0\n\n    def is_expired(self) -> bool:\n        return self.expires_at is not None and datetime.utcnow() > self.expires_at\n`
      },
      {
        name: 'service.py',
        language: 'python',
        content: `import random, string\nfrom typing import Optional\nfrom models import UrlMapping\n\nclass InMemoryStore:\n    def __init__(self):\n        self._by_token = {}\n\n    def save(self, mapping: UrlMapping):\n        self._by_token[mapping.token] = mapping\n        return mapping\n\n    def get(self, token: str) -> Optional[UrlMapping]:\n        return self._by_token.get(token)\n\nclass UrlShortenerService:\n    def __init__(self, store: InMemoryStore, token_length: int = 7):\n        self.store = store\n        self.token_length = token_length\n\n    def _generate_token(self) -> str:\n        alphabet = string.ascii_letters + string.digits\n        return ''.join(random.choice(alphabet) for _ in range(self.token_length))\n\n    def shorten(self, long_url: str) -> UrlMapping:\n        token = self._generate_token()\n        # NOTE: Add collision handling for production systems\n        mapping = UrlMapping(token=token, long_url=long_url)\n        return self.store.save(mapping)\n\n    def resolve(self, token: str) -> Optional[str]:\n        mapping = self.store.get(token)\n        if not mapping or mapping.is_expired():\n            return None\n        mapping.visit_count += 1\n        return mapping.long_url\n`
      }
    ]
  },
  'In-Memory Cache': {
    description: 'Design an LRU based in-memory cache supporting O(1) get/set with eviction.',
    files: [
      {
        name: 'README.md',
        language: 'markdown',
        type: 'markdown',
        content: `# In-Memory Cache (LRU)\n\n**Goal**: Provide O(1) get/set with eviction policy.\n\n**Core Ideas**:\n- Doubly linked list to track recency\n- Hash map for O(1) lookups\n- Optional TTL per entry\n\n**Extensions**:\n- LFU hybrid\n- Metrics hooks\n- Sharding for scale\n`
      },
      {
        name: 'lru_cache.py',
        language: 'python',
        content: `class Node:\n    __slots__ = (\"key\", \"value\", \"prev\", \"next\")\n    def __init__(self, key, value):\n        self.key = key\n        self.value = value\n        self.prev = None\n        self.next = None\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        assert capacity > 0\n        self.capacity = capacity\n        self.map = {}\n        # Sentinel nodes\n        self.head = Node(None, None)\n        self.tail = Node(None, None)\n        self.head.next = self.tail\n        self.tail.prev = self.head\n\n    def _add_front(self, node: Node):\n        node.next = self.head.next\n        node.prev = self.head\n        self.head.next.prev = node\n        self.head.next = node\n\n    def _remove(self, node: Node):\n        node.prev.next = node.next\n        node.next.prev = node.prev\n\n    def _move_front(self, node: Node):\n        self._remove(node)\n        self._add_front(node)\n\n    def get(self, key):\n        node = self.map.get(key)\n        if not node: return -1\n        self._move_front(node)\n        return node.value\n\n    def put(self, key, value):\n        node = self.map.get(key)\n        if node:\n            node.value = value\n            self._move_front(node)\n            return\n        if len(self.map) == self.capacity:\n            # Evict LRU\n            lru = self.tail.prev\n            self._remove(lru)\n            del self.map[lru.key]\n        new_node = Node(key, value)\n        self.map[key] = new_node\n        self._add_front(new_node)\n`
      }
    ]
  }
};

export default lldProjects;
