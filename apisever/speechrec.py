###########################################
# @author KS SARIKA
###########################################

###########################################
# Run the following Commands in terminal
# pip install SpeechRecognition
#pip install pipwin
# pipwin install pyaudio
#############################################

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
        except sr.UnknownValueError:
            print("Google Speech Recognition could not understand audio")
        except sr.RequestError as e:
            print(f"Could not request results from Google Speech Recognition service; {e}")

if __name__ == "__main__":
    recognize_malayalam_speech()
