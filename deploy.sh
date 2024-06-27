docker build . -t gbsw-school-camping-backend
docker rm -f gbsw-school-camping-backend
docker run --name=gbsw-school-camping-backend --restart=always --network=my-network -d gbsw-school-camping-backend
