import qrcode

data = "2@d+O9okRos80JXZtJ55u8YqIK1b3mEykDbc14G9kidjuH+A+u6p36huUhVzri1EFNWrp7WLynP/5FQqgVD70vPMAm/RlO8t/lNv0=,1wyuxPPLrx4LC+K5Fd7TWuW7P+kEJhFDPrMSDRpXPCQ=,gDiWGhsBRYGBucajFB8wEe0lh654J/C7pOvy+DrFF3U=,b54jhQxYfe53qMQf1LJfY+nXb+C0CCU1mkpJOyR7wNI=,1"

qr = qrcode.QRCode(version=1, box_size=10, border=4)
qr.add_data(data)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("codigo_qr.png")

print("QR Code salvo como codigo_qr.png")
