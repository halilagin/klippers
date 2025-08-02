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

from cryptography.hazmat import backends
from cryptography.hazmat.primitives.serialization import pkcs12
from cryptography.x509.oid import NameOID
from endesive import pdf

from app.config import settings
from app.service.pdf_pfx_sign import sign_pdf_with_certificate

signature_string = lambda organization, date, country : (organization + '\nDATE: '+ date)

def eprint(error):
    print(error, file=sys.stderr)

def load_pfx(file_path, password):
    """ Function to load pkcs12 object from the given password protected pfx file."""

    with open(file_path, 'rb') as fp:
        return pkcs12.load_key_and_certificates(fp.read(), password.encode(), backends.default_backend())

def create_args():
    """Creates CLI arguments for the pdfSigner script."""

    parser = argparse.ArgumentParser(description='Script for digitally signing a pdf using a PFX file')
    parser.add_argument('pfx_certificate', type=str, help='Specify keystore file in .pfx format (Mandatory)')
    parser.add_argument('password', type=str, help=' Specify password for keystore file (mandatory)')
    parser.add_argument('src', type=str,
        help='Specify the source file (.pdf) that needs to be digitally signed. Only 1 file at a time can be signed. (Mandatory) ')
    parser.add_argument('-d', '--dest', type=str,
        help='Specify the destination file path for the digitally signed PDF. (Optional, defaults to /tmp/signed_pdf_cmd2.pdf)',
        default="/tmp/signed_pdf_cmd2.pdf")
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

def run():
    args = create_args()

    try:
        validate_args(args)
    except ValueError as e:
        import traceback; traceback.print_exc()
        sys.exit(1)

    try:
        with open(args.src, 'rb') as f:
            input_pdf_content = f.read()

        
        signed_pdf_content = sign_pdf_with_certificate(
            input_pdf_content,
            "1234567890"
        )

        if signed_pdf_content:
            output_file_path = args.dest # Use the destination path from arguments
            with open(output_file_path, 'wb') as fp:
                fp.write(signed_pdf_content)
            print(f"Successfully signed PDF saved to: {output_file_path}")
        else:
            eprint("Failed to sign the PDF.")

    except FileNotFoundError:
        eprint(f"Error: Source PDF file not found at {args.src}")
    except ValueError as ve:
        eprint(f"Argument validation error: {ve}")

if __name__ == '__main__':
    run()