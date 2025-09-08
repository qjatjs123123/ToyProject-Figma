# 웹 기반 디자인 툴

피그마 클론 코딩 프로젝트 

https://figma-clone-prj.netlify.app/

<br />

## 🚀 프로젝트 개요

개인 프로젝트 입니다. <br />
`React`, `react-konva` 등 라이브러리를 학습하고, 개인적으로 궁금했던 `Figma` 기능을 직접 구현해보는 프로젝트입니다.

<br />

## ⚙ 내가 사용한 기술 스택

<div> 
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" /> 
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /> 
  <img src="https://img.shields.io/badge/Jotai-1E1E1E?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgc3Ryb2tlPSIjRkY2NTAwIiBmaWxsPSIjMUUxRU1FIi8+PC9zdmc+" />
  <img src="https://img.shields.io/badge/Konva-0082C9?style=for-the-badge&logoColor=white" /> 
</div>

<br />

## 📚 왜 이 라이브러리를 사용했나?
### `react-konva`
#### WHY? 👍
- fabric, canvas API, react-konva 중 가장 번들 사이즈가 작음
- 생태계가 가장 큼
- react 초점을 맞춘 라이브러리

`정리하자면, 성능 보단, 개발하기 편해서 react-konva를 사용` 



<br />

## 개발하면서 고민한 내용
### 📝 Figma처럼 대량의 History 한번에 undo / redo 기능 구현하기
> 일반적인 하나의 작업을 되돌리기(undo) / 복구하기(redo) 가 아니였습니다. <br />
> 다수의 작업을 한 번에 되돌리기(undo) / 복구하기(redo) 가 되어야 합니다. <br />
> 콜 스택에서 발생한 작업을 대기 큐에 쌓습니다.  
> MicroTaskQueue를 사용해 대기 큐에 있는 작업들을 하나의 History로 묶어 적재합니다.  
> 되돌리기(Undo) 시, 묶인 History를 한 번에 롤백합니다.
<img width="500" height="400" alt="image" src="https://github.com/user-attachments/assets/bf9632e6-4e50-4590-adad-f91e845caaac" /> 


<br />
<br />

### 📝 확장 가능한 도형 드로잉 구조 설계하기
> Figma와 같이 Konva에서 제공해주는 도형은 (선, 원, 타원, 직선, 사각형, 별 ... ) 굉장히 많습니다.  <br />
> 각 도형마다 계산되야 하는 로직이 다릅니다. <br />
> 예를 들어, 원 같은 경우 radius로 크기를 계산해야 하지만, 사각형은 width, height 등으로 계산해야 합니다.  <br />
> 마찬가지로 선, 원, 사각형 등 각각 다른 속성에 별도의 계산 로직을 가지고 있는 상태입니다.  <br />
>
> 하지만, 공통적으로 사용되는 인터페이스는 동일 합니다. Move, Scale, Rotate 등이 존재합니다.
> 저는 이러한 인터페이스 등을 이용하여 전략 패턴으로 설계했습니다.
<img width="800" height="700" alt="image" src="https://github.com/user-attachments/assets/e9f2b14c-f337-48c4-b9e9-c1480456b857" />

> 즉 공통적으로 사용되는 인터페이스들은 추상 클래스에 정의했습니다. <br />
> 더불어, 공통적으로 사용되는 로직들, up, dragEnd, update와 같은 로직들은 추상 클래스에서 정의하고, 상속하기 위해 abstract 클래스를 사용했습니다.  <br />
> 각각의 도형들에서 세부 로직들을 구체화 하도록 했습니다.  <br />
> 이렇게 하면 각 도형이 독립적으로 동작하면서도 일관된 인터페이스를 유지할 수 있습니다.    <br />
> 또한, 사용자가 다양한 도형을 사용할 때 전략 패턴을 적용해 런타임에서 유연하게 행동을 바꿀 수 있도록 설계했습니다.  <br />

<br />


## 기술 블로그

  - [Figma처럼 Undo/Redo 기능 구현하기](https://qjatjs123123.tistory.com/60)
  - [확장 가능한 도형 드로잉 구조, 어떻게 만들까?](https://qjatjs123123.tistory.com/61)
