import Cookies from "js-cookie";
import queryString from "query-string";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

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

function parseSlideParam() {
  const { search } = history.location;
  const { slide } = queryString.parse(search);
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

const container = document.getElementById("new-player");
if (container) {
  const iframeInfo = seekIframeInfo();
  if (iframeInfo) {
    const { url } = iframeInfo;
    const slide = parseSlideParam();
    const newURL = slide ? generateURL(url, slide) : url;
    const { width, height } = container.getBoundingClientRect();
    container.innerHTML = `<!-- Left overlay -->
<div style="position: absolute; width: 20%; height: calc(100% - 50px); z-index: 1; cursor: url(/images/ssplayer/left-pointer.png) 25 25,auto;" onclick="(function(event, iframe) {
  console.log({event, iframe});
  var rect = iframe.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;

  // Access to elements in iframe
  var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  var clickedElement = iframeDocument.elementFromPoint(x, y);
  if (clickedElement) {
    // Simulate click event
    clickedElement.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: iframe.contentWindow
    }));
  }
})(event, this.nextElementSibling.nextElementSibling)"></div>

<!-- Right overlay -->
<div style="position: absolute; top: 15%; right: 0; width: 20%; height: calc(15% - 50px); z-index: 1; cursor: url(/images/ssplayer/right-pointer.png) 25 25,auto;" onclick="(function(event, iframe) {
  console.log({event, iframe});
  var rect = iframe.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;

  // Access to elements in iframe
  var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  var clickedElement = iframeDocument.elementFromPoint(x, y);
  if (clickedElement) {
    // Simulate click event
    clickedElement.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: iframe.contentWindow
    }));
  }
})(event, this.nextElementSibling)"></div>
<iframe src="${newURL}" width="${width}" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%; aspect-ratio: ${width} / ${height};" allowfullscreen>`;
  }
}

Cookies.set("scribd_ad_exit_slideshow_page", true);

  // parse slide params
  // var urlSearchParams = new URLSearchParams(window.location.search);

  // console.log({urlSearchParams})
  // var slideNumber = urlSearchParams.get('slide');
  // var nextSlideNumber = 1
  // if (slideNumber) {
  //   var slideNumber = parseInt(slideNumber, 10);
  //   nextSlideNumber = Math.max(slideNumber - 1, 1);
  // }
  // var url = new URL(window.location.href);
  // urlSearchParams.set("slide", nextSlideNumber);
  // url.search = urlSearchParams;
  // console.log({url: url.toString()})
  // window.history.pushState({}, '', url.toString());

  // totalSlide
  // var propsElement = document.getElementById("__NEXT_DATA__");
  // var propsJSON = JSON.parse(propsElement.innerHTML);
  // var totalSlides = props?.props?.pageProps?.slideshow?.totalSlides;

  // if (!totalSlides) {
  //   console.log("cannot find total slides")
  //   return;
  // }

  // // parse slide params
  // var urlSearchParams = new URLSearchParams(window.location.search);

  // console.log({urlSearchParams})
  // var slideNumber = urlSearchParams.get('slide');
  // var nextSlideNumber = 2
  // if (slideNumber) {
  //   var slideNumber = parseInt(slideNumber, 10);
  //   nextSlideNumber = Math.max(slideNumber + 1, totalSlides);
  // }
  // var url = new URL(window.location.href);
  // urlSearchParams.set("slide", nextSlideNumber);
  // url.search = urlSearchParams;
  // console.log({url: url.toString()})
  // window.history.pushState({}, '', url.toString());
