const error = (message: string): void => {
  console.log(
    `%c-`,
    "color: red; font-weight: bold;",
    message
  );
};

export { error };
