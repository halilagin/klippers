export PGPASSWORD=qsign_qazwsxqazwsx
psql -h localhost -p 25432 -U qsignuser -d qsign_test $@
