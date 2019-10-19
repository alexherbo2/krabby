# Differences with Vi(m)

## A linguistic twist

A big difference is that Krabby reverses the vi bindings (action, object) to
(selection, action).

vi basic grammar is **verb** (immediately) followed by **object**; it’s nice
because it matches well with the order we use in English.  On the other hand, it
does not match well with the nature of what we express: there is only a handful
of **verbs** in web browsing, and they don’t compose, contrarily to **objects**
which can be arbitrarily complex, and difficult to express in a single motion.

Kakoune’s grammar is one (or more) **objects** followed by **verb**, which allows
chaining actions, combined with instantaneous feedback.

For example, in [Vimium], you have <kbd>f</kbd> to open a link, <kbd>y</kbd>
<kbd>f</kbd> to yank a link, while in Krabby, objects and actions are two
building blocks: <kbd>f</kbd> to select a link, followed by the action:
<kbd>Enter</kbd> to open, <kbd>y</kbd> to yank.

After selecting a link, you can apply your actions, or continue refining your
selection(s) to reach something more complex (see the 3-gatsu no Lion example
at the bottom).

## Multiple selections

Another particular feature of Krabby is its support for, and emphasis towards
the use of multiple selections.  Multiple selections in Krabby are not just one
additional feature, it is the central way of interacting with your objects.

For example, there is no <kbd>Alt</kbd> + <kbd>f</kbd> command to open multiple
links.  What you would do is get multiple selections with <kbd>F</kbd> aka hint
lock mode, select multiple links and exit with <kbd>Escape</kbd>.  You would end
up with a set of selections and use <kbd>Control</kbd> + <kbd>Enter</kbd> to open
them in background.

Another way to get multi-selection is with <kbd>f</kbd> we viewed before to focus
a link, <kbd>s</kbd> to create a selection out of the active element, <kbd>Alt</kbd> +
<kbd>a</kbd> to expand the region, followed by <kbd>Alt</kbd> + <kbd>I</kbd> to
select all links within the selection.

Here is an example to open links in a paragraph:

[![Opening links in a paragraph](https://img.youtube.com/vi_webp/v2Jvk1rhIlc/maxresdefault.webp)](https://youtu.be/v2Jvk1rhIlc)

Or videos with [mpv]:

[![Play videos with mpv](https://img.youtube.com/vi_webp/gYTi-eXuWdI/maxresdefault.webp)](https://youtu.be/gYTi-eXuWdI)

Multiple selections provides us with a very powerful to express structural
selection: we can subselect elements inside the current selections, keep
selections containing / not containing a match.

For example, here is how you could do to download [3-gatsu no Lion episodes from HorribleSubs]:

[![Download 3-gatsu no Lion episodes from HorribleSubs](https://img.youtube.com/vi_webp/aXaFt75lIqo/maxresdefault.webp)](https://youtu.be/aXaFt75lIqo)

Or extract the [list of cities and towns in Russia from Wikipedia]:

[![Extract from Wikipedia the list of cities and towns in Russia](https://img.youtube.com/vi_webp/PJXCnRBkHDY/maxresdefault.webp)](https://youtu.be/PJXCnRBkHDY)

[Vimium]: https://github.com/philc/vimium
[mpv]: https://mpv.io
[3-gatsu no Lion episodes from HorribleSubs]: https://horriblesubs.info/shows/3-gatsu-no-lion/
[List of cities and towns in Russia from Wikipedia]: https://en.wikipedia.org/wiki/List_of_cities_and_towns_in_Russia
