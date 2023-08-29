# Fantastic-Telegram

[![Application CI/CD](https://github.com/dbhagen/fantastic-telegram/actions/workflows/docker_build_push.yml/badge.svg)](https://github.com/dbhagen/fantastic-telegram/actions/workflows/docker_build_push.yml)

This is a simple Node.js application that hosts an API server. The API server features a function called /v1/welcomeMessage that returns the following JSON object with an updated realtime timestamp:

```json
{
  "message": "Automate all the things!",
  "timestamp": "2023-08-29T17:05:49.698Z"
}
```

To get the welcome message, you can make a GET request to the following URL:

`https://<your-domain>/v1/welcomeMessage`

The response will be a JSON object with the following fields:

message: The welcome message.
timestamp: The timestamp of the welcome message.
For example, if you make a GET request to the URL above at 2023-08-29T17:05:49.698Z, the response will be the following JSON object:

```json
{
  "message": "Automate all the things!",
  "timestamp": "2023-08-29T17:05:49.698Z"
}
```

## Scripts

The following `npm` scripts are available:

- `start`: Starts the application in production mode.
- `dev`: Starts the application in development mode and serves debug information to the console.
- `test`: Runs the Jest unit and integration tests.
- `coverage`: Generates a coverage report for the unit tests.
- `lint`: Runs the linter.
- `prettier`: Runs the code formatter.
- `docker:clean`: Stops and removes all Docker containers.
- `docker:prod`: Starts the production Docker container.
- `docker:prod:build`: Builds the production Docker container.
- `docker:dev`: Starts the development Docker container and serves debug information to the console.
- `docker:test`: Starts the test Docker container and runs Jest unit and integration tests.
- `act:push`: Pushes the application to the Local GitHub Actions simulator [`Act`](https://github.com/nektos/act).
- `prepare`: Installs Husky, a git hook manager.

## Getting Started

To get started, install the dependencies:

pnpm install

Then, start the application in development mode:

pnpm run dev

## Testing

To run the unit tests, use the following command:

pnpm run test

## Linting

To run the linter, use the following command:

pnpm run lint

## Formatting

To run the code formatter, use the following command:

pnpm run prettier

# Docker Instructions

## Build the Docker image:

Run the following command to build a local version of the Docker image

```bash
pnpm docker:prod:build
```

## Run the Docker container:

For local testing and production, you can use the following scripts:

```bash
pnpm docker:test
```

and

```bash
pnpm docker:prod
```

Or to impliment your own deployment, use the following example:

```bash
docker run -p 3000:3000 -v <path-to-message-files>:/usr/src/node-app/messageFiles dbhagen/fantastic-telegram:latest
```

The `-p 3000:3000` option tells Docker to map the port 3000 on the host machine to port 3000 on the Docker container. This is the port that the application listens on.

The `-v <path-to-message-files>:/usr/src/node-app/messageFiles` option tells Docker to mount a volume at the specified path on the host machine to the `/usr/src/node-app/messageFiles` directory on the Docker container. This allows you to override the default `welcomeMessage.json` file embedded in the Docker image with a custom file.

For example, if you have a custom `welcomeMessage.json` file in the directory `/home/user/message-files`, you would use the following command to mount the volume:

```bash
docker run -p 3000:3000 -v /home/user/message-files:/usr/src/node-app/messageFiles dbhagen/fantastic-telegram:latest
```

## Healthcheck

The container image has a built in `HEALTHCHECK` defined as the following:

```Dockerfile
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 CMD ["/usr/local/bin/node", "/usr/src/node-app/healthcheck.js"]
```

This will check the `/v1/` location for a healthy status code of `200`, every 10 seconds. It will fail if it does not receive that status code within 3 per request seconds, 3 requests in a row. It gives a 5 second grace period on container start up before checking.

## Thanks

This was my first start-to-finish full NodeJS with fully automated Jest tests and GitHub Actions deployment. I'll circle back to pull out all the notes I have on resources I used to get this figured out, but for now I'll just say thanks to the internet at large for helping me out.

## Contributing

To contribute to this project, fork the repository and make your changes. Then, open a pull request.

## License

This project is licensed under the APACHE-2.0 License.
