export PGPASSWORD=qsign_qazwsxqazwsx_prod
psql -h localhost -p 5433 -U qsignuser_prod -d qsign_prod $@
