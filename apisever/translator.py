from mtranslate import translate

def translate_malayalam_to_english(text):
    translated_text = translate(text, "en")
    # print(translated_text)
    return translated_text

print("Malayalam to English...\n")

# Eg
# malayalam_text = "ആരാണ് എന്നെ വരിഞ്ഞുകെട്ടി കയത്തിലിട്ടത് എന്ന ചോദ്യത്തിന് 'ശത്രു' എന്നുമാത്രം പറഞ്ഞപ്പോൾ അയാൾ ഉപദേശിച്ചു. 'ശത്രുവിനോടു ദയ കാട്ടരുത്. ദയയിൽ നിന്ന് കൂടുതൽ കരുത്ത് നേടിയ ശത്രു വീണ്ടും നേരിടുമ്പോൾ അജയ്യനാവും. അതാണ് ഞങ്ങളുടെ നിയമം. മൃഗത്തെ വിട്ടുകളയാം. മനുഷ്യന് രണ്ടാമതൊരവസരം കൊടുക്കരുത്"
# english_translation = translate_malayalam_to_english(malayalam_text)
# print(f'Malayalam Text: {malayalam_text}\nEnglish Translation: {english_translation}')

# malayalam_text = input("Enter Malayalam text: ")
# english_translation = translate_malayalam_to_english(malayalam_text)
# print(f'Malayalam Text: {malayalam_text}\nEnglish Translation: {english_translation}')



print("English to malayalam....\n")
def translate_english_to_malayalam_using_mtrans(text):
    translated_text = translate(text, "ml") 
    # print(translated_text)
    return translated_text

# Example usage:
# english_text = 'I am very sad these days, I have lost my friend, Even my experience with exams turn out to be bad, I am feeling down, feeling alone. My mind is unstable'
# malayalam_translation = translate_english_to_malayalam_using_mtrans(english_text)

# print(f'Malayalam Text: {english_text}\nEnglish Translation: {malayalam_translation}')

# english_text = input("Enter English text")
# malayalam_translation = translate_english_to_malayalam_using_mtrans(english_text)

# print(f'Malayalam Text: {english_text}\nEnglish Translation: {malayalam_translation}')