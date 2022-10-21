const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Task Contract", function () {
  let TaskContract;
  let taskContract;
  let owner;

  const num_total_tasks = 5;

  let totalTasks;

  // this will be called before each task
  beforeEach(async function () {
    TaskContract = await ethers.getContractFactory("Todo");
    [owner] = await ethers.getSigners();
    taskContract = await TaskContract.deploy();
    totalTasks = [];
    for (let i = 0; i < num_total_tasks; i++) {
      let task = {
        taskText: "Task number : " + i,
        isDeleted: false,
      };

      await taskContract.addTask(task.taskText, task.isDeleted);
    }
  });

  describe("Add Task", () => {
    it("Should emit AddTask event", async () => {
      let task = {
        taskText: "New Task",
        isDeleted: false,
      };

      await expect(await taskContract.addTask(task.taskText, task.isDeleted))
        .to.emit(taskContract, "AddTask")
        .withArgs(owner.address, num_total_tasks);
    });
  });

  describe("Get All Tasks", () => {
    it("Should return the correct number of tasks", async () => {
      const taskFromChain = await taskContract.getMyTask();
      expect(taskFromChain.length).to.equal(num_total_tasks);
    });
  });

  describe("Delete Tassk", () => {
    it("Should emit DeleteTask event", async () => {
      const task_ID = 0;
      const taskDeleted = true;
      await expect(taskContract.deleteTask(task_ID, taskDeleted))
        .to.emit(taskContract, "DeleteTask")
        .withArgs(task_ID, taskDeleted);
    });
  });
});
