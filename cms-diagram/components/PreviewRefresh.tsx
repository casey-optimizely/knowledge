"use client";

// PreviewRefresh — must be rendered on any page used as a CMS preview.
//
// The Optimizely SaaS CMS dispatches a custom 'optimizely:cms:contentSaved'
// event on the preview page's window (via the iframe it controls) whenever
// an editor saves content. The event detail includes a fresh previewUrl
// containing an updated preview_token. This component catches that event and
// navigates to the new URL so the editor always sees the latest saved state
// without having to manually refresh.
//
// Source: @optimizely/cms-sdk/dist/esm/react/client.js (PreviewComponent)

import { useEffect } from "react";

export default function PreviewRefresh() {
  useEffect(() => {
    function handleContentSaved(e: CustomEvent<{ previewUrl: string }>) {
      const { previewUrl } = e.detail;
      if (!previewUrl) return;
      try {
        const url = new URL(previewUrl, window.location.origin);
        window.location.replace(url.toString());
      } catch {
        window.location.replace(previewUrl);
      }
    }

    window.addEventListener(
      "optimizely:cms:contentSaved",
      handleContentSaved as EventListener,
    );
    return () =>
      window.removeEventListener(
        "optimizely:cms:contentSaved",
        handleContentSaved as EventListener,
      );
  }, []);

  return null;
}
