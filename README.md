<div align="center">
  <h1>Keímeno</h1>
  <p>Simple one-page note-taking webapp, saving notes in local storage, with a focus on simplicity and speed.</p>
</div>

## Architecture

The app is built using [Fresh](https://fresh.deno.dev) and that's about it.
It's a simple one-page webapp that saves notes in local storage. The idea behind
is a quick place to write what's on your mind, without any distractions.
It contains a few features like dark mode, bold, italic, underline and
strikethrough text formatting, a character counter, and a special
feature: **Focus Mode**: This feature disables any distractions,
leaving only the text area visible.

## Usage

You can use the app by visiting the [website](https://keimeno.gxbs.dev) or by running it locally.

### Development

(After cloning the repository, and installing Deno, and being in the root directory of the project)

For Development Server:

```sh
deno task start
```

For Production Build:

```sh
deno task build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
