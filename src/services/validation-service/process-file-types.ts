import { IBase, IProcessFileCallback } from "./models/ValidationTypes";

const processFileTypes = (
  props: IBase,
  callback: (returnProps: IProcessFileCallback) => void
): void => {
  const { fileType } = props;
  fileType.forEach((currentType: string) => {
    const isDirectoryOrFile =
      currentType === "directories" ? "directory" : "file";
    callback({
      currentType,
      isDirectoryOrFile,
    });
  });
};

export default processFileTypes;
