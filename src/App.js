import { useEffect, useReducer } from "react";
import Header from "./components/Header"
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Questions from "./components/Questions";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";

const initialState = {
  questions: [],

  //Loading,Error,Ready,Active,Finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0
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
        ...state, status: "active",
      }

    case "newAnswer":
      const question = state.questions.at(state.index);
      const point = question.points;

      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? (state.points + point) : (state.points),
      }

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null
      }

    case "finished":
      return {
        ...state,
        status: "finished",
        highscore: state.points > state.highScore ? state.points : state.highScore
      }

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready"
      }

    default:
      throw new Error("Action is Unknown !!!");
  }
}

function App() {
  const [{ questions, status, index, answer, points, highscore }, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0)

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
            numQuestions={numQuestions}
            dispatch={dispatch}
          />}

        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              answer={answer}
              maxPossiblePoints={maxPossiblePoints}
            />

            <Questions
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />

            <NextButton
              dispatch={dispatch}
              answer={answer}
              index={index}
              numQuestions={numQuestions} />
          </>
        )}

        {status === "finished" && (
          <FinishScreen
            dispatch={dispatch}
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
          />
        )}

      </Main>

    </div>
  </>
}

export default App;