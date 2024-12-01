import getLogFormatted from "./get-log-formatted";
import IResponse from "../../models/IResponse";

const sendLog = (props: Partial<IResponse>): void => {
  const formattedMessage = getLogFormatted(props as IResponse);
  console.log(formattedMessage);
};

export default sendLog;
