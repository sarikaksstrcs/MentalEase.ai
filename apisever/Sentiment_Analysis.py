import pickle
import torch
import numpy as np
from transformers import BertTokenizer

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


def preprocessing(input_text, tokenizer):
  return tokenizer.encode_plus(
                        input_text,
                        add_special_tokens = True,
                        max_length = 32,
                        pad_to_max_length = True,
                        return_attention_mask = True,
                        return_tensors = 'pt'
                   )


def predict(sentence,model,tokenizer):
  # Token IDs and Attention Mask for new sentence
  test_ids = []
  test_attention_mask = []

  # Apply tokenizer
  encoding = preprocessing(sentence, tokenizer)

  # Extract IDs & Attention Mask
  test_ids.append(encoding['input_ids'])
  test_attention_mask.append(encoding['attention_mask'])
  test_ids = torch.cat(test_ids, dim = 0)
  test_attention_mask = torch.cat(test_attention_mask, dim = 0)

  # Forward pass, predictions
  with torch.no_grad():
    output = model(test_ids.to(device), token_type_ids = None, attention_mask = test_attention_mask.to(device))

  x = np.argmax(output.logits.cpu().numpy()).flatten().item()
  if x == 1:
    prediction = 'Addiction'
  elif x == 0 :
    prediction = 'Anxiety'
  elif x == 2 :
    prediction = 'Suicide'
  elif x == 3 :
    prediction = 'Depression'
  elif x == 4 :
    prediction = 'Eating Disorder'

  print('Input Sentence: ', sentence)
  return prediction

def ismental(sentence,model,tokenizer):
  test_ids = []
  test_attention_mask = []

  # Apply tokenizer
  encoding = preprocessing(sentence, tokenizer)

  # Extract IDs & Attention Mask
  test_ids.append(encoding['input_ids'])
  test_attention_mask.append(encoding['attention_mask'])
  test_ids = torch.cat(test_ids, dim = 0)
  test_attention_mask = torch.cat(test_attention_mask, dim = 0)

  # Forward pass, predictions
  with torch.no_grad():
    output = model(test_ids.to(device), token_type_ids = None, attention_mask = test_attention_mask.to(device))

  x = np.argmax(output.logits.cpu().numpy()).flatten().item()
  print(x)

  if x==0:
    return False
  if x==1:
    return True
  

def main():
  tokenizer = BertTokenizer.from_pretrained(
    'bert-base-uncased',
    do_lower_case = True
    )

  with open('apisever\Models\mental-model.pkl', 'rb') as model_file:
      model = pickle.load(model_file)
      
  token_id = []
  attention_masks = []
  new_sentence = "I am addicted to drugs"
  prediction = predict(new_sentence,model,tokenizer)
  print(prediction)

  while True :
    new_sentence = input("Enter text to Predict : ")
    prediction = predict(new_sentence,model,tokenizer)
    print(prediction)

# main()


