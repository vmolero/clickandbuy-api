docker-compose -f ./docker/dev.yml up -d postgres redis
deno run --allow-all --unstable --watch main.ts