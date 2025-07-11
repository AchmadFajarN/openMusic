const redis = require("redis");

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on("error", (err) => {
      console.log(err);
    });

    this._client.connect();
  }

  async set(key, value, expirationSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new Error("Cache tidak ditamukan");

    return result;
  }

  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
