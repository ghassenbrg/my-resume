#!/bin/sh
set -eu

escape_js() {
  printf '%s' "${1:-}" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

SERVICE_ID="$(escape_js "${NUXT_PUBLIC_EMAILJS_SERVICE_ID:-}")"
TEMPLATE_ID="$(escape_js "${NUXT_PUBLIC_EMAILJS_TEMPLATE_ID:-}")"
PUBLIC_KEY="$(escape_js "${NUXT_PUBLIC_EMAILJS_PUBLIC_KEY:-}")"

cat > /usr/share/nginx/html/runtime-config.js <<EOF
window.__RUNTIME_CONFIG__ = {
  emailjsServiceId: "$SERVICE_ID",
  emailjsTemplateId: "$TEMPLATE_ID",
  emailjsPublicKey: "$PUBLIC_KEY"
};
EOF
