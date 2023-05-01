import json
import urllib.request

def message(messages):
    api_endpoint = 'https://api.openai.com/v1/completions'
    data = {
        'model': 'gpt-3.5-turbo',
        'prompt': {
            'text': '\n'.join(messages),
            'user': 'user'
        },
        'max_tokens': 150,
        'temperature': 0.7,
        'n': 1,
        'stop': '\n'
    }
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + os.environ['OPEN_AI_API']
    }
    req = urllib.request.Request(api_endpoint, json.dumps(data).encode('utf-8'), headers)
    response = urllib.request.urlopen(req)
    return json.loads(response.read().decode('utf-8'))
