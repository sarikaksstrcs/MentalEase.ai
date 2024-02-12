###########################################
#@author K S SARIKA
##########################################

############################################
#Run the following commads
#   pip install gtts
#   pip install os
#   pip install pygame
#   Run the following Commands in terminal
#   pip install SpeechRecognition
#   pip install pipwin
#   pip install pipwin
#   pipwin install pyaudio
#   pip install mtranslate


###########################################
from gtts import gTTS
import pygame
import tempfile
import os

def text_to_speech(malayalam_text, lang="ml"):

    tts = gTTS(text=malayalam_text, lang=lang, slow=False)    
    tts.save("output.mp3")
    pygame.mixer.init()

    pygame.mixer.music.load("output.mp3")
    pygame.mixer.music.play() #play
    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)    

    #Delete file
    pygame.mixer.quit()
    os.remove("output.mp3")

import speech_recognition as sr

def recognize_malayalam_speech():
    r = sr.Recognizer()

    with sr.Microphone() as source:
        print("Say something in Malayalam...")
        try:
            audio = r.listen(source, timeout=5)  # Adjust timeout 
            print("Processing...")

            # Recognize speech 
            text = r.recognize_google(audio, language="ml-IN")
            
            print("You said:", text)
            return text

        except sr.WaitTimeoutError:
            print("Speech recognition timed out. No speech detected.")
            return " "
        except sr.UnknownValueError:
            print("Google Speech Recognition could not understand audio")
            return " "
        except sr.RequestError as e:
            print(f"Could not request results from Google Speech Recognition service; {e}")
            return " "

from mtranslate import translate

def translate_malayalam_to_english(text):
    if (text == " ") :
        return " "
    translated_text = translate(text, "en")
    # print(translated_text)
    return translated_text

def translate_english_to_malayalam_using_mtrans(text):
    translated_text = translate(text, "ml") 
    print(translated_text)
    return translated_text

from openai import OpenAI
client = OpenAI(
  api_key='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',  
)

p = [{"role": "system", "content": "You are a mental health therapist named mellisa. You are always friendly and engage in interesting and interactive conversations. You always act like a human and never say that you cannot do something. You never say things like As a AI I cannot. You keep your conversations short and say long statements only if needed"}]
def gpt_request(p):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=p
        )
    gpt_response =response.choices[0].message.content     
    p.append({"role": "assistant", "content": f"{gpt_response}"},)

    return gpt_response

from gtts import gTTS
import pygame
import tempfile
import os

def text_to_speech(malayalam_text, lang="ml"):

    tts = gTTS(text=malayalam_text, lang=lang, slow=False)    
    tts.save("output.mp3")
    pygame.mixer.init()

    pygame.mixer.music.load("output.mp3")
    pygame.mixer.music.play() #play
    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)    

    #Delete file
    pygame.mixer.quit()
    os.remove("output.mp3")


while True:
    mal_text = recognize_malayalam_speech()
    engl_text = translate_malayalam_to_english(mal_text)
    p.append({"role": "user", "content": f"{engl_text}"})
    response = gpt_request(p)

    mal_output = translate_english_to_malayalam_using_mtrans(response)
    # print(mal_output)

    text_to_speech(mal_output)
    
    # print(response)
    # print(p)

    



