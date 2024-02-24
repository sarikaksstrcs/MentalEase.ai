###########################################
#@author K S SARIKA
#Run the following commads
#   pip install gtts
#   pip install os
#   pip install pygame
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

if __name__ == "__main__":
    # Example
    mal_text = "നമസ്കാരം, എന്റെ പേര് ശാരിക."
    text_to_speech(mal_text)

    mal_text = input("Enter Malayalam Text")
    text_to_speech(mal_text)