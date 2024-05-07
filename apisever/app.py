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

from Sentiment_Analysis import predict,ismental

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
tokenizer = BertTokenizer.from_pretrained(
    'bert-base-uncased',
    do_lower_case = True
    )

with open('.\Models\mental-model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)
    
with open('.\Models\condition-model.pkl', 'rb') as model_file:
    model2 = pickle.load(model_file)


token_id = []
attention_masks = []

app = Flask(__name__)
CORS(app)

client = OpenAI(
api_key='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',  
)

name = None
p = [{"role": "system", "content": "You are a mental health therapist named Mellisa. You are always friendly and engage in interesting and interactive conversations. You always act like a human. You never answer any technical questions, such as those related to writing programs or performing calculations if asked such questions, say you are a therapist and cannot answer such questions.You never answer any technical questions, such as those related to writing programs or performing calculations. Additionally, you refrain from answering any questions outside the scope of mental health issues, including general knowledge or current affairs.if asked say that you cannaot answer them as you are a therapist.Never give any example either say you cannot do it if asked.Never write a program at any cost nor say how does it look like. You keep your conversations short ."}]

prompt_for_gp_chat = [{"role": "system", "content": "In a mental health support group chat, your role is to provide support and guidance to participants who express distress or seek help, Evaluate each message with empathy, considering the safety and well-being of the sender and others. Respond with 'True' only if the message poses an immediate risk or is threatening or disrespecting others or using unparliamentary words, giving dangerous or problematic advises, otherwise 'False'. messages that seek help or share problems like 'I am feeling so sad I want to die somebody please help.' are not problamatic"}]

@app.route('/isproblematic', methods=['POST'])
def isproblematic():
    try:
        input_text = request.get_json()
        print("At backend: ",input_text)
        input_text = input_text['content']       
        
        def gpt_request(prompt_for_gp_chat):
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=prompt_for_gp_chat
                )
            gpt_response =response.choices[0].message.content     
            
            return gpt_response
        gpt_input = prompt_for_gp_chat.append({"role": "user", "content": f"{input_text}"})
        gpt_response = gpt_request(prompt_for_gp_chat)
        print(gpt_response)
        # mal_text = translate_english_to_malayalam_using_mtrans(gpt_response)
        return jsonify({"gptresponse":gpt_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/diet', methods=['POST'])
def diet():
    try:
        input_text = request.get_json()
        print("At backend: ",input_text)
        user_details = input_text['content']   

        print("Diet backend",user_details)
        
        

        
        def gpt_request(prompt):
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=prompt
                )
            gpt_response =response.choices[0].message.content     
            
            return gpt_response
        
        prompt_for_diet = "Create a diet plan based on southindian cuisine for a patient with the follwing details".user_details
        print(prompt_for_diet)
        gpt_response = gpt_request(prompt_for_diet)
        print(gpt_response)
        # mal_text = translate_english_to_malayalam_using_mtrans(gpt_response)
        return jsonify({"gptresponse":gpt_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
     
@app.route('/predict', methods=['POST'])
def predict_route():
    data = request.get_json()
    new_sentence = data['sentence']
    if ismental(new_sentence,model2,tokenizer):
        prediction = predict(new_sentence,model,tokenizer)    
        print(prediction)
        return jsonify({"prediction": prediction})
    else:
        return jsonify({"prediction": "None"})


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
    
@app.route('/logout', methods=['POST'])
def logout():
    try:
        p = [{"role": "system", "content": "You are a mental health therapist named Mellisa. You are always friendly and engage in interesting and interactive conversations. You always act like a human. You never answer any technical questions, such as those related to writing programs or performing calculations if asked such questions, say you are a therapist and cannot answer such questions.You never answer any technical questions, such as those related to writing programs or performing calculations. Additionally, you refrain from answering any questions outside the scope of mental health issues, including general knowledge or current affairs.if asked say that you cannaot answer them as you are a therapist.Never give any example either say you cannot do it if asked.Never write a program at any cost nor say how does it look like. You keep your conversations short and say long statements only if needed."}]
        print("Claered Chat",p)
        return jsonify({"Cleared Chat":p})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__ == '__main__':
    app.run(port=8000, debug=True)
