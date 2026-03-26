
window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q ||[]).push(arguments) };
// This prevents the script from automatically trying to send a too long URL
var slicedUrl = window.location.href.slice(0, 200);
plausible('pageview', { url: slicedUrl });
