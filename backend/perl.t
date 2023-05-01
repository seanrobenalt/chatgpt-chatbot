use strict;
use warnings;
use LWP::UserAgent;
use JSON;

sub message {
    my ($messages) = @_;
    my $api_endpoint = "https://api.openai.com/v1/completions";
    my $data = {
        "model" => "gpt-3.5-turbo",
        "prompt" => {
            "text" => join("\n", @$messages),
            "user" => "user"
        },
        "max_tokens" => 150,
        "temperature" => 0.7,
        "n" => 1,
        "stop" => "\n"
    };
    my $headers = HTTP::Headers->new(
        "Content-Type" => "application/json",
        "Authorization" => "Bearer " . $ENV{'OPEN_AI_API'}
    );
    my $ua = LWP::UserAgent->new();
    my $response = $ua->post(
        $api_endpoint,
        Content_Type => "application/json",
        Content => to_json($data),
        Headers => $headers
    );
    my $json = from_json($response->decoded_content);
    return $json;
}
