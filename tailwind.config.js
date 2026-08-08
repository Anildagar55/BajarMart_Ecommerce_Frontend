/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // USER panel — "Bazaar" marketplace: dense, deal-driven, high-energy
        // (structurally inspired by Meesho/Amazon/Flipkart layouts — original palette, not their brand colors)
        bazaar: {
          bg: '#F3F1F7',
          primary: '#6A1B7C',     // header / brand — deep magenta-violet
          primary2: '#8E2A9E',    // gradient partner for banners
          accent: '#FF5722',      // CTAs, discount badges — vivid orange
          gold: '#F5A623',        // ratings, offers
          success: '#10883F',     // savings / "you save ₹x" text
          ink: '#1F1B24',
          sub: '#6B6474',
          card: '#FFFFFF',
          border: '#E7E1EC',
        },
        // Kept for reference / legacy — no longer used by the User panel
        atelier: {
          ivory: '#FBF7F0',
          plum: '#241623',
          merlot: '#6E2135',
          gold: '#B8934A',
          goldlight: '#E4C989',
          ink: '#221C1F',
        },
        // SELLER panel — "The Merchant Ledger"
        ledger: {
          slate: '#1B2430',
          slate2: '#26313F',
          paper: '#F5F3EE',
          copper: '#B5651D',
          coppersoft: '#D98E4E',
          sage: '#6B8F71',
        },
        // ADMIN panel — "Command Console"
        console: {
          void: '#0C0F14',
          panel: '#151A21',
          panel2: '#1D242D',
          amber: '#E3A857',
          emerald: '#3FAE7C',
          crimson: '#C0483F',
          mist: '#8A94A3',
        },
        // SHIPMENT panel — "Transit Board"
        transit: {
          navy: '#0E2A32',
          teal: '#0F6E6A',
          tealsoft: '#12928C',
          orange: '#E0632B',
          fog: '#EFF4F3',
        },
      },
      fontFamily: {
        // User panel: bold, compact grotesque — dense marketplace feel
        bazaar: ['"Baloo 2"', 'sans-serif'],
        // Legacy — no longer used by User panel
        fraunces: ['Fraunces', 'serif'],
        inter: ['Inter', 'sans-serif'],
        // Seller/Admin: structured grotesque
        sora: ['Sora', 'sans-serif'],
        // Shipment: transit signage feel
        barlow: ['"Barlow Condensed"', 'sans-serif'],
        // Data/mono everywhere numbers matter
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
