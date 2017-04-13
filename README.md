# bbc-sport-alexa-skill

## Setting up

To get this running, you'll need to
- 1 - Upload the sample content to an s3 bucket and make it public.
- 2 - Change the url in `index.js` to the sample content
- 3 - `npm install`
- 4 - zip `lib`, `node_modules` and `index.js` together:
```
zip -r lambda.zip lib node_modules index.js
```
- 5 - Create a new lambda with the code you've just zipped up, with a trigger of alexa skill
- 6 - Create a new alexa app through amazon
- 7 - Add the intents and sample utterances in the skills directory in this repo and link it to the lambda arn you just created
- 8 - You should be set up. Link to an alexa or a echo dot and give it a go.

I've been pretty brief on this set up, you may want to follow some other tutorials to fill in any other gaps.

## Lambda local

Make sure you have the latest version of Node (this is known to run on 7.8) and then `npm install lambda-local`

Run the command `lambda-local -l index.js -h handler -e sample-events/unknown_team.js` to run against a fictional team, or choose any of the real teams in the sample-events folder.


