const cache = new Map();

export const setCache = (key, value, ttl = 60000) => {
	cache.set(key, { value, expires: Date.now() + ttl });
};

export const getCache = (key) => {
	const cached = cache.get(key);
	if (!cached || Date.now() > cached.expires) return null;
	return cached.value;
};
