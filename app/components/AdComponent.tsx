"use client";
import { useLayoutEffect } from "react";

export default function AdComponent() {
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      // Forçar o TypeScript a aceitar window.adsbygoogle
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      data-ad-client="ca-pub-8650473573508274"
      data-ad-slot="5778001903"
      data-ad-format="auto"
      data-full-width-responsive="true"
      data-ad-test="on"
    ></ins>
  );
}
