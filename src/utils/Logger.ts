const error = (message: string): void => {
  console.log(
    `%c[Homeostasis]`,
    "color: red; font-weight: bold;",
    message
  );
};

export { error };
