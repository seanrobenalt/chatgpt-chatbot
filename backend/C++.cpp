#include <iostream>
#include <vector>
#include <string>
#include <curl/curl.h>
#include <json/json.h>

using namespace std;

size_t WriteCallback(char* contents, size_t size, size_t nmemb, void* userp) {
    ((string*)userp)->append(contents, size * nmemb);
    return size * nmemb;
}

Json::Value message(vector<string> messages) {
    CURL *curl;
    CURLcode res;
    string response;

    curl_global_init(CURL_GLOBAL_DEFAULT);
    curl = curl_easy_init();
    if (curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://api.openai.com/v1/completions");
        curl_easy_setopt(curl, CURLOPT_POST, 1L);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "{\"model\":\"gpt-3.5-turbo\",\"prompt\":{\"text\":\"" + String.join("\n", messages) + "\",\"user\":\"user\"},\"max_tokens\":150,\"temperature\":0.7,\"n\":1,\"stop\":\"\\n\"}");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, "Content-Type: application/json");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, ("Authorization: Bearer " + string(getenv("OPEN_AI_API"))).c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);
    }
    curl_global_cleanup();

    Json::Value root;
    Json::CharReaderBuilder builder;
    Json::CharReader* reader = builder.newCharReader();
    string errors;

    if (!reader->parse(response.c_str(), response.c_str() + response.size(), &root, &errors)) {
        cout << errors << endl;
    }

    return root;
}
