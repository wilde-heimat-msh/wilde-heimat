import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      html2canvas: "html2canvas-pro",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      html2canvas: "html2canvas-pro",
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/spenden", destination: "/unterstuetzen", permanent: true },
      { source: "/vermittlung", destination: "/hilfe", permanent: true },
      { source: "/mitglied-werden", destination: "/unterstuetzen", permanent: true },
      {
        source: "/ratgeber/rechtliche-grundlagen",
        destination: "/ratgeber/rechtliche-hinweise",
        permanent: true,
      },
      {
        source: "/ratgeber/verhalten-bei-fundtieren",
        destination: "/ratgeber/fundtier-hilfe",
        permanent: true,
      },
      {
        source: "/ratgeber/erste-hilfe-bei-funden",
        destination: "/ratgeber/erste-schritte-bei-notfaellen",
        permanent: true,
      },
      {
        source: "/ratgeber/waschbaeren-und-naturschutz",
        destination: "/ratgeber/waschbaeren-verstehen",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
