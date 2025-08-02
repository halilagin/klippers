set -x
#python app/service/pdf_service_cmd.py place-signatures --input-file pdfs/sample-contract-numi.pdf --output-file /tmp/mypdf.pdf --signatures-json app/service/data_sample/signature_fields.json
python app/service/pdf_service_cmd.py place-signatures --input-file pdfs/sample-contract.pdf --output-file /tmp/mypdf.pdf --signatures-json app/service/data_sample/signature_fields.json
