import { useEffect, useReducer } from "react";
import Header from "./components/Header"
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Questions from "./components/Questions";

const initialState = {
  questions: [],

  //Loading,Error,Ready,Active,Finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0
}

function reducer(state, action) {
  switch (action.type) {
    case "dataRecived":
      return {
        ...state,
        questions: action.payload,
        status: "ready"
      }
    case "dataFailed":
      return {
        ...state, status: "error"
      }
    case "start":
      return {
        ...state, status: "active"
      }
    case "newAnswer":
      const question = state.questions.at(state.index);
      const point = question.points;

      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? (state.points + point) : (state.points),
      }
    default:
      throw new Error("Action is Unknown !!!");
  }
}

function App() {
  const [{ questions, status, index, answer }, dispatch] = useReducer(reducer, initialState);

  const numQuestion = questions.length;

  useEffect(function () {
    async function getData() {
      try {
        const res = await fetch(`http://localhost:8000/questions`)
        const data = await res.json();
        dispatch({ type: "dataRecived", payload: data });
        return data;
      } catch (err) {
        dispatch({ type: "dataFailed" });
      }
    }
    getData();
  }, [])

  return <>
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}

        {status === "ready" &&
          <StartScreen
            numQuestion={numQuestion}
            dispatch={dispatch}
          />}

        {status === "active" &&
          <Questions
            question={questions[index]}
            dispatch={dispatch}
            answer={answer}
          />}

      </Main>

    </div>
  </>
}

export default App;