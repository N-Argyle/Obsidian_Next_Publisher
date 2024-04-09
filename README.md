# Obsidian Next Server

This is a NextJS server that interoperates with Obsidian, allowing password-protected hosting of individual Obsidian documents.

## Corresponding Obsidian Plugin

The corresponding Obsidian plugin is available at [Obsidian Next Publisher Plugin](https://github.com/N-Argyle/Obsidian_Next_Publisher_Plugin).

## Deployment

For deployment, it is recommended to use Vercel.

## Local Development

To run the server locally, follow these steps:

1. Clone the repository.
2. Create an empty Postgres database (e.g., using Vercel Postgres or Neon).
3. Copy the `.env.example` file to `.env` and fill in the required values:
    - `API_KEY`: You must come up with your own API key.
    - `MASTER_PASSWORD`: You must come up with your own master password.
    - `POSTGRES_URL`: The connection string for your database.
    - The API key and master password should match the ones used in the Obsidian Next Publisher Plugin.
4. Run `yarn migrate` to set up the Postgres tables.
5. Once the migrations are complete, you can deploy the server to the cloud provider of your choice.
6. To run the server in development mode, use `yarn dev`.

## Modifying the Code

If you want to modify the code, you can run the server in development mode using `yarn dev`.

## Demo
Go here [https://obsidian-next-publisher.vercel.app/docs/xFjyN4H5fI], use `test` as the password.