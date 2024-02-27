import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from speechrec import recognize_malayalam_speech
from translator import translate_malayalam_to_english, translate_english_to_malayalam_using_mtrans
from malayalam_text_to_speech_web import text_to_speech
from openai import OpenAI

import pickle
import torch
import numpy as np
from transformers import BertTokenizer

from Sentiment_Analysis import preprocessing,predict

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
tokenizer = BertTokenizer.from_pretrained(
    'bert-base-uncased',
    do_lower_case = True
    )

with open('apisever\Models\mental-model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)
    
token_id = []
attention_masks = []

app = Flask(__name__)
CORS(app)

client = OpenAI(
api_key='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',  
)

name = None
p = [{"role": "system", "content": "You are a mental health therapist named mellisa. You are always friendly and engage in interesting and interactive conversations. You always act like a human and never say that you cannot do something. You never say things like As a AI I cannot. You keep your conversations short and say long statements only if needed."}]

@app.route('/predict', methods=['POST'])
def predict_route():
    data = request.get_json()
    new_sentence = data['sentence']
    prediction = predict(new_sentence,model,tokenizer)
    print(prediction)
    return jsonify({"prediction": prediction})


@app.route('/malaudiotoengtext', methods=['POST'])
def malaudioconverter():
    try:
        maltext = recognize_malayalam_speech()
        english_text = translate_malayalam_to_english(maltext)
        print(english_text)
        response = jsonify({"english_text": english_text,
                            "malayalam_text": maltext})
        print(response)
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/engtexttomalaudio', methods=['POST'])
def engtextconverter():
    try:
        mal_text = request.get_json()
        print("MAlayalam text : ",mal_text)
        mal_text = mal_text['malayalam_text']
        print(mal_text)
        text_to_speech(mal_text)
        return jsonify({"status":"success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/gptinterface', methods=['POST'])
def gptoutput():
    try:
        input_text = request.get_json()
        print("At backend: ",input_text)
        input_text = input_text['content']       
        
        def gpt_request(p):
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=p
                )
            gpt_response =response.choices[0].message.content     
            p.append({"role": "assistant", "content": f"{gpt_response}"},)

            return gpt_response
        gpt_input = p.append({"role": "user", "content": f"{input_text}"})
        gpt_response = gpt_request(p)
        mal_text = translate_english_to_malayalam_using_mtrans(gpt_response)
        return jsonify({"gptresponse":mal_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/maltextResponse', methods=['POST'])
def maltextResponse():
    try:        
        def gpt_request(p):
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=p
                )
            gpt_response =response.choices[0].message.content     
            p.append({"role": "assistant", "content": f"{gpt_response}"},)

            return gpt_response
        maltext = request.get_json()
        maltext = maltext['content']
        english_text = translate_malayalam_to_english(maltext)
        print(english_text)
        p.append({"role": "user", "content": f"{english_text}"})
        gpt_response = gpt_request(p)
        print(gpt_response)
        mal_text = translate_english_to_malayalam_using_mtrans(gpt_response)
        print(jsonify({"gptresponse":mal_text}))
        return jsonify({"gptresponse":mal_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/gptinterfaceenglish', methods=['POST'])
def gptoutputenglish():
    try:
        input_text = request.get_json()
        print("At backend: ",input_text)
        input_text = input_text['content']       
        
        def gpt_request(p):
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=p
                )
            gpt_response =response.choices[0].message.content     
            p.append({"role": "assistant", "content": f"{gpt_response}"},)

            return gpt_response
        gpt_input = p.append({"role": "user", "content": f"{input_text}"})
        gpt_response = gpt_request(p)
        return jsonify({"gptresponse":gpt_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)
