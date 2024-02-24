###########################################
#@author K S SARIKA
#Run the following commads
#   pip install gtts
#   pip install os
###########################################
from gtts import gTTS
import os

def text_to_speech(malayalam_text, output_file="output.mp3", lang="ml"):
    tts = gTTS(text=malayalam_text, lang=lang, slow=False)
    tts.save(output_file)

    os.system("start " + output_file)  

if __name__ == "__main__":
    # Example usage
    malayalam_text = "നമസ്കാരം, എന്റെ പേര് ശാരിക"
    text_to_speech(malayalam_text)


