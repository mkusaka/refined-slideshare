import { createBrowserHistory } from "history";
import Cookies from "js-cookie";

const history = createBrowserHistory();

function getPropsData() {
  const propsElement = document.getElementById("__NEXT_DATA__");
  const propsJSON = JSON.parse(propsElement.innerHTML);
  return propsJSON;
}

function seekIframeInfo() {
  const iframeEmbed:
    | {
        height: number;
        width: number;
        url: string;
      }
    | undefined = getPropsData()?.props?.pageProps?.slideshow?.iframeEmbed;
  if (!iframeEmbed) {
    console.log("cannot find valid iframeEmbed");
    return null;
  }

  return iframeEmbed;
}

function parseSlideParam() {
  const { search } = history.location;
  const slide = new URLSearchParams(search).get("slide");
  if (typeof slide === "string") {
    return parseInt(slide, 10);
  }
  return null;
}

function generateURL(url: string, slide: number) {
  const parsedURL = new URL(url);
  parsedURL.searchParams.set("startSlide", slide);
  return parsedURL.toString();
}

function proxyClickEventToSlideIFrame(event: Event) {
  const iframe = document.querySelector("#iframe-rfs");
  const rect = iframe.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Access to elements in iframe
  const iframeDocument =
    iframe.contentDocument || iframe.contentWindow.document;
  const clickedElement = iframeDocument.elementFromPoint(x, y);
  if (clickedElement) {
    // Simulate click event
    clickedElement.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: iframe.contentWindow,
      }),
    );
  }
}

function getSlideNumber() {
  // parse slide params
  const urlSearchParams = new URLSearchParams(window.location.search);
  const slideNumber = urlSearchParams.get("slide");
  if (slideNumber) {
    return parseInt(slideNumber, 10);
  }
  return null;
}

function setSlideSearchParams(slideNumber: number, withDelete = false) {
  // parse slide params
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (withDelete) {
    urlSearchParams.delete("slide");
  } else {
    urlSearchParams.set("slide", slideNumber);
  }
  return urlSearchParams;
}

const images: HTMLImageElement[] = [];
function prefetchImages() {
  const slideImages =
    getPropsData()?.props?.pageProps?.slideshow?.slideImages || [];

  slideImages.forEach((image) => {
    const url = image.baseUrl;
    if (url) {
      let img = new Image();
      img.src = url;
      images.push(img);
    }
  });
}

const container = document.getElementById("new-player");
if (container) {
  const iframeInfo = seekIframeInfo();
  if (iframeInfo) {
    const { url } = iframeInfo;
    const slide = parseSlideParam();
    const newURL = slide ? generateURL(url, slide) : url;
    const { width, height } = container.getBoundingClientRect();
    container.innerHTML = `<!-- Left overlay -->
<div style="position: absolute; width: 20%; height: calc(100% - 50px); z-index: 1; cursor: url(/images/ssplayer/left-pointer.png) 25 25,auto;" id="left-overlay-rfs"></div>
<!-- Right overlay -->
<div style="position: absolute; top: 15%; right: 0; width: 20%; height: calc(100% - 15% - 50px); z-index: 1; cursor: url(/images/ssplayer/right-pointer.png) 25 25,auto;" id="right-overlay-rfs"></div>
<iframe src="${newURL}" width="${width}" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%; aspect-ratio: ${width} / ${height};" allowfullscreen id="iframe-rfs">`;
    const left = document.querySelector("#left-overlay-rfs");
    left?.addEventListener("click", (event) => {
      proxyClickEventToSlideIFrame(event);

      // parse slide params
      const urlSearchParams = new URLSearchParams(window.location.search);

      const slideNumber = getSlideNumber();
      let nextSlideNumber = 1;
      if (slideNumber) {
        nextSlideNumber = Math.max(slideNumber - 1, 1);
      }
      const url = new URL(window.location.href);
      if (nextSlideNumber === 1) {
        urlSearchParams.delete("slide");
        url.search = urlSearchParams;
      } else {
        urlSearchParams.set("slide", nextSlideNumber);
        url.search = urlSearchParams;
      }
      history.replace(url.toString());
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        if (left) {
          const rect = left.getBoundingClientRect();

          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const clickEvent = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: centerX,
            clientY: centerY,
          });

          left.dispatchEvent(clickEvent);
        }
      }
    });
    const right = document.querySelector("#right-overlay-rfs");
    right?.addEventListener("click", (event) => {
      proxyClickEventToSlideIFrame(event);

      const totalSlides =
        getPropsData()?.props?.pageProps?.slideshow?.totalSlides;

      if (!totalSlides) {
        console.log("cannot find total slides");
        return;
      }

      // parse slide params
      const urlSearchParams = new URLSearchParams(window.location.search);

      const slideNumber = getSlideNumber();
      let nextSlideNumber = 2;
      if (slideNumber) {
        nextSlideNumber = Math.min(slideNumber + 1, totalSlides);
      }
      const url = new URL(window.location.href);
      urlSearchParams.set("slide", nextSlideNumber);
      url.search = urlSearchParams;
      history.replace(url.toString());
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        if (right) {
          const rect = right.getBoundingClientRect();

          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const clickEvent = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: centerX,
            clientY: centerY,
          });

          right.dispatchEvent(clickEvent);
        }
      }
    });
  }
}

// hide modal ads as default
Cookies.set("scribd_ad_exit_slideshow_page", true);
// prefetchImages();
