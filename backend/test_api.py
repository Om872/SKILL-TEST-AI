import requests
import json

API_KEY = "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"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "HTTP-Referer": "http://localhost:5000",
    "X-Title": "SkillTest AI",
    "Content-Type": "application/json"
}

models_to_test = [
    "meta-llama/llama-4-scout:free",
    "google/gemini-2.0-flash-exp:free",
    "deepseek/deepseek-chat-v3-0324:free",
    "qwen/qwen3-8b:free",
]

print("=" * 60)
print("OpenRouter API Key Test")
print("=" * 60)

for model in models_to_test:
    print(f"\n[TEST] Model: {model}")
    try:
        resp = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json={
                "model": model,
                "messages": [{"role": "user", "content": "Say hello in one word."}]
            },
            timeout=20
        )
        print(f"   Status: {resp.status_code}")
        body = resp.json()
        if resp.status_code == 200:
            content = body['choices'][0]['message']['content']
            print(f"   SUCCESS! Response: {content[:80]}")
        else:
            print(f"   FAILED: {body}")
    except Exception as e:
        print(f"   EXCEPTION: {e}")

print("\n" + "=" * 60)
print("Checking account info...")
resp = requests.get(
    "https://openrouter.ai/api/v1/auth/key",
    headers=headers
)
print(f"Account Info: {json.dumps(resp.json(), indent=2)}")
