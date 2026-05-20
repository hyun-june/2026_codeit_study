# Week 01 - Todo List

## 문제 설명

Todo List 앱용 기존 HTML이 일부 제공됩니다. 앱에 다음 기능을 추가하세요.

- "제출" 버튼을 클릭하면 새로운 작업을 추가할 수 있습니다.
  - `<input>` 추가가 성공하면 해당 필드가 정리되어야 합니다.

- "삭제" 버튼을 클릭하면 할 일 목록에서 작업을 제거할 수 있습니다.

[문제 링크](https://www.greatfrontend.com/questions/user-interface/todo-list?practice=practice&tab=coding)

> - 처음에는 객체 형태로 구현했지만,
>   이후 가독성과 데이터 활용 방식을 고려하여
>   배열 구조로 처음부터 다시 구현했다.

## 데이터 구조와 상태 관리

초기 데이터는 배열 형태로 관리했다.

```tsx
const tasksData = [
  { id: 1, task: "Walk the dog" },
  { id: 2, task: "Water the plants" },
  { id: 3, task: "Wash the dishes" },
];
```

처음에는 객체 형태로 관리했지만:

```tsx
const tasksData = {
  1: "Walk the dog",
  2: "Water the plants",
  3: "Wash the dishes",
};
```

이 방식은 배열 메서드(`map`, `filter`) 사용이 불편했다.

Todo List는 `추가`, `삭제`. `수정` 등 배열 기반 처리가 많기 때문에 객체 배열 구조가 더 적절하다고 판단했다.

```tsx
할 일 목록은 `{ id, task }` 형태의 객체 배열 상태로 관리했다.
입력값은 문자열 상태로 분리하여 관리했다.

const [tasks, setTasks] = useState<{ id: number; task: string }[]>(tasksData);
const [input, setInput] = useState<string>("");
```

## Todo 추가와 삭제

### Todo 추가

```tsx
const addTask = () => {
  if (input.trim().length === 0) return; //공백만 입력한 경우 추가되지 않도록 처리했다.
  const newId = Math.max(...tasks.map((item) => item.id)) + 1;
  setTasks((prev) => [...prev, { id: newId, task: input }]);
};
```

### 새로운 id 생성

처음에는:

```tsx
Math.max(tasks.map(...))
```

처럼 작성했지만 오류가 발생했다.

이유는:

- `map()` 결과는 배열
- `Math.max()`는 배열을 직접 받지 않음

이기 때문이다.

그래서 spread 문법을 사용해 배열을 펼쳐주었다.

```tsx
Math.max(...tasks.map((item) => item.id));
```

결과적으로:

```tsx
Math.max(1, 2, 3);
```

형태로 동작하게 된다.

## Todo 삭제

```tsx
const deleteTask = (id: number) => {
  const newTasks = tasks.filter((item) => item.id !== id);

  setTasks(newTasks);
};
```

배열 상태이기 때문에:

- 특정 요소 제거
- 새로운 배열 반환

에 적합한 `filter()`를 사용했다.

객체 구조였다면 `delete` 키워드를 사용했을 것이다.

## 컴포넌트 분리와 Props 전달

```tsx
<TaskItem item={task} key={task.id} onDelete={deleteTask} />
```

각 Todo 항목은 `TaskItem` 컴포넌트로 분리했다.

## 분리한 이유

- 역할 분리
- 재사용성
- 가독성 향상

## 최종코드

```tsx
import { useState } from "react";

const tasksData = [
  { id: 1, task: "Walk the dog" },
  { id: 2, task: "Water the plants" },
  { id: 3, task: "Wash the dishes" },
];

export default function Home() {
  const [tasks, setTasks] = useState<{ id: number; task: string }[]>(tasksData);

  const [input, setInput] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);

  const addTask = () => {
    if (input.trim().length === 0) return;
    const newId = Math.max(...tasks.map((item) => Number(item.id))) + 1;
    setTasks((prev) => [...prev, { id: newId, task: input }]);
    setInput(""); // 수정
  };

  const deleteTask = (id: number) => {
    const newTasks = tasks.filter((item) => item.id !== id);
    setTasks(newTasks);
  };

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          placeholder="Add your task"
          onChange={handleChange}
          value={input} // 수정
        />
        <div>
          <button onClick={addTask}>Submit</button>
        </div>
      </div>
      <ul>
        {tasks.map((task) => (
          <TaskItem item={task} key={task.id} onDelete={deleteTask} />
        ))}
      </ul>
    </div>
  );
}

const TaskItem = ({
  item,
  onDelete,
}: {
  item: { id: number; task: string };
  onDelete: (id: number) => void;
}) => {
  const { id, task } = item;
  return (
    <li>
      <span>{task}</span>
      <button onClick={() => onDelete(id)}>Delete</button>
    </li>
  );
};
```

# 회고

Todo List는 여러 번 만들어봤을 정도로 기본적인 예제라고 생각했지만,
직접 구현해보니 오히려 기본 문법과 데이터 구조를 다시 점검할 수 있는 시간이었다.

최근에는 문법 오류를 찾거나 구현 과정에서 AI 도움을 받는 경우가 많았는데,
이번 과제에서는 상태 관리와 배열 처리 방식들을 직접 다시 구현해보며 흐름을 복습할 수 있었다.

특히 배열과 객체에 따라 상태를 다루는 방식이 달라진다는 점,
그리고 React에서 불변성을 유지하며 상태를 업데이트해야 한다는 점을 다시 한 번 정리할 수 있었다.

단순한 Todo List였지만,
React의 데이터 흐름과 상태 관리 구조를 다시 복습할 수 있었던 과제였다.
