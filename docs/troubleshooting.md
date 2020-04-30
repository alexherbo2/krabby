# Troubleshooting

- [mpv commands don't work on Vivaldi](#mpv-commands-dont-work-on-vivaldi)

## mpv commands don't work on Vivaldi

Vivaldi loads it's own libffmpeg library on start-up. This was an optional video compatibility feature up until Vivaldi 3.0 and had to be enabled manually by executing `/opt/vivaldi/update-ffmpeg`.
Later versions set this up automatically.  
More information about it in this [help post](https://help.vivaldi.com/article/html5-proprietary-media-on-linux/) and in the [changelog](https://vivaldi.com/es/changelog-vivaldi-3/).

The loaded `libffmpeg.so` used by Vivaldi might not be compatible with the version of ffmpeg used by mpv, causing it to crash.

It's possible to work around this problem by clearing the `LD_PRELOAD` environment variable that's passed to mpv like so:

1. Add the following to to your configuration located at `~/.config/krabby/config.js`
   ```javascript
   const { settings } = krabby
   
   // Clear the LD_PRELOAD environment variable. Fixes mpv crash on Vivaldi.
   settings['mpv-environment'] = {
     LD_PRELOAD: ''
   }
   ```
2. Run
   ```sh
   cd ~/.config/krabby
   make
   ```
3. Reload the extension from vivaldi://extensions/ or restart Vivaldi.

mpv should work fine afterwards.

