"""
Load Testing for API Endpoints
Uses locust for load testing. Run with: locust -f tests/test_load.py

Install: pip install locust
Run: locust -f tests/test_load.py --host=http://localhost:5000
Web UI: http://localhost:8089

Note: This file is not run by pytest, only by locust directly.
"""
import random
import string

try:
    from locust import HttpUser, task, between, events
    LOCUST_AVAILABLE = True
except ImportError:
    LOCUST_AVAILABLE = False
    # Provide dummy classes for when locust is not installed
    class HttpUser:
        pass
    def task(weight=1):
        def decorator(func):
            return func
        return decorator
    def between(min_val, max_val):
        return 1


def random_string(length=10):
    """Generate random string for unique data"""
    return ''.join(random.choices(string.ascii_lowercase, k=length))


class BaseUser(HttpUser):
    """Base user class with authentication"""
    wait_time = between(1, 3)
    abstract = True
    
    def on_start(self):
        """Register and login on start"""
        username = f"loadtest_{random_string()}"
        email = f"{username}@example.com"
        password = "LoadTest@123!"
        
        # Register
        response = self.client.post("/api/auth/register", json={
            "username": username,
            "email": email,
            "password": password
        })
        
        if response.status_code == 201:
            data = response.json()
            self.token = data.get("access_token")
            self.headers = {"Authorization": f"Bearer {self.token}"}
        else:
            # Try login if user exists
            response = self.client.post("/api/auth/login", json={
                "email": email,
                "password": password
            })
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("access_token")
                self.headers = {"Authorization": f"Bearer {self.token}"}
            else:
                self.headers = {}


class ReadOnlyUser(BaseUser):
    """User that only reads content (browsing behavior)"""
    weight = 3  # 3x more likely than other users
    
    @task(5)
    def view_feed(self):
        """View story feed"""
        self.client.get("/api/posts/", 
            params={"page": 1, "per_page": 20},
            name="/api/posts/ [GET Feed]"
        )
    
    @task(3)
    def view_story(self):
        """View a specific story"""
        # First get feed to get story IDs
        response = self.client.get("/api/posts/", params={"per_page": 10})
        if response.status_code == 200:
            stories = response.json().get("stories", [])
            if stories:
                story_id = random.choice(stories)["id"]
                self.client.get(f"/api/posts/{story_id}",
                    name="/api/posts/[id] [GET Story]"
                )
    
    @task(2)
    def view_featured(self):
        """View featured stories"""
        self.client.get("/api/posts/featured",
            name="/api/posts/featured [GET Featured]"
        )
    
    @task(1)
    def search_stories(self):
        """Search for stories"""
        queries = ["life", "story", "journey", "experience", "lesson"]
        query = random.choice(queries)
        self.client.get("/api/posts/search",
            params={"q": query, "page": 1},
            name="/api/posts/search [GET Search]"
        )
    
    @task(1)
    def view_profile(self):
        """View own profile"""
        self.client.get("/api/auth/profile",
            headers=self.headers,
            name="/api/auth/profile [GET Profile]"
        )


class ActiveUser(BaseUser):
    """User that creates content and interacts"""
    weight = 1
    
    @task(2)
    def create_story(self):
        """Create a new story"""
        content = f"This is a load test story about {random_string(20)}. " * 5
        self.client.post("/api/posts",
            headers=self.headers,
            json={
                "title": f"Load Test Story {random_string(5)}",
                "content": content,
                "story_type": random.choice(["life_story", "achievement", "regret"]),
                "status": "published"
            },
            name="/api/posts [POST Create Story]"
        )
    
    @task(3)
    def react_to_story(self):
        """React to a story"""
        response = self.client.get("/api/posts/", params={"per_page": 10})
        if response.status_code == 200:
            stories = response.json().get("stories", [])
            if stories:
                story_id = random.choice(stories)["id"]
                reaction = random.choice(["heart", "applause", "bookmark", "hug", "inspiring"])
                self.client.post(f"/api/posts/{story_id}/toggle-react",
                    headers=self.headers,
                    json={"support_type": reaction},
                    name="/api/posts/[id]/toggle-react [POST React]"
                )
    
    @task(2)
    def comment_on_story(self):
        """Comment on a story"""
        response = self.client.get("/api/posts/", params={"per_page": 10})
        if response.status_code == 200:
            stories = response.json().get("stories", [])
            if stories:
                story_id = random.choice(stories)["id"]
                self.client.post(f"/api/posts/{story_id}/comments",
                    headers=self.headers,
                    json={
                        "content": f"Great story! {random_string(20)}",
                        "is_anonymous": random.choice([True, False])
                    },
                    name="/api/posts/[id]/comments [POST Comment]"
                )
    
    @task(1)
    def view_drafts(self):
        """View own drafts"""
        self.client.get("/api/posts/drafts",
            headers=self.headers,
            name="/api/posts/drafts [GET Drafts]"
        )
    
    @task(1)
    def get_stats(self):
        """Get user stats"""
        self.client.get("/api/auth/stats",
            headers=self.headers,
            name="/api/auth/stats [GET Stats]"
        )


class HeavyUser(BaseUser):
    """User that performs heavy operations"""
    weight = 1
    
    @task(1)
    def pagination_stress(self):
        """Test pagination with various page sizes"""
        for page in range(1, 5):
            self.client.get("/api/posts/",
                params={"page": page, "per_page": 50},
                name="/api/posts/ [GET Paginated]"
            )
    
    @task(1)
    def category_filter(self):
        """Test category filtering"""
        categories = ["achievement", "regret", "unsent_letter", "sacrifice", "life_story", "other"]
        for category in categories:
            self.client.get(f"/api/posts/category/{category}",
                params={"per_page": 20},
                name="/api/posts/category/[type] [GET Category]"
            )


# Event hooks for reporting
@events.request.add_listener
def on_request(request_type, name, response_time, response_length, exception, **kwargs):
    """Log slow requests"""
    if response_time > 2000:  # Log requests over 2 seconds
        print(f"SLOW: {name} took {response_time}ms")


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Print summary after test"""
    print("\n" + "=" * 50)
    print("LOAD TEST COMPLETE")
    print("=" * 50)
