const hre = require("hardhat");

async function main() {
  const Todo = await hre.ethers.getContractFactory("Todo");
  const todo = await Todo.deploy();

  await todo.deployed();

  console.log(`Todo List Contract Deployed to : ${todo.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
