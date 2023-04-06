function findEmbedURL() {
  let metaTags = document.getElementsByTagName("meta");
  for (let tag of metaTags) {
    if (tag.getAttribute("itemprop") === "embedURL") {
      return tag.getAttribute("content");
    }
  }
  return null;
}

const container = document.getElementById("new-player");
if (container) {
  const width = container.getBoundingClientRect().width;
  const height = container.getBoundingClientRect().height;
  container.innerHTML = `<iframe src="${findEmbedURL()}" width="${width}" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%; aspect-ratio: ${width} / ${height};" allowfullscreen>`;
}
