# frozen_string_literal: true

require 'json'
require 'net/http'
require 'uri'

# { role: 'user', content: prompt }

module Chat
  module Gpt
    def self.message(messages)
      api_endpoint = URI('https://api.openai.com/v1/chat/completions')

      headers = {
        'Content-Type': 'application/json',
        'Authorization': "Bearer #{ENV['OPEN_AI_API']}"
      }
      data = {
        model: 'gpt-3.5-turbo',
        messages: messages
      }

      http = Net::HTTP.new(api_endpoint.host, api_endpoint.port)
      http.use_ssl = true
      request = Net::HTTP::Post.new(api_endpoint.path, headers)
      request.body = data.to_json
      response = http.request(request)

      JSON.parse(response.body)
    end
  end
end
