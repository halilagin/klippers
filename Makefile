dup_build: 
	docker compose up -d --build 

dup:
	cp backend/.env.docker backend/.env && \
	docker compose up -d --build
down:
	docker compose down
psql_reinit:
	docker exec klippers-fastapi-app python app/init/dbmanager.py reinitialize
psql_seed:
	docker exec klippers-fastapi-app python app/init/dbmanager.py seed
sql:
	docker exec klippers-fastapi-app python app/init/dbmanager.py sql "${SQL}"

prod_dup: prod_deploy
	docker compose  -f docker-compose-prod.yaml up -d 
prod_dup_build: prod_deploy
	cp -rf /home/ubuntu/github/qsign_repo/secrets backend/ && \
	docker compose  -f docker-compose-prod.yaml up -d --build 
prod_down:
	docker compose -f docker-compose-prod.yaml down
prod_psql_reinit:
	docker exec klippers-fastapi-app python app/init/dbmanager.py reinitialize
prod_psql_seed:
	docker exec klippers-fastapi-app python app/init/dbmanager.py seed
prod_sql:
	docker exec klippers-fastapi-app python app/init/dbmanager.py sql "${SQL}"
prod_deploy:
	cp backend/.env.docker.prod backend/.env && \
	cp frontend/src/AppConfigDockerProd.ts frontend/src/AppConfigDocker.ts

