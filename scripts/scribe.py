"""ElevenLabs Scribe word timings (from clipforge tools/stt/elevenlabs.py).
usage: ELEVENLABS_API_KEY=... python scripts/scribe.py <audio> [out.json] [lang]   (key via env or ENV_FILE=path/.env)"""
import json, os, sys, requests

audio = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else "assets/tokens3/scribe_words.json"
lang = sys.argv[3] if len(sys.argv) > 3 else "ru"
if os.environ.get("ENV_FILE"):
    for line in open(os.environ["ENV_FILE"]):
        if "=" in line and not line.startswith("#"): k, v = line.split("=", 1); os.environ.setdefault(k.strip(), v.strip())
model = os.environ.get("SCRIBE_MODEL", "scribe_v2")
with open(audio, "rb") as f:
    r = requests.post("https://api.elevenlabs.io/v1/speech-to-text", headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"]},
                      data={"model_id": model, "tag_audio_events": "true", "timestamps_granularity": "word", "language_code": lang},
                      files={"file": f}, timeout=900)
r.raise_for_status(); j = r.json()
words = [{"w": x["text"], "s": round(x["start"], 3), "e": round(x["end"], 3), **({"ev": 1} if x["type"] == "audio_event" else {})}
         for x in j["words"] if x["type"] != "spacing"]
json.dump({"model": model, "audio": os.path.basename(audio), "text": j.get("text"), "words": words}, open(out, "w"), ensure_ascii=False, indent=0)
print(out, len(words), "words")
