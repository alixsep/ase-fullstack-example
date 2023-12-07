import { useState } from 'react';
import './App.css';

import Wizard from './components/Wizard';

function App() {
  const [stepNumber, setStepNumber] = useState<number>(0);
  const incrementNumber = () => setStepNumber((prev) => prev + 1);
  const decrementNumber = () => setStepNumber((prev) => prev - 1);

  return (
    <div className='app'>
      <Wizard
        stepNumber={stepNumber}
        incrementNumber={incrementNumber}
        decrementNumber={decrementNumber}
      />
    </div>
  );
}

export default App;
