1. run generation
npm run start


2. cd kafka
  docker-compose up-d 


3. run moderation
nest start


4. post curl

curl -X POST http://localhost:3001/generate \
     -H "Content-Type: application/json" \
     -d '{"userId": "user123", "prompt": "flower"}'

