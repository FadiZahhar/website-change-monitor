docker build -t website-monitor .
docker run -p 3000:3000 --env-file .env website-monitor