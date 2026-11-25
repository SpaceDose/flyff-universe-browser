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

Run `task` to list all available tasks, including local platform builds (`task package:win`, `package:mac`, `package:linux`).

### Publishing a release

1. Bump `version` in `package.json` and add a matching `### vX.Y.Z` section to `changelog.md`.
2. Commit and push to `master`.
3. Run `task release`.

This builds Windows (NSIS), macOS (universal DMG) and Linux (AppImage, deb) and publishes them as a GitHub release named after the version, with the changelog section as release notes.

Requirements: the [GitHub CLI](https://cli.github.com) logged in via `gh auth login`, and on Apple Silicon [Rosetta 2](https://support.apple.com/en-us/102527) for the Windows and Linux build tools (`softwareupdate --install-rosetta --agree-to-license`). No access token is stored in the project.
