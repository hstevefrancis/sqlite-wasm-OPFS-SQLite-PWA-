// 引用 SQLite 官方提供的 WASM 加載庫 (需預先下載 sqlite3.js)
importScripts('sqlite3.js');

let db;

// 初始化 SQLite
self.sqlite3InitModule().then((sqlite3) => {
    const oo1 = sqlite3.oo1;
    
    // 關鍵：使用 OpfsDb，這會自動在瀏覽器私有空間建立持久化檔案
    db = new oo1.OpfsDb('/my_local_db.sqlite3');
    
    // 初始化表結構
    db.exec("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, val TEXT)");
    
    self.postMessage({ type: 'log', data: 'SQLite 已就緒 (儲存於 OPFS)' });
});

// 監聽來自 UI 的指令
self.onmessage = function(e) {
    const { action, value } = e.data;
    
    if (action === 'insert') {
        db.exec({
            sql: "INSERT INTO test (val) VALUES (?)",
            bind: [value]
        });
        self.postMessage({ type: 'log', data: `已存入: ${value}` });
    } 
    
    else if (action === 'query') {
        const rows = db.selectArrays("SELECT * FROM test");
        self.postMessage({ type: 'result', data: rows });
    }
};
