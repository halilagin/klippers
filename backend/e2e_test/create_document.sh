pdf_path=../pdfs/sample-contract.pdf
ls $pdf_path

curl -X POST "http://localhost:8000/api/v1/documents/?title=My%20Document%20Title&created_by=user@example.com" \
-H "Content-Type: multipart/form-data" \
-F "file=@$pdf_path"
