## ChatGPT Generated ChatBot

I asked ChatGPT to create a ReactJS/Material UI component that serves as a chat popup. I told it to place the Chat at the bottom right of the screen, and have it expand when clicked. I told it to have an input to type a message and a button to send a message. It gave me something close to [component.js](./component.js)

## Configuration

If you're running a ReactJS with Material UI, you can just copy/paste [component.js](./component.js) to a file in your app. You'll just need to add an API call for the messages. See line 125.

You can set up the API to do wherever you want. What I did, was have it call my backend which then used the Open AI API to get a response for the user. You can view my file in [backend/ruby.rb](./backend/ruby.rb). I fed that Ruby file to ChatGPT and asked it to rewrite it in various languages. You can pick your language and then all you have to do is create an endpoint in your backend that receives the user's chat inputs and integrates with the Open AI class.
