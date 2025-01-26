export class DB {
    #db;
    #dbName = "clobrdo";
    #version = 1;
    #storeBoard = "board";
    #storeFigures = "figuresOnBoard";
    #dbRequest;

    constructor() {}

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
        if(!this.#db.objectStoreNames.contains(this.#storeBoard)){
            const osBoard = this.#db.createObjectStore(this.#storeBoard,
                { keyPath: "id", autoIncrement: true });
            osBoard.createIndex('xInd', 'x_coord');
            osBoard.createIndex('yInd', 'y_coord');
            osBoard.createIndex('valueInd', 'value');
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
            player: player,
            x_coord: x,
            y_coord: y,
            size: size,
            color: color,
            hasMoved: hasMoved
        });

        request.onsuccess = () => {
            // console.log("Figure updated in DB: ", id);
        };
        request.onerror = (event) => {
            console.error("Error updating figure: ", event.target.error);
        };
    }

    async getFigs() {
        return new Promise((resolve, reject) => {
            const trans = this.#db.transaction(this.#storeFigures, 'readonly');
            const request = trans.objectStore(this.#storeFigures).getAll(); // Use getAll()
            request.onsuccess = event => resolve(event.target.result);
            request.onerror = event => reject(event.target.error);
        });
    }

    clearFigures(){
        const trans = this.#db.transaction(this.#storeFigures, 'readwrite');
        const data = trans.objectStore(this.#storeFigures).clear();
        data.onsuccess = () => {
            console.log('figure DB cleared');
        };
        data.onerror = (event) => {
            console.error('Error clearing figure DB: ', event.target.error);
        };
    }


    saveBoard(boardData) {
        return new Promise((resolve, reject) => {
            const trans = this.#db.transaction(this.#storeBoard, 'readwrite');
            const osBoard = trans.objectStore(this.#storeBoard);

            trans.oncomplete = () => resolve();
            trans.onerror = (e) => reject(e.target.error);

            for (let i = 0; i < boardData.length; i++) {
                for (let j = 0; j < boardData[0].length; j++) {
                    osBoard.put({ id: `${i}-${j}`, x_coord: i, y_coord: j, value: boardData[i][j] });
                }
            }

        });
    }

    insertBoard(x, y, value) {
        /// 1. vytvoreni transakce
        const trans = this.#db.transaction(this.#storeBoard, "readwrite");
        trans.oncomplete = () => {
            console.log('Transakce dokončena.');
        };
        trans.onerror = (e) => {
            console.error('Chyba při transakci:', e.target.errorCode);
        };

        const osBoard = trans.objectStore(this.#storeBoard);
        const request = osBoard.add({ x_coord: x, y_coord: y, value:value});

        request.onsuccess = (event) => {
            console.log('Záznam úspěšně přidán:', { x_coord: x, y_coord: y, value: value });
            return event.target.result;
        }
    }
 
    async getBoard() {
        return new Promise((resolve, reject) => {
            const trans = this.#db.transaction(this.#storeBoard, 'readonly');
            const request = trans.objectStore(this.#storeBoard).getAll();
            request.onsuccess = event => resolve(event.target.result);
            request.onerror = event => reject(event.target.error);
        });
    }

    clearBoard() {
        const trans = this.#db.transaction(this.#storeBoard, 'readwrite');
        const data = trans.objectStore(this.#storeBoard).clear();
        data.onsuccess = () => {
            console.log('board DB cleared');
        };
        data.onerror = (event) => {
            console.error('Error clearing board DB: ', event.target.error);
        };
    }
}
