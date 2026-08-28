## Steam Integration Troubleshooting

The Steam API has a few strict requirements that often cause games to not load even if your profile is set to public. Here are the 3 most common reasons:

1. **You must use your 64-bit Steam ID**: The API will *only* accept your numeric 64-bit Steam ID (it usually starts with `7656119...`). It will **not** work with your custom profile URL name. You can use a tool like [steamid.io](https://steamid.io/) to find your 64-bit ID.
2. **"Game details" must be Public**: Setting your main Steam Profile to "Public" is not enough. Steam has a separate privacy setting for "Game details" which defaults to Private. You must explicitly go to your Steam Privacy Settings and set "Game details" to Public.
3. **Missing Environment Variable**: Ensure that you have actually added the `STEAM_API_KEY` to your environment variables in your Netlify dashboard! If it's missing, the serverless function will silently fail and return no games.

Let me know if any of these were the issue! If it's still not working, check the browser console (F12) on the Interests page to see if there is a specific error message being logged!
