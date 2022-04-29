class LostWoodsConduit extends GB.Conduit {
    static #in_progress;

    static #order;
    static #progress;

    static #recorded;

    // ARGUMENTS: 0 is order
    constructor(freq, args) {
        super("lost_woods", freq);

        LostWoodsConduit.#order = args[0];

        LostWoodsConduit.reset();
    }

    update(pinged) {
        if(!LostWoodsConduit.#in_progress) {
            LostWoodsConduit.#in_progress = true;
            Player.setRoomName("Weald of Seemingly No End");
            this.tryTeleportThing(pinged);
            return;
        }

        LostWoodsConduit.#recorded.push(pinged.getFrequency());
        LostWoodsConduit.#progress++;

        if(LostWoodsConduit.#progress >= LostWoodsConduit.#order.length) {
            for(let i = 0; i < LostWoodsConduit.#order.length; i++) {
                if(LostWoodsConduit.#recorded[i] !== LostWoodsConduit.#order[i]) {
                    LostWoodsConduit.reset();
                    pinged.getEnteredThing().kill();
                    return;
                }
            }

            LostWoodsConduit.reset();
            Player.setRoomName("Locksport");
            PS.audioPlay("fx_coin1", {volume: 0.1});
        }

        this.tryTeleportThing(pinged);
    }

    tryTeleportThing(pinged) {
        const offset = {
            x: pinged.getEnteredThing().getPositionX() - pinged.getPositionX(),
            y: pinged.getEnteredThing().getPositionY() - pinged.getPositionY()
        };

        //PS.debug(this.getFrequency() + "\n")
        GB.World.sendEvent(new TeleportEvent(this.getFrequency(), pinged.getEnteredThing(), offset));
        pinged.clearDoorway();
    }

    static reset() {
        LostWoodsConduit.#progress = 0;
        LostWoodsConduit.#in_progress = false;

        LostWoodsConduit.#recorded = [];
    }
}