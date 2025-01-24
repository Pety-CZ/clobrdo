export class DB {
    #db;
    #dbName = "clobrdo";
    #version = 1;
    #storeBoard = "board";
    #storeFigures = "figuresOnBoard";
    #dbRequest;

    constructor() {

    }

    connect() {
        return new Promise((res, rej) => {
            this.#dbRequest = indexedDB.open(this.#dbName, this.#version);
            this.#dbRequest.onupgradeneeded = (ev) => {
                this.onUpgradeNeeded(ev);
            };
            this.#dbRequest.onsuccess = (ev) => {
                this.#db = ev.target.result;
                res();
            };
            this.#dbRequest.onerror = (ev) => {
                console.log('Databaze se nemohla pripojit: ', ev.target);
                rej();
            };
        })
    }

    onUpgradeNeeded(ev) {
        console.log('DB upgrade....');
        this.#db = ev.target.result;

        if (!this.#db.objectStoreNames.contains(this.#storeFigures)) {
            const osFig = this.#db.createObjectStore(this.#storeFigures,
                // { keyPath: "id", autoIncrement: true });
                { keyPath: "id", autoIncrement: false });
            osFig.createIndex('playerInd', 'player');
            osFig.createIndex('xInd', 'x_coord');
            osFig.createIndex('yInd', 'y_coord');
            osFig.createIndex('sizeInd', 'size');
            osFig.createIndex('colorInd', 'color');
            osFig.createIndex('movedInd', 'hasMoved');
        }
    }

    onsuccess(ev) {
        console.log("db otevrena");
        this.#db = ev.target.result; //this.#dbRequest.result;
        this.#db.onerror = function (ev) {
            console.log("db error: ", ev.target.errorCode);
        };
    }
    insertFig(id, player, x, y, size, color, hasMoved) {
        /// 1. vytvoreni transakce
        const trans = this.#db.transaction(this.#storeFigures, "readwrite");
        trans.oncomplete = () => {
            console.log('Transakce dokončena.');
        };
        trans.onerror = (e) => {
            console.error('Chyba při transakci:', e.target.errorCode);
        };

        const osFig = trans.objectStore(this.#storeFigures);
        const request = osFig.add({ id: id, player: player, x_coord: x, y_coord: y, size: size, color: color, hasMoved: hasMoved });

        request.onsuccess = (event) => {
            console.log('Záznam úspěšně přidán:', { player: player, x_coord: x, y_coord: y, size: size, color: color, hasMoved: hasMoved });
            return event.target.result;
        }
    }
    updateFig(id, player, x, y, size, color, hasMoved) {
        const trans = this.#db.transaction(this.#storeFigures, "readwrite");
        const osFig = trans.objectStore(this.#storeFigures);
        const request = osFig.put({
            id: id,
            playerInd: player,
            x_coord: x,
            y_coord: y,
            size: size,
            color: color,
            hasMoved: hasMoved
        });

        request.onsuccess = () => {
            console.log("Figure updated in DB: ", id);
        };
        request.onerror = (event) => {
            console.error("Error updating figure: ", event.target.error);
        };
    }

    async getFigs() {
        const trans = this.#db.transaction(this.#storeFigures, 'readonly');
        const data = trans.objectStore(this.#storeFigures).index('playerInd').getAll();

        const prom = new Promise((res, rej) => {
            data.onsuccess = res;
            data.onerror = rej;
        });
        await prom;
        return data.result;
    }

    async getFig(id) {
        const trans = this.#db.transaction(this.#storeFigures, 'readonly');
        const data = trans.objectStore(this.#storeFigures).get(id);

        const prom = new Promise((res, rej) => {
            data.onsuccess = res;
            data.onerror = rej;
        });
        await prom;
        return data.result;
    }

}
