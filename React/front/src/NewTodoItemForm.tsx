import React, { useState } from 'react';

interface NewTodoItemFormProps {
// 型指定NewTodoItemFormProps 
onAddButtonClick: (title: string) => void;
}


function NewTodoItemForm({ onAddButtonClick }: NewTodoItemFormProps) {
// 関数NewTodoItemFormを型指定NewTodoItemFormPropsに従って定義
const [title, setTitle] = useState('');
// useStateメソッドで変数titleを定義。初期値は空欄。

const handleAddButtonClick = () => {
// 関数handleAddButtonClickを定義
if (title) {
// タイトル(下のHTMLのテキストボックスの中)に何らかの値が含まれている場合の条件分岐。
// 今回は何の文字列でも受け付けているが、例えば"if (title.includes('特定の文字')) {"とすると、特定の文字が入力された時の条件分岐を作成できる。
onAddButtonClick(title);
// onAddButtonClick関数をtitleを引数に実行。関数の中身はApp.tsxにて"postNewTodoItem"を与えられている。
// "postNewTodoItem"の中身は”addTodoItem”なので、ここでは最終的にaddTodoItemが実行される。
setTitle('');
// タスクデータの送信とデータベース登録が終わったら、テキストボックスの中を空欄に戻す。
}
};

return (
<div>
<input
type="text"
id="new-todo-item-title"
value={title}
onChange={(e) => setTitle(e.target.value)}
// (e)はイベントオブジェクト、つまりテキストボックスを指す。
// テキストボックスに変化が生じた場合(文字を入力した場合)、変数titleをボックスの内容で書き換える。
// ボックスに入力された文字を1つずつ認識し、title変数に代入している。
/>
<button id="new-todo-item-add-button" onClick={handleAddButtonClick}>
Add
</button>
</div>
);
}
// Addボタンをクリックした時、handleAddButtonClick関数を実行する。

export default NewTodoItemForm;