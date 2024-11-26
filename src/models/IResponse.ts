import { SystemLogTypeEnum } from "../enums";

interface IResponse {
    logType: SystemLogTypeEnum,
    fullpath: string;
    name: string;
    message: string;
  }

export default IResponse;