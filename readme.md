
This is fork of https://github.com/TelegramPlayGround/tl-to-json that fork of https://github.com/alik0211/tl-to-json.

# TL to JSON

Parser and converter for TL (Type Language) schema

## CLI

```
npx @psqq/tl-to-json schema.tl schema.json [Convert type] [indent = 0]
```

`Convert type` must be one of `entities`, `tdapi` or `default`.

Concrete example:

```sh
npx @psqq/tl-to-json schema.tl schema.json entities 4
```
