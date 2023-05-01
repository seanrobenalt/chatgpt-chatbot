#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>
#include <jansson.h>

typedef struct {
    char *text;
    char *user;
} prompt_t;

typedef struct {
    char *model;
    prompt_t prompt;
    int max_tokens;
    float temperature;
    int n;
    char *stop;
} data_t;

typedef struct {
    char *text;
} completion_t;

typedef struct {
    completion_t *choices;
    int num_choices;
} response_t;

size_t write_callback(char *ptr, size_t size, size_t nmemb, void *userdata) {
    size_t realsize = size * nmemb;
    char *response = (char *)userdata;
    memcpy(response, ptr, realsize);
    response[realsize] = '\0';
    return realsize;
}

response_t message(char **messages, int num_messages) {
    char *api_endpoint = "https://api.openai.com/v1/completions";
    data_t data = {
        .model = "gpt-3.5-turbo",
        .prompt = {
            .text = NULL,
           
