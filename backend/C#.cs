using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using Newtonsoft.Json.Linq;

class ChatGpt
{
    static JObject Message(List<string> messages)
    {
        string endpoint = "https://api.openai.com/v1/completions";
        JObject prompt = new JObject();
        prompt["text"] = String.Join("\n", messages);
        prompt["user"] = "user";

        JObject data = new JObject();
        data["model"] = "gpt-3.5-turbo";
        data["prompt"] = prompt;
        data["max_tokens"] = 150;
        data["temperature"] = 0.7;
        data["n"] = 1;
        data["stop"] = "\n";

        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(endpoint);
        request.Method = "POST";
        request.ContentType = "application/json";
        request.Headers["Authorization"] = "Bearer " + Environment.GetEnvironmentVariable("OPEN_AI_API");
        using (StreamWriter writer = new StreamWriter(request.GetRequestStream()))
        {
            writer.Write(data.ToString());
        }

        HttpWebResponse response = (HttpWebResponse)request.GetResponse();
        using (StreamReader reader = new StreamReader(response.GetResponseStream()))
        {
            return JObject.Parse(reader.ReadToEnd());
        }
    }
}
