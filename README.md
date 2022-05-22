# polycode runner

This is a proof of concept for a runner that can run code in multiple languages.

This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.

You can directly make request to the `/run` route with, for example, the following body:

```json
{
  "language": "python",
  "code": "print('hello world')"
}
```

### `npm start`

For production mode

## Deployment

To deploy the app you'll need a running Kubernetes environment. You need to setup 2 secrets in your repository:

- KUBECONFIG : The kubeconfig pointing to your cluster
- BOT_ACCESS_TOKEN: An admin access token to make the CI/CD pipeline work
