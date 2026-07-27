const baseUrl = process.env.MOBILE_QA_BASE_URL || "http://127.0.0.1:8080";
const debuggerUrl = process.env.CHROME_DEBUGGER_URL || "http://127.0.0.1:9223";

const templateIds = [
  "wedding-emerald-envelope",
  "qyz-uzatu-anel",
  "wedding-classic-gold",
  "wedding-emerald-card",
  "wedding-editorial-istara",
  "kudalyk-gold-mobile",
  "besik-amanat",
  "besik-stitch-heritage",
  "birthday-gold-ornament",
  "birthday-emerald-jubilee",
  "mereytoy-gold-jubilee",
  "sundet-blue-royal",
  "tusaukeser-gold-baby",
];

const paths = [
  "/demo?lang=kz",
  "/demo?lang=ru",
  ...templateIds.flatMap((templateId) => [`/demo/${templateId}?lang=kz`, `/demo/${templateId}?lang=ru`]),
];

let commandId = 0;

async function main() {
  const tabs = await fetch(`${debuggerUrl}/json/list`).then((response) => response.json());
  const tab = tabs.find((item) => item.type === "page");

  if (!tab?.webSocketDebuggerUrl) {
    throw new Error("Chrome page tab was not found");
  }

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  const pending = new Map();

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  };

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  const send = (method, params = {}) => new Promise((resolve) => {
    const id = ++commandId;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 900,
    deviceScaleFactor: 2,
    mobile: true,
  });

  const results = [];

  for (const path of paths) {
    await send("Page.navigate", { url: `${baseUrl}${path}` });
    await sleep(1300);
    await maybeOpenInvitation(send);
    await sleep(600);
    const result = await send("Runtime.evaluate", {
      expression: `(${inspectOverflow.toString()})()`,
      returnByValue: true,
    });
    results.push({
      path,
      ...result.result.result.value,
    });
  }

  ws.close();
  console.log(JSON.stringify(results, null, 2));

  const failed = results.filter((item) => item.horizontalOverflow);
  if (failed.length) {
    process.exitCode = 1;
  }
}

async function maybeOpenInvitation(send) {
  await send("Runtime.evaluate", {
    expression: `
      (() => {
        const buttons = [...document.querySelectorAll("button")];
        const openButton = buttons.find((button) => /нажмите|открыть|ашу/i.test(button.textContent || button.getAttribute("aria-label") || ""));
        if (openButton) openButton.click();
      })()
    `,
  });
}

function inspectOverflow() {
  const width = document.documentElement.clientWidth;
  const bodyWidth = document.body.scrollWidth;
  const documentWidth = document.documentElement.scrollWidth;
  const offenders = [...document.querySelectorAll("*")]
    .filter((element) => {
      const style = window.getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      return element.scrollWidth > width + 2 || rect.right > width + 2 || rect.left < -2;
    })
    .slice(0, 12)
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        tag: element.tagName.toLowerCase(),
        className: typeof element.className === "string" ? element.className : "",
        scrollWidth: Math.round(element.scrollWidth),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
      };
    });

  return {
    viewport: width,
    documentWidth,
    bodyWidth,
    horizontalOverflow: documentWidth > width + 2 || bodyWidth > width + 2,
    offenders,
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
