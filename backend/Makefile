sqlite_clear_docs:
	sqlite3 app.db " \
	DELETE FROM signature_in_pdfs;\
	DELETE FROM signature_fields;\
	DELETE FROM signature_audits;\
	DELETE FROM signing_sessions;\
	DELETE FROM pdf_files;\
	DELETE FROM signers;\
	DELETE FROM documents;"
sqlite_list_tables:
	sqlite3 app.db ".tables"
sqlite_sql:
	sqlite3 app.db "$(SQL)"
psql_reinit:
	python app/init/dbmanager.py reinitialize
psql_seed:
	python app/init/dbmanager.py seed

test_local:
	cp .env.local .env
	pytest
run_server:
	cp .env.local .env
	sh run_server.sh
run_with_docker:
	sh run_docker.sh
pytest_init:
	cp .env.local .env
	docker exec klippers-fastapi-app python app/init/dbmanager.py reinitialize
	docker exec klippers-fastapi-app python app/init/dbmanager.py seed

pytest: pytest_init
	pytest -s
