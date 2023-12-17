import { useMemo, useState } from 'react';

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
type errorType = {
  is: boolean;
  text: string;
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

  /////////////////////////// STEP 0
  const Step0 = useMemo(() => {
    return (
      <div className='step step0'>
        <div className='question'>Enter your full name:</div>
        <TextInput
          error={errorData.is}
          value={data.name}
          setValue={(newValue: string) =>
            setData((prev) => ({ ...prev, name: newValue }))
          }
        />
      </div>
    );
  }, [errorData, data.name]);
  const step0validator = async (): Promise<errorType> => {
    let v: errorType;

    if (data.name == '') v = { is: true, text: 'Field can not be empty.' };
    else v = { is: false, text: '' };

    return v;
  };

  /////////////////////////// STEP 1
  const Step1 = useMemo(() => {
    return (
      <div className='step step1'>
        <div className='question'>Enter your ID:</div>
        <TextInput
          error={errorData.is}
          value={data.id}
          setValue={(newValue: string) =>
            setData((prev) => ({ ...prev, id: newValue }))
          }
        />
      </div>
    );
  }, [errorData, data.id]);
  const step1validator = async (): Promise<errorType> => {
    let v: errorType;

    if (data.id == '') {
      v = { is: true, text: 'Field cannot be empty.' };
    } else {
      try {
        const res = await fetch('http://127.0.0.1:3000/' + data.id);
        const jsonData = await res.json();
        const j = JSON.parse(jsonData);

        if (j.res.length === 0) {
          v = {
            is: true,
            text: `User with the ID ${data.id} doesn't exist.`,
          };
        } else {
          setData((prev) => ({ ...prev, verified: j.res[0].isVerified }));

          v = { is: false, text: '' };
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        v = { is: true, text: 'Error fetching data.' };
      }
    }

    return v;
  };

  /////////////////////////// STEP 2
  const Step2 = useMemo(() => {
    return (
      <div className='show-results'>
        Dear {data.name} with the ID {data.id}, you are
        {data.verified ? '' : ' not'} verified.
      </div>
    );
  }, [data]);
  const step2validator = async (): Promise<errorType> => ({ is: false, text: '' });

  const steps = [Step0, Step1, Step2];
  const validators = [step0validator, step1validator, step2validator];
  const STEP_COUNTS = steps.length;

  return (
    <div className='step-wrapper'>
      {steps[stepNumber]}
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
              validators[stepNumber]().then((v) => {
                if (v.is) {
                  setErrorData(v);
                } else {
                  setErrorData({
                    is: false,
                    text: '',
                  });
                  incrementNumber();
                }
              });
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
