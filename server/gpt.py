import json
import os
import openai
import sys

p = []
for data in sys.argv[1:]:
    p.append(json.loads(data))

openai.api_key = "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"

# prompt = "Please generate a blog outline on how a beginner can break into the field of data science."

completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  # messages=[
  #   {"role": "system", "content": "You are a helpful assistant with extensive experience in data science and technical writing."},
  #   {"role": "user", "content": p}
  # ]
  messages = p
)

# print(completion.choices[0].message)
print(completion["choices"][0]["message"]["content"])
