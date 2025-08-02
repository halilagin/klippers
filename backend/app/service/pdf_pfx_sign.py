#!/usr/bin/env python3
# pylint: disable=all
# flake8: noqa
# type: ignore
# mypy: ignore-errors
# ruff: noqa

""" A tool which takes in pdf, pfx file, password as input and gives out a corresponding signed pdf

"""
import argparse
import pytz
import re
import sys
import datetime
import io

from cryptography.hazmat import backends
from cryptography.hazmat.primitives.serialization import pkcs12
from cryptography.x509.oid import NameOID
from endesive import pdf
from pypdf import PdfReader

from app.config import settings



def eprint(error):
    print(error, file=sys.stderr)

def load_pfx(file_path, password):
    """ Function to load pkcs12 object from the given password protected pfx file."""

    with open(file_path, 'rb') as fp:
        return pkcs12.load_key_and_certificates(fp.read(), password.encode(), backends.default_backend())

def create_args():
    """Creates CLI arguments for the pdfSigner script."""

    parser = argparse.ArgumentParser(description='Script for digitally signing a pdf')
    parser.add_argument('pfx_certificate', type=str, help='Specify keystore file in .pfx format (Mandatory)')
    parser.add_argument('password', type=str, help=' Specify password for keystore file (mandatory)')
    parser.add_argument('src', type=str,
        help='Specify the source file (.pdf) that needs to be digitally signed. Only 1 file at a time can be signed. (Mandatory) ')
    parser.add_argument('-d', '--dest', type=str,
        help='Specify the destination file where digitally signed content will be stored.When not specified, by default it will '
        'digitally sign the source file.(Mandatory) \n'
        'E.g. Given source file /var/hp/some.pdf will be digitally signed')
    parser.add_argument('-c', '--coords', type=str,
        help='Specify the co-ordinates of where you want the digital signature to be placed on the PDF file page.(Optional)\n'
        'Format: Accepts 4 comma-separated float values (without spaces). E.g. 1,2,3,4 ')
    parser.add_argument('-p', '--page', type=int,
        help='You can specify the page number of PDF file where digital signature(Optional)')

    return parser.parse_args()

def validate_args(args):
    """Validating commandline arguments raises valueError exception with if any command
    line arguments are not valid."""

    IS_PFX = lambda pfx_certificate: re.match( r'^(.[^,]+)(.pfx|.PFX){1}$', pfx_certificate)
    if not IS_PFX(args.pfx_certificate):
        raise ValueError('Not a proper pfx file with .pfx or .PFX extension')
    if args.coords:
        for num in args.coords.split(','):
            if not num.isdigit():
                raise ValueError('Coords are not integers')


OID_NAMES = {
    NameOID.COMMON_NAME: 'CN',
    NameOID.COUNTRY_NAME: 'C',
    NameOID.DOMAIN_COMPONENT: 'DC',
    NameOID.EMAIL_ADDRESS: 'E',
    NameOID.GIVEN_NAME: 'G',
    NameOID.LOCALITY_NAME: 'L',
    NameOID.ORGANIZATION_NAME: 'O',
    NameOID.ORGANIZATIONAL_UNIT_NAME: 'OU',
    NameOID.SURNAME: 'SN'
}
def get_rdns_names(rdns):
    names = {}
    for oid in OID_NAMES:
        names[OID_NAMES[oid]] = ''
    for rdn in rdns:
        for attr in rdn._attributes:
            if attr.oid in OID_NAMES:
                names[OID_NAMES[attr.oid]] = attr.value
    return names

def sign_pdf_with_certificate(input_pdf_content: bytes, document_id: str):
    # args = create_args()

    
    try:
        # Load the PKCS12 object from the pfx file
        # p12pk, p12pc, p12oc = load_pfx(args.pfx_certificate, args.password)

        p12pk, p12pc, p12oc = load_pfx(settings.PDF_SIGNER_PFX_PATH, settings.PDF_SIGNER_PFX_PASSWORD)

        names = get_rdns_names(p12pc.subject.rdns)
        timezone = pytz.timezone('Europe/London')
        #default coords of bottom right corner in a pdf page
        coords = [350, 50, 550, 150]
        # if args.coords:
        #   coords = [int(coord) for coord in args.coords.split(',') if coord]
        
        # Determine the last page number
        pdf_reader = PdfReader(io.BytesIO(input_pdf_content))
        num_pages = len(pdf_reader.pages)
        sig_page_index = num_pages - 1 if num_pages > 0 else 0

        date = datetime.datetime.utcnow() - datetime.timedelta(hours=12)
        date = date.strftime('%Y%m%d%H%M%S+00\'00\'')

        signature = f"Klippers signed \ndocument {document_id}\non {date}"
        dct = {
            'sigflags': 3,
            'sigpage': sig_page_index,
            'contact': 'info@klippersai.com',
            #'location': subject.C.encode(),
            'location': 'London',
            'signingdate': date,
            'reason': 'Signed by endurance',
            'signature': signature,
            'signaturebox': tuple(coords[:4]),
        }

        datas = pdf.cms.sign(input_pdf_content,
                     dct,
                     p12pk, p12pc, p12oc,
                     'sha256'
                     )

        # Create an in-memory bytes buffer
        output_buffer = io.BytesIO()

        # Write data to the in-memory buffer
        output_buffer.write(input_pdf_content)
        output_buffer.write(datas)

        # If you need to read from the buffer, reset the pointer to the beginning
        output_buffer.seek(0)
        return output_buffer.getvalue()
        # Use output_buffer.getvalue() to get the entire content as bytes if needed
        # For example, to pass it to another function or save it elsewhere
        # content = output_buffer.getvalue()

        # output_file = input_file.replace(input_file, dest)
        # with open(output_file, 'wb') as fp:
        #   fp.write(datau)
        #   fp.write(datas)
    except Exception as e:
        import traceback; traceback.print_exc()
        eprint(e)

if __name__ == '__main__':
    run()