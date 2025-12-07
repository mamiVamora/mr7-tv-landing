/**
 * Simple .env file loader for local development
 * Fetches .env file and parses key-value pairs
 */
const envLoader = {
    env: {},

    async load() {
        try {
            // Check if we are on localhost or file protocol
            const isLocal = window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1' ||
                window.location.protocol === 'file:';

            // Only try to load .env if we suspect we can access it (mostly useful for local servers)
            // But we will try anyway as fallback
            const response = await fetch('.env');

            if (!response.ok) {
                console.warn('⚠️ Could not load .env file. Using config fallback.');
                return false;
            }

            const text = await response.text();
            this.parse(text);
            return true;
        } catch (error) {
            console.warn('⚠️ Error loading .env file:', error);
            return false;
        }
    },

    parse(content) {
        content.split('\n').forEach(line => {
            // Skip comments and empty lines
            if (line.startsWith('#') || !line.trim()) return;

            const [key, ...valueParts] = line.split('=');
            if (key) {
                const value = valueParts.join('=').trim().replace(/^['"]|['"]$/g, ''); // Remove quotes
                this.env[key.trim()] = value;
            }
        });
    },

    get(key) {
        return this.env[key];
    }
};

// Make it globally available
window.envLoader = envLoader;
