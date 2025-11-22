/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#2bb673',  50:'#ecfbf4',100:'#d6f7e8',200:'#a7efcf',300:'#74e6b5',400:'#45dd9c',500:'#2bb673',600:'#1f8e59',700:'#176c45',800:'#104d33',900:'#0a3524' },
        secondary: { DEFAULT: '#1a73e8',  50:'#e8f1fe',100:'#dce9fe',200:'#bad2fd',300:'#90b8fb',400:'#5b95f8',500:'#1a73e8',600:'#125ac1',700:'#0e4697',800:'#0a346f',900:'#07244e' },
        accent:    { DEFAULT: '#ffb703',  50:'#fff8e6',100:'#ffefc7',200:'#ffdc84',300:'#ffc247',400:'#ffb703',500:'#e3a104',600:'#b97f03',700:'#8f6102',800:'#664401',900:'#3d2900' },
      },
      boxShadow: {
        soft: '0 8px 28px rgba(16,24,40,0.08)',
      }
    },
  },
  plugins: [],
};