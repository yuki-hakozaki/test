import React, { useState } from 'react';

interface TodoItemProps {
// 型指定TodoItemProps
    id: number;
    title: string;
    done: boolean;
    // 3つは、引数に対する型指定。
    onCheckboxChange: (id: number) => void;
    onDeleteButtonClick: (id: number) => void;
    // この2つは、関数に対する型指定。引数はnumber型を取り、値は何も返さない。
    }
    
    
    function TodoItem({ id, title, done, onCheckboxChange, onDeleteButtonClick }: TodoItemProps) {
    // 関数 TodoItemを型指定TodoItemPropsに従って定義。
    return (
    // 戻り値として以下のHTML(厳密にはHTMLのようなマークアップ)の表示を返す。ここではチェックボックス、タスクの内容、Deleteボタンを描画する。
    // doneやtitleの具体的な値やonCheckboxChangeなどの関数の内容は、この関数のエクスポート先であるTodoList.tsxで与えられる。
    <li>
    <label>
    <input
    type="checkbox"
    className="checkbox"
    checked={done}
    // doneの値に基づいてチェック状態を決める。trueの場合にチェック。
    onChange={() => onCheckboxChange(id)}
    // このチェックボックスの値が変化した際、idを引数にonCheckboxChange関数を実行する。
    />
    {title}
    <button
    className="delete-button"
    onClick={() => onDeleteButtonClick(id)}
    // このボタンがクリックされた際、idを引数にonDeleteButtonClick関数を実行する。
    >
    Delete
    </button>
    </label>
    </li>
    );
    }
    
    export default TodoItem;