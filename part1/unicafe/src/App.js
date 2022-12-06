import { useState } from 'react'


const Header = props => <h1>{props.value}</h1>
const Content = props => {
  return (
    <>
      <span>{props.text} {props.value}</span>
      <br/>
    </>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const sumArray = (arr) => arr.reduce((partialSum, a) => partialSum + a, 0)
  const avgArray = (arr) => (arr[0] - arr[2]) / sumArray(arr)
  const positiveInArray = (arr) => (arr[0] / sumArray(arr)) * 100 + " %"

  return (
    <div>
      <Header value="give feedback" />
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />

      <Header value="statistics" />
      <Content text="good" value={good} />
      <Content text="neutral" value={neutral} />
      <Content text="bad" value={bad} />

      <Content text="all" value={sumArray([good, neutral, bad])} />
      <Content text="average" value={avgArray([good, neutral, bad])} />
      <Content text="positive" value={positiveInArray([good, neutral, bad])} />

    </div>
  )
}

export default App