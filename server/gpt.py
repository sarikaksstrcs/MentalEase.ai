import json
import os
from openai import OpenAI
import sys


p = []
for data in sys.argv[1:]:
    p.append(json.loads(data))
    # print(f"data:{p}")

client = OpenAI(
  api_key='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',  
)

# prompt = "Please generate a blog outline on how a beginner can break into the field of data science."

response = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=p
)

generated_text = response.choices[0].message.content

print(generated_text)
