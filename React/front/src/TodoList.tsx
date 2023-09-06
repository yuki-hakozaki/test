import React, { useState } from 'react';
import TodoItem from './TodoItem.tsx';

interface Todo {
// 型指定Todo
id: number;
title: string;
done: boolean;
}

interface TodoListProps {
// 型指定TodoListProps
todoList: Todo[];
// todoListは、型指定Todoのようなデータセットを有するという宣言
// このtodoList引数は、App.tsxのuseStateメソッドの所で定義されている。
onCheckboxChange: (id: number) => void;
onDeleteButtonClick: (id: number) => void;
}


function TodoList({ todoList, onCheckboxChange, onDeleteButtonClick }: TodoListProps) {
// TodoList関数を型指定TodoListPropsに従って定義
return (
<ul id="todo-container">
{todoList.map((item) => (
// todoListの中にあるitem(すなわちid, title, doneという一区切り)の数だけ、以下のHTMLを表示する。
// ここでは、TodoItem.tsxで定義したTodoItem関数(チェックボックス、タスクの内容、Deleteボタンを描画)をitemの数だけ描画する。
<TodoItem
       key={item.id}
       id={item.id}
       title={item.title}
       done={item.done}
       onCheckboxChange={onCheckboxChange}
       onDeleteButtonClick={onDeleteButtonClick}
      // TodoItem関数に具体的な値を与える。
      // onCheckboxChangeとonDeleteButtonClickの具体的な内容は、この関数のエクスポート先であるApp.tsxで与えられる
      // keyというプロパティは、Reactライブラリが内部的にリストを一意に識別するために使用するもので、コード内では直接使用されない。
     />
))}
</ul>
);
}

export default TodoList;