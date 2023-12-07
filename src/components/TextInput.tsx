import './TextInput.scss';

type textInputType = {
  error?: boolean;
  placeholder?: string;
  type?: 'text' | 'password';
  value: string;
  setValue: (arg0: string) => void;
};

const TextInput = ({
  error = false,
  placeholder = 'Type Here...',
  type = 'text',
  value = '',
  setValue,
}: textInputType) => {
  return (
    <input
      className={`text-input${error ? ' error' : ''}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    />
  );
};

export default TextInput;
