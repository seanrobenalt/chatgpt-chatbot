import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class ChatGpt {

    public static JsonObject message(List<String> messages) throws IOException {
        URL url = new URL("https://api.openai.com/v1/completions");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Authorization", "Bearer " + System.getenv("OPEN_AI_API"));
        con.setDoOutput(true);

        Map<String, Object> data = new HashMap<>();
        data.put("model", "gpt-3.5-turbo");
        Map<String, String> prompt = new HashMap<>();
        prompt.put("text", String.join("\n", messages));
        prompt.put("user", "user");
        data.put("prompt", prompt);
        data.put("max_tokens", 150);
        data.put("temperature", 0.7);
        data.put("n", 1);
        data.put("stop", "\n");

        OutputStreamWriter out = new OutputStreamWriter(con.getOutputStream());
        Gson gson = new Gson();
        out.write(gson.toJson(data));
        out.flush();
        out.close();

        Scanner scanner = new Scanner(con.getInputStream());
        StringBuilder responseBuilder = new StringBuilder();
        while (scanner.hasNextLine()) {
            responseBuilder.append(scanner.nextLine());
        }
        scanner.close();

        return gson.fromJson(responseBuilder.toString(), JsonObject.class);
    }
}
