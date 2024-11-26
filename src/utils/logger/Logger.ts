import { ErrorTypeEnum } from "../../enums";

const reset = "\x1b[0m";

interface IGetErrorProps {
  errorType: ErrorTypeEnum;
  message: string;
}

const getErrorFormated = (props: IGetErrorProps): string => {
  const { errorType, message } = props;
  let errorTypeFormatted;
  let backgroundColor;
  let textColor;

  switch (errorType) {
    case ErrorTypeEnum.FATAL:
      errorTypeFormatted = ErrorTypeEnum.FATAL;
      backgroundColor = "\x1b[48;2;139;0;0m";
      textColor = "\x1b[38;2;255;255;255m";
      break;
    case ErrorTypeEnum.ERROR:
      errorTypeFormatted = ErrorTypeEnum.ERROR;
      backgroundColor = "\x1b[48;2;255;0;0m";
      textColor = "\x1b[38;2;255;255;255m";
      break;
    case ErrorTypeEnum.WARNING:
      errorTypeFormatted = ErrorTypeEnum.WARNING;
      backgroundColor = "\x1b[48;2;255;255;0m";
      textColor = "\x1b[38;2;0;0;0m";
      break;
    case ErrorTypeEnum.SUCCESS:
      errorTypeFormatted = ErrorTypeEnum.SUCCESS;
      backgroundColor = "\x1b[38;2;0;0;0m";
      textColor = "\x1b[38;2;0;255;0m";
      break;
    default:
      errorTypeFormatted = ErrorTypeEnum.LOG;
      backgroundColor = "\x1b[38;2;255;165;0m";
      textColor = "\x1b[38;2;255;255;255m";
      break;
  }

  return `${backgroundColor}${textColor}[${errorTypeFormatted}]${reset}: ${message}`;
};

const sendLog = (props: IGetErrorProps): void => {
  const formattedMessage = getErrorFormated(props);
  console.log(formattedMessage);
};

export { getErrorFormated, sendLog };
