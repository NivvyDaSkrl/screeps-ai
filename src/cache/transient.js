if (!global.transientCache) {
    global.transientCache = {
        INFINITE: -1,
        data:{},
        storeValue: function(key, value, ticksToLive) {
            this.data[key] = {value: value, ticksToLive: ticksToLive, timeRefreshed: Game.time};
        },
        fetchValue: function(key, refresh) {
            if (!this.isDead(key)) {
                if (refresh) {
                    this.data[key].timeRefreshed = Game.time;
                }
                return this.data[key].value;
            }
            return null;
        },
        isDead: function(key) {
            let record = this.data[key];
            if (!record || (record.ticksToLive !== this.INFINITE
                && Game.time > record.timeRefreshed + record.ticksToLive)) {
                delete this.data[key];
                return true;
            }
            return false;
        },
        prune:function() {
            let numPruned = 0;
            for(let key in this.data) {
                if(this.isDead(key)) {
                    numPruned++;
                }
            }
            return numPruned;
        }

    }
}

module.exports = global.transientCache;
