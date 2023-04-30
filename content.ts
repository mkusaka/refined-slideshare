import Cookies from "js-cookie";

function seekIframeInfo() {
  const propsElement = document.getElementById("__NEXT_DATA__");
  const propsJSON = JSON.parse(propsElement.innerHTML);
  const iframeEmbed:
    | {
        height: number;
        width: number;
        url: string;
      }
    | undefined = propsJSON?.props?.pageProps?.slideshow?.iframeEmbed;
  if (!iframeEmbed) {
    console.log("cannot find valid iframeEmbed");
    return null;
  }

  return iframeEmbed;
}

const container = document.getElementById("new-player");
if (container) {
  const iframeInfo = seekIframeInfo();
  if (iframeInfo) {
    const { url } = iframeInfo;
    const { width, height } = container.getBoundingClientRect();
    container.innerHTML = `<iframe src="${url}" width="${width}" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%; aspect-ratio: ${width} / ${height};" allowfullscreen>`;
  }
}

Cookies.set("scribd_ad_exit_slideshow_page", true);
