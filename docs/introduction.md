# Introduction

## Script

https://krabby.netlify.app

Hello and welcome to this introduction to Krabby.

Krabby is a [Kakoune]-inspired browser extension using a selection-driven browsing method.
I will try to give you a first look at how it works, assuming basic [vi] knowledge.

[Kakoune]: https://kakoune.org
[vi]: https://en.wikipedia.org/wiki/vi

https://krabby.netlify.app#3

As in vi, you can move around using the home row keys — <kbd>j</kbd>, <kbd>k</kbd> —,
follow a link with <kbd>f</kbd> — <kbd>f</kbd> —,
yank a page with <kbd>y</kbd> — <kbd>y</kbd> —.
There are many other commands, like to select section headings with <kbd>#</kbd> — <kbd>#</kbd> —.

Notice at the right-bottom of the page the context in which commands are executed — Show contexts —.
When you focus a page document — Show **Document** context —,
select a link — Show **Link** context —,
click a text input — Click text input —,
a video…

For example, <kbd>y</kbd> — <kbd>y</kbd> — will yank the page address,
but if I select a link — <kbd>f</kbd> —, it will yank the link address.

As you can see, Krabby reverses the vi bindings (action, object) to
(selection, action), and it gives us two advantages:

First, we can directly see if the selection is not what we wanted.

Secondly, we have access to a much more expressive selection language.

Another particular feature of Krabby is its support for, and emphasis towards,
the use of multiple selections.

One way to get multi-selection is with the <kbd>s</kbd> command — <kbd>s</kbd> — to create a selection
out of the active element, <kbd>Alt</kbd> + <kbd>a</kbd> — <kbd>Alt</kbd> + <kbd>a</kbd> — to expand the region,
followed by <kbd>Alt</kbd> + <kbd>I</kbd> — <kbd>Alt</kbd> + <kbd>I</kbd> — to select the links.

— <kbd>y</kbd> —

Once you are done with your multiple selections, the <kbd>Space</kbd> command — <kbd>Space</kbd> —
allows you to discard them and keep only the active element.

Lets take a look at a few examples.

### Download Chihayafuru season 3 with synapse

https://nyaa.si/user/HorribleSubs?q=Chihayafuru+S3+720p

- <kbd>Control</kbd> + <kbd>Left Mouse</kbd> ⇒ Select magnet links
- <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd> ⇒ Open with default application

https://horriblesubs.info/shows/chihayafuru-s3/

- <kbd>f</kbd> `{hint}` ⇒ Focus a link
- <kbd>s</kbd> ⇒ Select element
- <kbd>Alt</kbd> + <kbd>a</kbd> (2) ⇒ Select all episodes
- <kbd>Alt</kbd> + <kbd>i</kbd> (2) ⇒ Select each episode
- <kbd>Enter</kbd> ⇒ Open
- <kbd>Alt</kbd> + <kbd>i</kbd> ⇒ Select child structures
- <kbd>Alt</kbd> + <kbd>k</kbd> `720p:` ⇒ Keep 720p
- <kbd>Alt</kbd> + <kbd>I</kbd> ⇒ Select links
- <kbd>Alt</kbd> + <kbd>k</kbd> `Magnet` ⇒ Keep magnet links
- <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd> ⇒ Open with default application ([synapse])

[synapse]: https://synapse-bt.org

### Play Chihayafuru season 3 with mpv

https://crunchyroll.com/chihayafuru

- <kbd>Control</kbd> + <kbd>Left Mouse</kbd> ⇒ Select videos
- <kbd>Control</kbd> + <kbd>Left Mouse</kbd> ⇒ Remove unwanted selections
- <kbd>Alt</kbd> + <kbd>m</kbd> ⇒ Play with [mpv] in reverse order

[mpv]: https://mpv.io

### Play 3-gatsu no Lion soundtracks in picture-in-picture

https://youtu.be/7ky_itVPTnk

- <kbd>F1</kbd> ⇒ Open help
- Hover “picture-in-picture”
- <kbd>F1</kbd> ⇒ Close help
- <kbd>p</kbd> ⇒ Play video in picture-in-picture
- Drag to the bottom-right corner
- Close

### Read and download Berserk

https://readberserk.com/chapter/berserk-chapter-a0/

- <kbd>%</kbd> ⇒ Select the whole page
- <kbd>S</kbd> `img` ⇒ Select images
- <kbd>Alt</kbd> + <kbd>Enter</kbd> ⇒ Download images

As you can see, multiple selections provide us with a very expressive and concise way of accessing web content.

Besides selections, Krabby provides some other nice features.

### Tab and window management

https://krabby.netlify.app#6

- <kbd>f</kbd> `{hint}` ⇒ Focus a link
- <kbd>s</kbd> ⇒ Select element
- <kbd>Alt</kbd> + <kbd>a</kbd> (3) ⇒ Select the table
- <kbd>Alt</kbd> + <kbd>i</kbd> ⇒ Select each row
- <kbd>]</kbd> ⇒ Select the last column
- <kbd>Alt</kbd> + <kbd>(</kbd> ⇒ Select the previous column
- <kbd>Alt</kbd> + <kbd>I</kbd> ⇒ Select Pokémon links
- <kbd>Control</kbd> + <kbd>Enter</kbd> ⇒ Open in background

<!---->

- <kbd>q</kbd> `Pikachu` ⇒ Switch to [Pikachu]
- <kbd>Alt</kbd> + <kbd>1</kbd> ⇒ Switch to the first tab ([Krabby])
- <kbd>Q</kbd> `Pikachu` ⇒ Bring [Pikachu]
- <kbd>Alt</kbd> + <kbd>l</kbd> ⇒ Switch to the next tab ([Pikachu])

<!---->

- <kbd>d</kbd> ⇒ Detach [Pikachu]
- <kbd>Super</kbd> + <kbd>h</kbd> ⇒ Focus [Bulbasaur]
- <kbd>D</kbd> (3) ⇒ Send [Bulbasaur] and its evolutions
- <kbd>Super</kbd> + <kbd>l</kbd> ⇒ Focus [Venusaur]
- <kbd>Alt</kbd> + <kbd>D</kbd> ⇒ Merge tabs ([Venusaur] → [Charmander])
- <kbd>Alt</kbd> + <kbd>l</kbd> ⇒ Focus [Pikachu]

<!---->

- <kbd>Alt</kbd> + <kbd>1</kbd> ⇒ Switch to the first tab
- <kbd>Alt</kbd> + <kbd>x</kbd> ⇒ Close tabs to the right

[Bulbasaur]: https://www.pokemon.com/us/pokedex/bulbasaur
[Venusaur]: https://www.pokemon.com/us/pokedex/venusaur
[Charmander]: https://www.pokemon.com/us/pokedex/charmander
[Pikachu]: https://www.pokemon.com/us/pokedex/pikachu
[Krabby]: https://www.pokemon.com/us/pokedex/krabby

That’s it for this introduction to Krabby,
I hope you enjoyed it.

If you have any questions, do not hesitate to come to our IRC channel
[`#krabby`] on [freenode].

[freenode]: https://freenode.net
[`#krabby`]: https://webchat.freenode.net/#krabby
