import { useState, useEffect } from "react";
import days from "./data";
const colors = [
  "papayawhip",
  "blanchedalmond",
  "peachpuff",
  "bisque",
  "cornsilk",
  "lightyellow",
];

function App() {
  const [color, setColor] = useState("lemonchiffon");
  const [dog, setDog] = useState({});
  const [index, setIndex] = useState(0);
  const [number, setNumber] = useState(0);
  const [today, setToday] = useState({});
  const [vibe, setVibe] = useState("");

  function handleOnChange(event) {
    setVibe(event.target.value);
    //If we pass console.log(vibe) here, it will not display the current vibe.
    //Remember JS is asynchronous so the console log will happen before we setVibe, thus giving us the value of the state before, or in other words, the old value before we update it. If you want to console log the current vibe we need to do a useEffect
  }

  //In this useEffect we say console.log(vibe) everytime vibe is updated. This will successfully console log the current vibe value. Notice how it will console.log every character being typed, since your saying to update every time.
  //Comment this out if you want your console to be clean
  useEffect(() => {
    console.log(vibe)
  },[vibe])

  function updateIndex() {
    setIndex((index + 1) % days.length);
  }
  
  // Why is the dependency array empty? It is empty since we want the effect to be used on mount
  // What happens if you don't include the dependency array in this example? Infinite loop
  // Why did the previous example not require a dependency array? Because we just console logged?
  
  //We want a random number to render on mount. So we useEffect and pass an empty array as it's dependency.
  useEffect(() => {
    setNumber(Math.random());
  }, []);

  //We want to set the date and render every time user clicks on "update day". 
  // Thus we setToday to be our data days[index].
  //We also have to pass index as the dependency. Meaning re-render each time index is updates.
  
  //What this will do is update our variable 'today' with an object, depending on the data's index. Example if days[0] we get {
  //   month: "January",
  //   day: 1,
  //   weekday: "Monday",
  // },

  /* Remember index is random due to updateIndex function. We are passing that function on our "update day" button. So the steps is:
  1. Person clicks on button
  2. updateIndex is fired, passing setIndex to increaase our index by 1
  3. We useEffect to update our variable 'today's empty object to be the object from our data based on the index when the userclicked. So if user clicks button and it's index 2. today will be updated with data[2]'s object. We then pass the dependency of [index] to till React to re-render this component everytime index changes, this occurs on every click.
  */
  useEffect(() => {
    setToday(days[index])
  }, [index]);


  //What if want to change the color of the header, for everytime our month changes? We can useEffect here, which will render the changed color depending if month changes. 
  //Thus we can update color every time our today.month changes. So if it's Jan and then turn to Feb, setColors will update colors by the index
  useEffect(()=> {
    setColor(colors[index])
  },[today.month]);

  //let's use another useEffect to check the colors being switched
  //Below doesn't work as indended. Wasn't working because I put 'colors' as the depenency which is our array. I wanted the dependency to be the variable 'color'. Missed that...little mistakes like this just get me mad...
  // useEffect(() => {
  //   console.log(colors[index]);
  // },[color])

  //If we ever get this warning:  React Hook useEffect has a missing dependency: 'index'. Either include it or remove the dependency array. You can also replace multiple useState variables with useReducer if 'setColor' needs the current value of 'index'  react-hooks/exhaustive-deps
  //We need to confirm the following:
    // Move the entire function into useEffect()
    // Move the function outside the component (if the function does not reference any props or state)
    // Have the function return a value outside of useEffect()
    // Use the method useCallback() (Learning to use this method is not needed for class or labs).


  //Let us now useEffect when fetchin our API. Before we learned useEffect we would just fetch the API, but this would fetch everytime our app re-renders. We want to only fetch 'on mount' thus we need to useEffect to make it so.
  function getFeaturedDogs() {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then((response) => response.json())
      //We then setDogs to be our data from the API
      .then((json) => setDog(json))
      .catch((error) => console.log(`Erro fetching image: ${error}`));
  }
  //We then have to wrap our function with a useEffect and till it to only run on mount, so we also have to pass it a dependency of an empty array
  useEffect(() => {
    getFeaturedDogs();
  }, []);


  return (
    <div className="App">
      <header style={{ backgroundColor: color }}>
        <h1>Daily Home Page </h1>
        <button onClick={updateIndex}>Update Day</button>
      </header>
      <main>
        <div className="date">
          <h2>Todays date:</h2>
          <h3>{today.weekday}</h3>
          <h4>{today.month}</h4>
          <h5>{today.day}</h5>
        </div>
        <div className="lucky">
          <h2>Today's lucky number is: {number}</h2>
        </div>
        <div className="vibe">
          <input
            type="text"
            onChange={handleOnChange}
            placeholder="enter your vibe here"
          />
          <h4>Today's vibe is: </h4>
          <h5>{vibe}</h5>
        </div>
        <div className="dog">
          <button>Change dog</button>
          <h2>Featured dog:</h2>
          <img src={dog.message} alt="Featured Dog" />
        </div>
      </main>
    </div>
  );
}

export default App;
