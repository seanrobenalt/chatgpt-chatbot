const https = require("https");

function message(messages) {
  const data = JSON.stringify({
    model: "gpt-3.5-turbo",
    prompt: {
      text: messages.join("\n"),
      user: "user",
    },
    max_tokens: 150,
    temperature: 0.7,
    n: 1,
    stop: "\n",
  });

  const options = {
    hostname: "api.openai.com",
    port: 443,
    path: "/v1/completions",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
      Authorization: "Bearer " + process.env.OPEN_AI_API,
    },
  };

  const req = https.request(options, (res) => {
    let response = "";

    res.on("data", (chunk) => {
      response += chunk;
    });

    res.on("end", () => {
      console.log(JSON.parse(response));
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
}
