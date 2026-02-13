module.exports = function detect(url) {
  if (url.includes("podcastaddict.com")) return "podcastaddict";
  if (url.includes("castbox.fm")) return "castbox";
  if (url.includes("simplecast.com")) return "simplecast";
  if (url.includes("open.spotify.com")) return "open_spotify";
  if (url.includes("creators.spotify.com")) return "creators_spotify";
  if (url.includes("firstory.me")) return "firstory";
  if (url.includes("podcasts.com")) return "podcastscom";
  if (url.includes("soundon.fm")) return "soundon";
  return null;
};
