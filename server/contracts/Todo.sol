// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Todo {
    event AddTask(address recipient, uint256 taskID);
    event DeleteTask(uint256 taskID, bool isDeleted);

    struct Task {
        uint256 id;
        string taskText;
        bool isDeleted;
    }

    Task[] private tasks;
    mapping(uint256 => address) taskToOwner;

    function addTask(string memory taskText, bool isDeleted) external {
        uint256 taskID = tasks.length;
        tasks.push(Task(taskID, taskText, isDeleted));
        taskToOwner[taskID] = msg.sender;
        emit AddTask(msg.sender, taskID);
    }

    function getMyTask() external view returns (Task[] memory) {
        Task[] memory temp = new Task[](tasks.length);
        uint256 counter = 0;

        for (uint256 i = 0; i < tasks.length; i++) {
            if (taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
                temp[counter] = tasks[i];
                counter++;
            }
        }

        Task[] memory result = new Task[](counter);
        for (uint256 i = 0; i < counter; i++) {
            result[i] = temp[i];
        }

        return result;
    }

    function deleteTask(uint256 taskId, bool isDeleted) external {
        if (taskToOwner[taskId] == msg.sender) {
            tasks[taskId].isDeleted = true;
            emit DeleteTask(taskId, isDeleted);
        }
    }
}
