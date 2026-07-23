const path = require("path");
const express = require("express");

const app = express();
const distDir = path.join(__dirname, "dist");

// Mirrors staticwebapp.config.json's globalHeaders — Azure Static Web Apps
// applies these at the CDN edge automatically; App Service does not, so
// they're set here on every response instead.
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data:; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests",
  );
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
  if (req.path.endsWith(".json")) {
    res.setHeader("Cache-Control", "no-cache");
  }
  next();
});

app.use(express.static(distDir, { extensions: ["html"] }));

// navigationFallback equivalent: unmatched routes get the static 404 page
// with an actual 404 status, matching staticwebapp.config.json's rewrite.
app.use((req, res) => {
  res.status(404).sendFile(path.join(distDir, "404.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Serving ${distDir} on port ${port}`);
});
