#!/bin/bash

# Script to convert PEM certificate and private key to PFX format

# Check if openssl is installed
if ! command -v openssl &> /dev/null
then
    echo "openssl could not be found. Please install it first."
    exit 1
fi

# --- Configuration ---
CERT_FILE=""
KEY_FILE=""
PFX_FILE=""
EXPORT_PASSWORD=""

# --- Functions ---
usage() {
    echo "Usage: $0 -c <certificate.pem> -k <privatekey.pem> -o <output.pfx> [-p <password>]"
    echo "  -c  Path to the input PEM certificate file."
    echo "  -k  Path to the input PEM private key file."
    echo "  -o  Path for the output PFX file."
    echo "  -p  (Optional) Password for the PFX file. If not provided, you will be prompted."
    exit 1
}

# --- Parse Command Line Arguments ---
while getopts "c:k:o:p:h" opt; do
  case ${opt} in
    c )
      CERT_FILE=$OPTARG
      ;;
    k )
      KEY_FILE=$OPTARG
      ;;
    o )
      PFX_FILE=$OPTARG
      ;;
    p )
      EXPORT_PASSWORD=$OPTARG
      ;;
    h )
      usage
      ;;
    \? )
      echo "Invalid option: $OPTARG" 1>&2
      usage
      ;;
    : )
      echo "Invalid option: $OPTARG requires an argument" 1>&2
      usage
      ;;
  esac
done
shift $((OPTIND -1))

# --- Validate Inputs ---
if [ -z "$CERT_FILE" ]; then
    echo "Error: Certificate file path (-c) is required."
    usage
fi

if [ ! -f "$CERT_FILE" ]; then
    echo "Error: Certificate file '$CERT_FILE' not found."
    exit 1
fi

if [ -z "$KEY_FILE" ]; then
    echo "Error: Private key file path (-k) is required."
    usage
fi

if [ ! -f "$KEY_FILE" ]; then
    echo "Error: Private key file '$KEY_FILE' not found."
    exit 1
fi

if [ -z "$PFX_FILE" ]; then
    echo "Error: Output PFX file path (-o) is required."
    usage
fi

# --- Get Password if not provided ---
if [ -z "$EXPORT_PASSWORD" ]; then
    echo -n "Enter export password for PFX file: "
    read -s EXPORT_PASSWORD
    echo
    if [ -z "$EXPORT_PASSWORD" ]; then
        echo "Error: Export password cannot be empty."
        exit 1
    fi
fi

# --- Perform Conversion ---
echo "Converting to PFX..."
openssl pkcs12 -export -out "$PFX_FILE" -inkey "$KEY_FILE" -in "$CERT_FILE" -password pass:"$EXPORT_PASSWORD"

if [ $? -eq 0 ]; then
    echo "Successfully created PFX file: $PFX_FILE"
else
    echo "Error: Failed to create PFX file."
    exit 1
fi

exit 0