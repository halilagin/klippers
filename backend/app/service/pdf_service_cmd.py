#!/usr/bin/env python3
# pylint: disable=all
# flake8: noqa
# type: ignore
# mypy: ignore-errors
# ruff: noqa

""" A tool which takes in pdf, pfx file, password as input and gives out a corresponding signed pdf

"""
import sys
import datetime


from app.config import settings
import os
from dotenv import load_dotenv
import click
import json
from app.service.pdf_service import put_image_in_pdf
import base64

load_dotenv()

def eprint(error):
    print(error, file=sys.stderr)



def save_pdf_in_file(file_path: str, pdf_file: bytes):
    """
    Save the signed PDF file to a file.
    """
    if file_path is None:
        file_path = f"/tmp/mypdf.pdf"
    with open(file_path, "wb") as f:
        f.write(pdf_file)


def save_signature_image_in_file(signature_image_base64: str, signature_id: str):
    """
    Save the signature image to a file.
    """
    prefix = "data:image/png;base64,"
    signature_image_base64 = signature_image_base64.split(prefix)[1]
    signature_image = base64.b64decode(signature_image_base64)
    
    file_path = f"/tmp/signature-image-{signature_id}.png"
    print("saved signature path:",file_path)
    with open(file_path, "wb") as f:
        f.write(signature_image)    


def put_signatures_in_pdf(input_file, output_file, signatures_json):
    """
    Put signatures in the PDF file at the specified page and position.
    """
    

    new_pdf_bytes = open(input_file, "rb").read()
    # Load the PDF file
    json_data = json.load(open(signatures_json))
    for signature in json_data:
        save_signature_image_in_file(signature["signature_image"], signature["id"])
        new_pdf_bytes = put_image_in_pdf(new_pdf_bytes, signature["signature_image"], signature["page"], signature["x"], signature["y"], signature["width"], signature["height"])
    save_pdf_in_file(output_file, new_pdf_bytes)



@click.group()
def cli():
    """Database management commands."""
    pass

@cli.command('place-signatures')
@click.option('--input-file', type=click.Path(exists=True), required=True)
@click.option('--output-file', required=True)
@click.option('--signatures-json', type=click.Path(exists=True), required=True)
def cmd_put_signatures_in_pdf(input_file, output_file, signatures_json):
    """
    Put signatures in the PDF file at the specified page and position.
    """
    put_signatures_in_pdf(input_file, output_file, signatures_json)



if __name__ == '__main__':
    cli()