use std::collections::HashMap;
use std::io::Read;
use std::str;

use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE, AUTHORIZATION};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

#[derive(Serialize)]
struct Prompt {
    text: String,
    user: String,
}

#[derive(Serialize)]
struct Data {
    model: String,
    prompt: Prompt,
    max_tokens: u32,
    temperature: f32,
    n: u32,
    stop: String,
}

#[derive(Deserialize)]
struct Completion {
    text: String,
}

#[derive(Deserialize)]
struct Response {
    choices: Vec<Completion>,
}

fn message(messages: Vec<&str>) -> Result<Value, Box<dyn std::error::Error>> {
    let data = Data {
        model: String::from("gpt-3.5-turbo"),
        prompt: Prompt {
            text: messages.join("\n"),
            user: String::from("user"),
        },
        max_tokens: 150,
        temperature: 0.7,
        n: 1,
        stop: String::from("\n"),
    };
    let body = json!(data).to_string();

    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
    headers.insert(
        AUTHORIZATION,
        HeaderValue::from_str(&format!("Bearer {}", std::env::var("OPEN_AI_API")?))?,
    );

    let client = Client::new();
    let mut response = client
        .post("https://api.openai.com/v1/completions")
        .headers(headers)
        .body(body)
        .send()?;

    let mut response_body = String::new();
    response.read_to_string(&mut response_body)?;

    let response: Response = serde_json::from_str(&response_body)?;

    Ok(json!({
        "text": response.choices[0].text,
    }))
}
