/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for deployment
  output: "export",
  // Disable image optimization since we're doing static export
  images: {
    unoptimized: true,
  },
  // Disable trailing slashes for cleaner URLs
  trailingSlash: false,
};

export default nextConfig;
