export PGPASSWORD=qsign_qazwsxqazwsx
psql -h localhost -p 5431 -U qsignuser -d qsign_sandbox $@
