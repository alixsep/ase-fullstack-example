import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import TextInput from './TextInput';
import './Wizard.scss';

type wizardPropTypes = {
  stepNumber: number;
  incrementNumber: () => void;
  decrementNumber: () => void;
};
type dataType = {
  name: string;
  id: string;
  verified: boolean;
};
type stepType = {
  data: dataType;
  setData: Dispatch<SetStateAction<dataType>>;
  error: boolean;
};
type errorType = {
  is: boolean;
  text: string;
};

const STEP_COUNTS = 3 as const;

///////////////// Step 0
const Step0 = ({ data, setData, error }: stepType) => {
  return (
    <div className='step step0'>
      <div className='question'>Enter your full name:</div>
      <TextInput
        error={error}
        value={data.name}
        setValue={(newValue: string) =>
          setData((prev) => ({ ...prev, name: newValue }))
        }
      />
    </div>
  );
};

///////////////// Step 1
const Step1 = ({ data, setData, error }: stepType) => {
  return (
    <div className='step step1'>
      <div className='question'>Enter your ID:</div>
      <TextInput
        error={error}
        value={data.id}
        setValue={(newValue: string) =>
          setData((prev) => ({ ...prev, id: newValue }))
        }
      />
    </div>
  );
};

///////////////// Step 2
const Step2 = ({ data, setData, error }: stepType) => {
  return <div className='show-results'>{data.verified}</div>;
};

const steps = (
  step: number,
  data: dataType,
  setData: stepType['setData'],
  error: boolean
) => {
  switch (step) {
    case 0:
      return <Step0 data={data} setData={setData} error={error} />;

    case 1:
      return <Step1 data={data} setData={setData} error={error} />;

    case 2:
      return <Step2 data={data} setData={setData} error={error} />;

    default:
      break;
  }
};

const stepsValidators = [
  (i: string) => {
    if (i == '') return { is: true, text: 'Field can not be empty.' };
    return { is: false, text: '' };
  },
  (i: string) => {
    if (i == '') return { is: true, text: 'Field can not be empty.' };
    else {
      fetch('http://127.0.0.1:3000/' + i)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          console.log(res);
        });
    }
  },
  (i: string) => {
    return { is: false, text: '' };
  },
];

const checkValidation = (step: number, i: string) => {
  return stepsValidators[step](i);
};

const Wizard = ({
  stepNumber,
  incrementNumber,
  decrementNumber,
}: wizardPropTypes) => {
  const [data, setData] = useState<dataType>({
    name: '',
    id: '',
    verified: false,
  });
  const [errorData, setErrorData] = useState<errorType>({
    is: false,
    text: '',
  });

  return (
    <div className='step-wrapper'>
      {steps(stepNumber, data, setData, errorData.is)}
      <div className='buttons'>
        <div
          className={`button${stepNumber == 0 ? ' disabled' : ''}`}
          onClick={() => {
            if (stepNumber != 0) decrementNumber();
          }}
        >
          {'<'}
        </div>
        <div
          className={`button${
            stepNumber == STEP_COUNTS - 1 ? ' disabled' : ''
          }`}
          onClick={() => {
            if (stepNumber != STEP_COUNTS - 1) {
              let validationString = '';
              if (stepNumber == 0) validationString = data.name;
              if (stepNumber == 1) validationString = data.id;
              const v = checkValidation(stepNumber, validationString);
              console.log(v);

              if (v.is) {
                setErrorData(v);
              } else {
                setErrorData({
                  is: false,
                  text: '',
                });
                incrementNumber();
              }
            }
          }}
        >
          {'>'}
        </div>
      </div>
      {errorData.is ? <div className='error-text'>{errorData.text}</div> : null}
    </div>
  );
};

export default Wizard;
