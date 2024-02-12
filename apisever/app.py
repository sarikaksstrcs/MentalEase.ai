import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from speechrec import recognize_malayalam_speech
from translator import translate_malayalam_to_english, translate_english_to_malayalam_using_mtrans
from malayalam_text_to_speech_web import text_to_speech
from openai import OpenAI

app = Flask(__name__)
CORS(app)

client = OpenAI(
api_key='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',  
)

name = None
p = [{"role": "system", "content": "You are a mental health therapist named mellisa. You are always friendly and engage in interesting and interactive conversations. You always act like a human and never say that you cannot do something. You never say things like As a AI I cannot. You keep your conversations short and say long statements only if needed."}]

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

if __name__ == '__main__':
    app.run(port=8000, debug=True)
