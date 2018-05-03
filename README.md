# imgest

Add, edit and sort images in the browser, then share your images with WebTorrent!

[![Build Status](https://travis-ci.org/codealchemist/imgest.svg?branch=master)](https://travis-ci.org/codealchemist/imgest)

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Demo site

http://imgest.tk

## How to share your images with imgest?

- Open demo site
- Drop images in the browser
- Click the WebTorrent button
- Click the link button to get your sharing URL
- Share the URL and enjoy!

## How it works?

When you drop your images in the browser the app stores them in
IndexedDB, a browser database.

You can drag and drop the thumbnails in the list to sort them.

Each time you sort an image the list order is persisted.

You can click the delete button to remove images from the store.

You can click the edit button to change the image title (which is
the image name by default) and set a description.

When you click on the WebTorrent button a new torrent is created
with all your images.

Right after a magnet link to your content is available a short link id
is created for it and the link button gets enabled.

When you click on the link button the short link to your content is
copied to the clipboard.

When this link is opened a new WebTorrent client is created and
uses the magnet link to get the shared content.

Hooray! A new peer is available and starts loading
your image gallery!

**imgest** doesn't use a backend, everything happens in the browser!

If you share your link with more friends there will be more bandwidth
available for everyone because all peers create a swarm!

## Let's hack this together!

If you find **imgest** to be a cool experiment and want to make it better
I invite you to create issues and feature requests on this repo.

I also encourage you to clone the repo and start playing with it!


Enjoy!

## References

[https://github.com/webtorrent/webtorrent](WebTorrent) is a streaming torrent client for the web.

[https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API](IndexedDB API).
