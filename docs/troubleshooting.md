# Troubleshooting

- [mpv commands don’t work on Vivaldi](#mpv-commands-dont-work-on-vivaldi)

## mpv commands don’t work on Vivaldi

[Vivaldi] loads its own [`libffmpeg`][FFmpeg] library on start-up.
This was an optional video compatibility feature up until Vivaldi 3.0 and had to be enabled manually by executing `/opt/vivaldi/update-ffmpeg`.
More information about it in this [help post][HTML5 Proprietary Media On Linux] and in the [changelog][Vivaldi 2.11 to 3.0]

The loaded `libffmpeg.so` used by Vivaldi might not be compatible with the version of [FFmpeg] used by [mpv], causing it to crash.

It’s possible to work around this problem by clearing the `LD_PRELOAD` environment variable that is passed to [mpv] like so:

1. Add the following to your configuration:

`~/.config/krabby/config.js`

``` javascript
const { settings } = krabby

// Clear the LD_PRELOAD environment variable.
// Fixes mpv crash on Vivaldi.
settings['mpv-environment'] = {
  LD_PRELOAD: ''
}
```

2. Run the following commands:

``` sh
cd ~/.config/krabby
make
```

3. Reload the extension from `vivaldi://extensions` or restart Vivaldi.

[mpv] should work fine afterwards.

[mpv]: https://mpv.io
[FFmpeg]: https://ffmpeg.org
[Vivaldi]: https://vivaldi.com
[Vivaldi 2.11 to 3.0]: https://vivaldi.com/changelog-vivaldi-3/
[HTML5 Proprietary Media On Linux]: https://help.vivaldi.com/article/html5-proprietary-media-on-linux/
