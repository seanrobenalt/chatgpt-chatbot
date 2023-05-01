package main

import (
    "bytes"
    "encoding/json"
    "net/http"
    "os"
)

type Prompt struct {
    Text string `json:"text"`
    User string `json:"user"`
}

type Data struct {
    Model       string `json:"model"`
    Prompt      Prompt `json:"prompt"`
    MaxTokens   int    `json:"max_tokens"`
    Temperature float64 `json:"temperature"`
    N           int    `json:"n"`
    Stop        string `json:"stop"`
}

type Response struct {
    Choices []struct {
        Text string `json:"text"`
    } `json:"choices"`
}

func message(messages []string) (Response, error) {
    data := Data{
        Model:       "gpt-3.5-turbo",
        Prompt:      Prompt{Text:  strings.Join(messages, "\n"), User: "user"},
        MaxTokens:   150,
        Temperature: 0.7,
        N:           1,
        Stop:        "\n",
    }
    body, err := json.Marshal(data)
    if err != nil {
        return Response{}, err
    }

    req, err := http.NewRequest("POST", "https://api.openai.com/v1/completions", bytes.NewBuffer(body))
    if err != nil {
        return Response{}, err
    }
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Bearer " + os.Getenv("OPEN_AI_API"))

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return Response{}, err
    }
    defer resp.Body.Close()

    var response Response
    json.NewDecoder(resp.Body).Decode(&response)
    return response, nil
}
