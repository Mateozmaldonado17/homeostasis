import { SystemLogTypeEnum } from "../../enums";
import IResponse from "../../models/IResponse";

const reset = "\x1b[0m";

const getLogFormatted = (props: IResponse): string => {
  const { logType, message } = props;
  let errorTypeFormatted;
  let backgroundColor;
  let textColor;

  switch (logType) {
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

const sendLog = (props: Partial<IResponse>): void => {
  const formattedMessage = getLogFormatted(props as IResponse);
  console.log(formattedMessage);
};

export { getLogFormatted, sendLog };
