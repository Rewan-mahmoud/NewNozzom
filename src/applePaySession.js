let ApplePaySession;

function loadApplePaySDK() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export async function initializeApplePaySession() {
  await loadApplePaySDK();

  ApplePaySession = window.ApplePaySession;

  if (!ApplePaySession) {
    // Handle the case where ApplePaySession is not available
    console.error("ApplePaySession is not available.");
  }

  return ApplePaySession;
}
