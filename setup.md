README [ Assuming you have docker and sam build installed locally ]
-------------------------------------------------------------------

For SAM
----------------------
1. npm install
2. npm run compile && sam build
3. sam local invoke RouteHandlerFunction -e events/post.json

For SAM local api
----------------------
1. sam local start-api --docker-network host --container-host-interface host --container-host 127.0.0.1 --add-host host.docker.internal:host-gateway
2. sam local start-api --env-vars env.json

For serverless
----------------------
1. npm run serverless

For local development
----------------------
1. npm run dev