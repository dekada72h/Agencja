/**
 * Security: Anti-Clickjacking (Framebuster)
 *
 * This script prevents the website from being loaded inside an iframe (Clickjacking attack).
 * It complements the X-Frame-Options and CSP frame-ancestors headers.
 */
(function() {
    try {
        // Check if the window is being framed
        if (self !== top) {
            // Check if the parent frame is from the same origin (optional, to allow same-origin framing)
            // But for maximum security, we often want to break out entirely if we don't expect to be framed.
            // Given the static nature, we assume we shouldn't be framed by anyone else.

            // Attempt to break out of the frame
            top.location = self.location;
        }
    } catch (e) {
        // If checking top.location throws an error (e.g. cross-origin blocking),
        // it confirms we are being framed by a different origin.
        // In that case, we definitely want to break out.
        top.location = self.location;
    }
})();
