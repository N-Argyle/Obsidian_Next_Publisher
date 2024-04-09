NextJS server to interop with Obsidian. Allows password protected hosting of individual Obsidian docs.

Corresponding Obsidian plugin is at [Obsidian Next Publisher Plugin](https://github.com/N-Argyle/Obsidian_Next_Publisher_Plugin).

For deployment, I'd recommend Vercel. 

To run locally, clone the repo. Somewhere, create an empty Postgres database (I used Vercel postgres). Fill out the .env based on .env.example. 

API an Master Password you must come up with on your own, but they should match what you use in the Plugin. 

Run `yarn migrate` to set up your Postgres tables. 

Once migrations are done, you can move to the cloud provider of your choice. 

Run `yarn dev` to run the server in development mode if you feel like modifying some code. 
