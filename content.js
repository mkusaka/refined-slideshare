function findEmbedURL() {
  let metaTags = document.getElementsByTagName("meta");
  for (let tag of metaTags) {
    if (tag.getAttribute("itemprop") === "embedURL") {
      return tag.getAttribute("content");
    }
  }
  return null;
}

const parent = document.getElementById("new-player").parentElement;
if (parent) {
  parent.innerHTML = `<iframe src="${findEmbedURL()}" id="new-player" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen>`;
}
