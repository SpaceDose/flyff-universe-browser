### Flyff Universe Browser

An electron based browser specifically created to play flyff universe.

## Features

-   Split view
    -   Display up to four clients at once. Switch the focus between them on hovering without any need of a click.
    -   Optionally you can open them in a separate window to use multiple monitors.
-   Unique sessions
    -   Saves your login and settings per account instead of the whole browser.
-   Client settings
    -   Rename clients to keep an overview.
    -   Mute single clients.
    -   ... and more.

## Development

Requires [Bun](https://bun.sh) and [Task](https://taskfile.dev).

```sh
task install   # install dependencies
task dev       # start the app in development mode
task check     # lint, format check and typecheck
task lint      # lint and format, applying safe fixes
task build     # build into out/
```

Run `task` to list all available tasks, including the platform release builds.

### Publishing a release

Publishing to GitHub Releases needs a personal access token with `repo` scope. Pass it via the `GH_TOKEN` environment variable, never in a config file:

```sh
GH_TOKEN=<token> bun run build:win --publish always
```
