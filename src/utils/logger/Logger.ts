import { SystemLogTypeEnum } from "../../enums";

const reset = "\x1b[0m";

interface IGetErrorProps {
  errorType: SystemLogTypeEnum;
  message: string;
}

const getErrorFormated = (props: IGetErrorProps): string => {
  const { errorType, message } = props;
  let errorTypeFormatted;
  let backgroundColor;
  let textColor;

  switch (errorType) {
    case SystemLogTypeEnum.FATAL:
      errorTypeFormatted = SystemLogTypeEnum.FATAL;
      backgroundColor = "\x1b[48;2;139;0;0m";
      textColor = "\x1b[38;2;255;255;255m";
      break;
    case SystemLogTypeEnum.ERROR:
      errorTypeFormatted = SystemLogTypeEnum.ERROR;
      backgroundColor = "\x1b[48;2;255;0;0m";
      textColor = "\x1b[38;2;255;255;255m";
      break;
    case SystemLogTypeEnum.WARNING:
      errorTypeFormatted = SystemLogTypeEnum.WARNING;
      backgroundColor = "\x1b[48;2;255;255;0m";
      textColor = "\x1b[38;2;0;0;0m";
      break;
    case SystemLogTypeEnum.SUCCESS:
      errorTypeFormatted = SystemLogTypeEnum.SUCCESS;
      backgroundColor = "\x1b[38;2;0;0;0m";
      textColor = "\x1b[38;2;0;255;0m";
      break;
    default:
      errorTypeFormatted = SystemLogTypeEnum.LOG;
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
