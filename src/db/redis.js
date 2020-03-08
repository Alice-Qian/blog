const redis = require('redis');
const {
    REDIS_CONF
} = require('../conf/db');

const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on('errror', err => {
    console.error(err)
})

function set(key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val);
}

function get(key) {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err);
                return
            }
            if (key == null) {
                resolve(null)
                return
            }
            try {
                resolve(JSON.parse(val))
            } catch (error) {
                resolve(val)
            }
            resolve(val)
        })

    })
}

module.exports = {
    set,
    get
}