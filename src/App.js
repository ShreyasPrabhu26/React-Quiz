import { useEffect, useReducer } from "react";
import Header from "./Header"
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";

const initialState = {
  questions: [],

  //Loading,Error,Ready,Active,Finished
  status: "loading"
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
    default:
      throw new Error("Action is Unknown !!!");
  }
}

function App() {
  const [{ questions, status }, dispatch] = useReducer(reducer, initialState);

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
        {status === "ready" && <StartScreen numQuestion={numQuestion} />}
      </Main>

    </div>
  </>
}

export default App;