/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three ships untranspiled ESM in places; transpiling avoids edge-case build errors.
  transpilePackages: ["three"],
  // Fonts load at runtime via the <link> in app/layout.tsx. Skipping build-time
  // font inlining keeps `next build` clean even on offline / restricted networks.
  optimizeFonts: false,
  eslint: {
    // Keep `next build` focused on type/compile errors, not lint nits.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
