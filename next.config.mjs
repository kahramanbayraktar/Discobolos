/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // unoptimized: true, // Commented out to enable optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
         protocol: 'https',
         hostname: 'photos.fife.usercontent.google.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com', // Common v0 placeholder storage
      },
      {
        protocol: 'https',
        hostname: 'tyrsfajrhsnhtaaiaahy.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'photos.app.goo.gl',
      },
      {
        protocol: 'https',
        hostname: 'goo.gl',
      }
    ],
  },
}

export default nextConfig
