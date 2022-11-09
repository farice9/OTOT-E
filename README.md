# OTOT-E

Run locally using
```
docker-compose up --build
```

Use WSL and type the following to start redis-server before proceeding (if not using docker compose)
```
redis-server
```

## API Routes
- GET /api/workout/getAllWorkout
    - Pulls all the mock data from the database and caches the data if the redis cache does not exist yet

- DELETE /api/workout/deleteCache
    - Clears the redis cache for demo purposes