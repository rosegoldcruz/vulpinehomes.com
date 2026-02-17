"use client";

import { useMemo, useState } from "react";

export default function AffiliateCodeCard({
  code,
  shareUrl,
}: {
  code: string;
  shareUrl: string;
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const qrUrl = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
        shareUrl
      )}`,
    [shareUrl]
  );

  async function copyValue(value: string, mode: "code" | "link") {
    try {
      await navigator.clipboard.writeText(value);
      if (mode === "code") {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 1200);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 1200);
      }
    } catch {
      // Ignore clipboard failures in unsupported environments.
    }
  }

  return (
    <article className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">
          Code: <span className="text-[#FF8A3D]">{code}</span>
        </p>
        <button
          type="button"
          onClick={() => copyValue(code, "code")}
          className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold text-white hover:border-[#FF8A3D]"
        >
          {copiedCode ? "Code Copied" : "Copy Code"}
        </button>
      </div>

      <p className="mt-4 text-xs uppercase tracking-wide text-white/50">Share Link</p>
      <p className="mt-1 break-all text-sm text-white/85">{shareUrl}</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => copyValue(shareUrl, "link")}
          className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold text-white hover:border-[#FF8A3D]"
        >
          {copiedLink ? "Link Copied" : "Copy Link"}
        </button>
        <a
          href={`sms:?&body=${encodeURIComponent(
            `Use my Vulpine Homes referral link: ${shareUrl}`
          )}`}
          className="rounded-lg border border-white/25 px-3 py-1.5 text-xs font-semibold text-white hover:border-[#FF8A3D]"
        >
          Share by SMS
        </a>
      </div>

      <div className="mt-4 w-fit rounded-xl border border-white/10 bg-white p-2">
        <img
          src={qrUrl}
          alt={`Referral QR for ${code}`}
          width={220}
          height={220}
          className="h-[220px] w-[220px] rounded-md"
        />
      </div>
    </article>
  );
}
