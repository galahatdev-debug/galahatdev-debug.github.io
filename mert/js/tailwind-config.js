tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
                arabic: ['"Cairo"', 'sans-serif'],
            },
            colors: {
                zinc: {
                    950: '#09090b',
                    900: '#18181b',
                    850: '#1f1f23',
                    800: '#27272a',
                },
                accent: {
                    DEFAULT: '#38bdf8',
                    glow: 'rgba(56, 189, 248, 0.35)',
                }
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-6px)' },
                }
            }
        }
    }
};
