
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Financial dashboard specific colors
				profit: {
					DEFAULT: '#22c55e',
					light: '#86efac',
					dark: '#15803d'
				},
				loss: {
					DEFAULT: '#ef4444',
					light: '#fca5a5',
					dark: '#dc2626'
				},
				neutral: {
					DEFAULT: '#6b7280',
					light: '#d1d5db',
					dark: '#374151'
				},
				financial: {
					blue: '#1e40af',
					indigo: '#4338ca',
					purple: '#7c3aed',
					teal: '#0891b2'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'pulse-profit': {
					'0%, 100%': {
						boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.4)'
					},
					'50%': {
						boxShadow: '0 0 0 8px rgba(34, 197, 94, 0)'
					}
				},
				'pulse-loss': {
					'0%, 100%': {
						boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4)'
					},
					'50%': {
						boxShadow: '0 0 0 8px rgba(239, 68, 68, 0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'pulse-profit': 'pulse-profit 2s infinite',
				'pulse-loss': 'pulse-loss 2s infinite'
			},
			backgroundImage: {
				'gradient-financial': 'linear-gradient(135deg, #1e40af 0%, #4338ca 50%, #7c3aed 100%)',
				'gradient-profit': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
				'gradient-loss': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
