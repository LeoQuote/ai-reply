# ai-reply

> A GitHub App built with [Probot](https://github.com/probot/probot) that A bot that would reply any new created issue or pull request

# usage
1. register a github app
2. run the server
```
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> ghcr.io/leoquote/ai-reply:main
# please see .env.example to see the full supported environments
```
3. install the app to your repository
4. write a config file at `.github/ai-reply.yml`

```
global:
  prompt: "你好，我是AI助手，有什么可以帮助你的？"
  wiki: "https://github.com/LeoQuote/ai-reply/wiki" # optional, if added, wiki content would be appended when requesting openai
  model: "gpt-3.5-turbo"
```


# developement
## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t ai-reply .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> ai-reply
```

## Contributing

If you have suggestions for how ai-reply could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2024 Leo
