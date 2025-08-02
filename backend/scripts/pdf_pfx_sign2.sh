 # First, generate a private key
openssl genrsa -out /tmp/private.key 2048
#
# # Then, create a self-signed certificate
openssl req -new -x509 -key /tmp/private.key -out /tmp/certificate.crt -days 365 -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=YourName"
#
# # Finally, create the PKCS12 (.pfx) file with password "123456"
openssl pkcs12 -export -out /tmp/certificate.pfx -inkey /tmp/private.key -in /tmp/certificate.crt -password pass:123456
 

sh scripts/pfx.sh -c /tmp/cert.pem -k /tmp/private.pem -o /tmp/key.pfx -p 123456

export PYTHONPATH=.
python app/service/pdf_pfx_sign_cmd2.py  -d  /tmp/signed_pdf.pdf /tmp/key.pfx 123456  pdfs/sample-contract.pdf