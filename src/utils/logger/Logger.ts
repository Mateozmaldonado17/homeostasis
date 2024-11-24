import chalk from 'chalk';
import { ErrorTypeEnum } from "../../enums";

interface IGetErrorProps {
  errorType: ErrorTypeEnum,
  message: string;
}

const getErrorFormated = (props: IGetErrorProps): string => {
  const { errorType, message } = props;
  let errorTypeFormatted;

  switch (errorType) {
    case ErrorTypeEnum.FATAL:
      errorTypeFormatted = chalk.red(ErrorTypeEnum.FATAL)
      break;
    case ErrorTypeEnum.ERROR:
      errorTypeFormatted = chalk.red(ErrorTypeEnum.ERROR)
    case ErrorTypeEnum.WARNING:
        errorTypeFormatted = chalk.yellow(ErrorTypeEnum.WARNING)
        break;
    default:
      errorTypeFormatted = chalk.green(ErrorTypeEnum.LOG)
      break;
  }

  return `[${errorTypeFormatted}]: ${message}`;
}

const sendLog = (props: IGetErrorProps): void => {
  const formattedMessage = getErrorFormated(props);
  console.log(formattedMessage)
};

export { getErrorFormated, sendLog };
