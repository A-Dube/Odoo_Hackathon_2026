/** @type {import('tailwindcss').Config} */
export default {
content: [
"./index.html",
"./src/**/*.{js,ts,jsx,tsx}",
],
theme: {
extend: {
colors: {
brand: {
primary: '#0F172A',
secondary: '#FFFFFF',
accent: '#22C55E',
muted: '#64748B'
}
}
},
},
plugins: [],
}