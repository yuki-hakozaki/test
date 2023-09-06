import express, { Request, Response } from 'express';// expressモジュールを読み込む
import multer from 'multer';// multerモジュールを読み込む
import cors from 'cors';// corsモジュールを読み込む。
import { v4 as uuid } from 'uuid';// v4バージョン(ランダムID生成)でuuidモジュールを読み込む。
import bodyParser from 'body-parser';// body-parserモジュールを読み込む。HTTPリクエストのボディからパラメータを取り出す。
import sqlite3 from 'sqlite3';// sqlite3モジュールを読み込む。データベースの作成と操作を行う。
import path from 'path';// pathモジュールを読み込む。

const app = express();// expressアプリを生成する
app.use(multer().none());// multerの使用宣言。ブラウザから送信されたデータを解釈する
//app.use(express.static('web')); 静的ファイルの読込み行。React版では必要ない。
app.use(cors());// corsの使用宣言。corsはクロスオリジンリソースシェアの略で、サーバーとフロントのドメインやポート番号が異なる場合でもリソースを共有するためのもの。
app.use(bodyParser.json());// bodyParserをJSONに対して使用宣言。

const dbPath = path.resolve(__dirname, 'db.sqlite');
// データベースファイルを参照する絶対パスを生成。__dirnameはこのファイルが格納されているディレクトリを示す。

const db = new sqlite3.Database(dbPath);
// db.sqliteファイルにアクセス、または存在しない場合は作成する。

// テーブルの作成
db.serialize(() => {
// .serializeメソッドは、通常同時に実行されるSQL文を1つずつ実行するためのもの。ここでは1つしか実行していないので必須ではないが、
// もし将来的に複数のSQLを追加し、それを順番に実行するような必要性が生じた場合に便利なメソッド。
  db.run('CREATE TABLE IF NOT EXISTS todos (id TEXT, title TEXT, done INTEGER)');
  // totosテーブルの作成を行うSQL
});


app.get('/api/v1/list', (req: Request, res: Response) => {
// http://localhost:3001/api/v1/list にアクセスしてきたときの処理。現在のtodoリストを返す。

  db.all('SELECT id, title, done FROM todos', (err, rows) => {
  // データベースのtodosテーブルから全てのid, title, doneカラムを取得する。
  // db.allメソッドは、SQLを実行した際の戻り値が必要な時に使用する。反対に、db.runはただSQLを実行するだけで、戻り値を返さない。
    if (err) {
      console.error(err);
      res.sendStatus(500);
    // 取得に失敗した場合、エラーコードを返す。
    } else {
      res.json(rows);
    // 取得に成功した場合、各行をJSONで表示しレスポンスとしてフロントに渡す。
    }
  });
});


app.post('/api/v1/add', (req: Request<any, any, { title: string }>, res: Response) => {
// http://localhost:3001/api/v1/add にデータを伴ってアクセスしてきた時の処理。データベースファイルにタスクを追加する。
  const todoData = req.body;
  // 変数todoDataにreq.body(HTTPリクエストのbodyデータのみ)を代入。.body指定することで主要なデータのみを取得する。
  const todoTitle = todoData.title;
  //todoData(req.body)の中から、title要素のみを抽出。
  const id = uuid();
  // uuidにより、各タスクごとに固有のidを生成する。
  const done = false;
  //doneプロパティの初期値はfalseに指定。

  db.run('INSERT INTO todos (id, title, done) VALUES (?, ?, ?)', [id, todoTitle, done], (err) => {
  // タスクデータをデータベースに新しい行として追加。それぞれの値は上で定義した変数を使用する。
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      const todoItem = { id, title: todoTitle, done };
      // 追加に成功したら、フロントから送られてきたtitleにidとdoneプロパティを追加し、todoItemとして定義。
      console.log('Add: ' + JSON.stringify(todoItem));
      // コンソールにてタスク追加をした旨を表示
      res.json(todoItem);
      // todoItemをレスポンスとしてフロントに渡す。
    }
  });
});



app.delete('/api/v1/item/:id', (req: Request<{ id: string }>, res: Response) => {
// http://localhost:3001/api/v1/item/:id にDELETEで送信してきたときの処理。指定されたidを持つ行をデータベースから削除する。
  const id = req.params.id;
  // HTTPリクエスト中のタスクのidを抽出

  db.run('DELETE FROM todos WHERE id = ?', [id], (err) => {
  // 送られてきたidを持つ行をWHEREで選択し、削除
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      console.log('Delete: ' + id);
      // 削除に成功したら、その旨をコンソールに表示。
      res.sendStatus(200);
      // 成功ステータスを返す。タスクの描画の削除はフロント側のhandleDeleteButtonClickで行われているので、サーバー側から返すデータはない。
    }
  });
});


app.put('/api/v1/item/:id', (req: Request<{ id: string }, any, { done: boolean }>, res: Response) => {
// http://localhost:3001/api/v1/item/:id にPUTで送信してきたときの処理。指定されたidを持つ行のdoneパラメーターを反転する。
  const id = req.params.id;
  // HTTPリクエスト中のタスクのidを抽出
  const done = req.body.done === true ? 1 : 0;
  // HTTPリクエスト中のdoneプロパティ(req.body.done、フロントから送られてきたJSONのdoneプロパティ)を取得し、判定する。
  // "条件" ? "真の時の出力" : "偽の時の出力"という構文で条件判定を行っている。
  // SQLはブール型を1がture、0がfalseと認識するので、req.body.doneがtrueだった場合、const doneは1となりtrueになる。

  db.run('UPDATE todos SET done = ? WHERE id = ?', [done, id], (err) => {
  // 送られてきたidを持つ行をWHEREで選択し、新しいdone値を代入する。
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      console.log('Edit: ' + id);
      // 代入に成功したら、その旨をコンソールに表示。
      res.sendStatus(200);
      // 成功ステータス。JSON内データの反転はフロントのhandleCheckboxChangeで行われており、ここではその反転したデータをデータベースに上書きするのみ。
    }
  });
});

// ポート3001でサーバを立てる
app.listen(3001, () => console.log('Listening on port 3001'));
