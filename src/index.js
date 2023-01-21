const chalk = require("chalk");
const server = require("./app");

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(chalk.yellow(`Server listening to ${port}...`));
});
