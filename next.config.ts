import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
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
