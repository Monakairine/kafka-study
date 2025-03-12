1. run generation
npm run start



2. run moderation
nest start


3. post curl

curl -X POST http://localhost:3001/generate \
     -H "Content-Type: application/json" \
     -d '{"userId": "user123", "prompt": "Generate an AI image"}'

     