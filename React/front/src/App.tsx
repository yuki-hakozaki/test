import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import TodoList from './TodoList.tsx';
import NewTodoItemForm from './NewTodoItemForm.tsx';
// 初めに、使用するモジュールと子コンポーネントをインポートする。

interface TodoItem {
  id: number;
  title: string;
  done: boolean;
}
// Typescriptの機能に基づき、オブジェクトに対して型指定を行う。

const App = (): JSX.Element => {
  // メインコンポーネントである"App"を定義

  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  // useStateを用いて、変数todoListを定義。初期値は空欄で、型はTodoItemに従う。そのため、この変数はid, title, doneの3要素を持つ。
  // setTodoListは、todoListを更新するための関数であり、別のブロックでsetTodoListが実行されると、その結果は自動的にtodoListへ格納される。
  // useStateの構文は、形式的にconst [変数名, set変数名] = useState()という形をとる。

  useEffect(() => {
    fetchTodoList();
  }, []);
  // useEffectは、useStateが完了した後に実行される関数を定義する。この場合はfetchTodoListを実行する。
  // ただし、ここでは第二引数(useEffectを実行するトリガー変数)が空欄なので、全体で1回しか実行されない。
  // 例えば第二引数に[todoList]と入力すると、todoListが変化するたびにuseEffectが実行されるようになる。

  const fetchTodoList = (): void => {
  // fetchTodoList関数を定義  
  // voidはその関数が戻り値を返さないことを宣言する型。何らかの処理や別の関数を同時に実行したい時などに使われる。
    fetch('http://54.64.138.161:3001/api/v1/list')
    // fetch関数を使って、指定されたURL（'./api/v1/list'）にリクエスト。メソッドは指定が無いのでデフォルトのGET
      .then((response) => response.json())
      // アクセスに成功すると、サーバーが現在のTodoリストをJSON形式で返してくるので、それをJSONとして解析する。
      .then((data) => setTodoList(data))
      // 引数dataでuseState内のsetTodoList関数を呼び出し、前の行で受け取ったJSONデータをtodoListに代入して再表示する。
      .catch((error) => console.error('Error fetching todo list:', error));
      // JSONの取得に失敗した場合は、エラーログを表示
  };

  const addTodoItem = (title: string): void => {
  // addTodoItem関数を定義
    fetch('http://54.64.138.161:3001/api/v1/add', {
      method: 'POST',
      // './api/v1/add'にPOSTでリクエスト。
      body: JSON.stringify({ title }),
      // リクエストボディとして、JSONデータ中のtitle要素を指定。titleはNewTodoItemFormコンポーネントで定義されている。
      headers: { 'Content-Type': 'application/json' },
      // リクエストヘッダーとして、Content-TypeをJSONに指定。index.htmlではFormDataで行っていたもの。
    })
      .then((response) => response.json())
      //送信が成功したら、サーバーから送られてきたレスポンスをJSON形式で受け取る。
      .then((data) => {
        setTodoList([...todoList, data]);
        // 取得したJSONを既存のtodoListに結合し、setTodoList関数を実行してtodoListを再表示する。
        // 仮に、ここで.then((data) => setTodoList(data))とすると、todoListが上書きされてしまい、新しいタスクしか表示されない。
        // "..."はJavascriptの結合演算子で、配列やオブジェクトを結合する機能を持つ。これを忘れると、タスク描画がずれる可能性がある。
      })
      .catch((error) => console.error('Error adding todo item:', error));
  };

  const updateTodoItem = (id: number, done: boolean): void => {
  // updateTodoItem関数を定義
    fetch(`http://54.64.138.161:3001/api/v1/item/${id}`, {
    // './api/v1/item/${id}'にPUTでリクエスト。idは各タスク固有のidで、元はサーバーサイドのuuidで付与されたもの。
      method: 'PUT',
      // メソッドはPUT。
      body: JSON.stringify({ done }),
      // リクエストボディとして、JSONデータ中のdone要素を指定。doneは初めサーバーサイドでfalseを与えられているが、
      // ここより下のhandleCheckboxChange関数にて反転処理が行われているため、元のdoneから反転した値がサーバーへ送られる。
      headers: { 'Content-Type': 'application/json' },
    })
      .then(() => fetchTodoList())
      // fetchTodoList関数を実行し、サーバーから最新のTodoリストを読み込む。
      .catch((error) => console.error('Error updating todo item:', error));
  };

  const deleteTodoItem = (id: number): void => {
  // deleteTodoItem関数を定義
    fetch(`http://54.64.138.161:3001/api/v1/item/${id}`, { method: 'DELETE' })
    // './api/v1/item/${id}'にDELETEでリクエスト。
      .then(() => fetchTodoList())
      // fetchTodoList関数を実行し、サーバーから最新のTodoリストを読み込む。
      .catch((error) => console.error('Error deleting todo item:', error));
  };

  const handleCheckboxChange = (id: number): void => {
  // handleCheckboxChange関数を定義
    const updatedTodoList = todoList.map((item) => {
    // updatedTodoList変数を定義。.mapは、配列データの各要素に対して関数を実行し、その結果を新しい配列として返すメソッド。
    // ここではtodoList内の各item(itemの1単位はJSON区切り、つまりid, title, done)に対し、以下のif文を実行する。
      if (item.id === id) {
      // 参照したitemのidとチェックボックスが押されたタスクのidが同じだった場合
        return { ...item, done: !item.done };
      // そのitemのdoneプロパティを反転して上書きする。
      // ここで”...”を抜かすと、既存のitemはそのままに、その外側に新たにdone要素を作成してしまうので注意。
      }
      return item;
      // 戻り値として、更新したitemをtodoListに返す。
    });
    setTodoList(updatedTodoList);
    // setTodoList関数を使い、更新したitemでtodolistを再表示する。
    updateTodoItem(id, updatedTodoList.find((item) => item.id === id)?.done || false);
    // updateTodoItem関数を実行。初めのidはチェックボックスが押されたタスクのidで、
    // その次でupdatedTodoList(更新されたtodoList)の各itemの中から、チェックボックスが押されたタスクのidと一致するitem.idを持つものを探す。
    // 同じidを持つitemが見つかったら、そのitemのdoneプロパティ(上の処理で反転している)を取得して関数を実行。
    // 最後に、item.idと提示したidが一致するものが見つからなかった場合、updateTodoItemのdoneが未定義になりエラーを吐くので、
    // updateTodoItemを実行しない(falseにする)ようにしている。このコードでは起こりえないが、例えば本番環境で複数のユーザーが
    // データベースを操作したり、ネットワークの遅延などでサーバーとフロントの整合性が合わなくなった場合に起こりえる。
  };

  const handleDeleteButtonClick = (id: number): void => {
  // handleDeleteButtonClick関数を定義。
    const updatedTodoList = todoList.filter((item) => item.id !== id);
    // .filterは、配列データの中で特定の条件に合致する要素にのみ関数を実行し、新しい配列を返すメソッド。.mapの条件付きバージョン。
    // ここでは、削除ボタンが押されたタスクのidと一致しないタスク、つまり削除したいタスク以外の全てを選択している。
    setTodoList(updatedTodoList);
    // setTodoList関数により、削除ボタンを押したタスクを覗いたtodoListを再表示する。
    deleteTodoItem(id);
    // 上記のsetTodoListを実行した段階では、データベース側にまだ削除したいタスクのデータが残っているので、
    // deleteTodoItem関数を実行し、サーバー側のデータ削除も行う。
  };

  const postNewTodoItem = (title: string): void => {
  // postNewTodoItem関数を定義
    addTodoItem(title);
  // 引数titleでaddTodoItem関数を実行する。
  };

  return (
  // App.tsxのメインのレンダリング要素
    <div>
      <h1>TODO List</h1>
      <TodoList
      // TodoList.tsxで定義したTodoList関数を実行。各タスクのリストを表示する。
      // ここで、App → TodoList → TodoItemという関数の入れ子構造による描画が行われており、これがReactで特徴的な「ネスト機能」である。
        todoList={todoList}
        onCheckboxChange={handleCheckboxChange}
        onDeleteButtonClick={handleDeleteButtonClick}
        // 関数内の変数に具体的な値を与える。
      />
      <NewTodoItemForm
      // NewTodoItemForm.tsxで定義したNewTodoItemForm関数を実行。テキストボックスとAddボタンを描画する。
       onAddButtonClick={postNewTodoItem}
      // 関数内の変数に具体的な値を与える。
      />
    </div>
  );
};

// ReactDOM.render(<App />, document.getElementById('root'));
// 上のコードはReactアプリケーションをブラウザ上にレンダリングするための一文だが、
// index.jsの7～11行目で同じ機能を果たしているので、無くても正しく動作する。念のためコメントに残しておく。

export default App;
