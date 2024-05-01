# import smtplib
# from email.mime.text import MIMEText

# def send_sms(email, password, recipient_number, message):
#     # Format the recipient's phone number with the email domain of the carrier
#     recipient_email = recipient_number + '@gateway.carrierdomain.com'  # Replace 'carrierdomain.com' with the actual domain of the carrier

#     # Create the email message
#     msg = MIMEText(message)
#     msg['From'] = email
#     msg['To'] = recipient_email

#     # Connect to the SMTP server of your email provider
#     smtp_server = 'smtp.gmail.com'
#     smtp_port = 587  # or the appropriate port for your email provider
#     server = smtplib.SMTP(smtp_server, smtp_port)
#     server.starttls()
#     server.login(email, password)

#     # Send the email
#     server.sendmail(email, [recipient_email], msg.as_string())

#     # Close the connection
#     server.quit()

# # Example usage
# email = 'sarikaksstrcs@gmail.com'  # Your email address
# password = 'renjithkumar'  # Your email password
# recipient_number = '8075841629'  # Recipient's phone number
# message = 'Hello from Python! This is a test message.'  # Message to send

# send_sms(email, password, recipient_number, message)

import requests
resp = requests.post('https://textbelt.com/text', {
  'phone': '8075841629',
  'message': 'Hello world',
  'key': 'textbelt',
})
print(resp.json())
