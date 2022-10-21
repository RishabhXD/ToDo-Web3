import React, { useState, useEffect } from "react";
import { TaskContractAddress } from "./config";
import { ethers } from "ethers";
import TaskAbi from "./utils/Todo.json";
import { GrAddCircle } from "react-icons/gr";
import Task from "./components/Task";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const getAllTasks = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        let allTasks = await TaskContract.getMyTask();
        setTasks(allTasks);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  // Connecting metamask
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Metamask not connected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);
      const goerliChainId = "0x5";

      if (chainId != goerliChainId) {
        alert("Not Connected to Goerli Chain");
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };
  const addTask = async (e) => {
    e.preventDefault();

    let task = {
      taskText: input,
      isDeleted: false,
    };

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        TaskContract.addTask(task.taskText, task.isDeleted)
          .then((response) => {
            setTasks([...tasks, task]);
            console.log("Completed Task");
          })
          .catch((err) => {
            console.log("Error occured while adding a new task");
          });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error submitting new Tweet", error);
    }

    setInput("");
  };

  const deleteTask = (key) => async () => {
    console.log(key);

    // Now we got the key, let's delete our tweet
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        let deleteTaskTx = await TaskContract.deleteTask(key, true);
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {currentAccount === "" ? (
        <div className="grid h-screen place-items-center">
          <button className="btn btn-wide" onClick={connectWallet}>
            Connect Wallet
          </button>
        </div>
      ) : correctNetwork ? (
        <div className="min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w">
              <h1 className="text-md font-bold">
                Welcome to Todo3.0 {currentAccount}
              </h1>
              <form>
                <input
                  type="text"
                  placeholder="Enter Task"
                  className="input input-bordered input-info w-full max-w-xs m-3"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button className="btn btn-info" onClick={addTask}>
                  <GrAddCircle fontSize={16} />
                  Add Task
                </button>
              </form>
              <ul>
                {tasks.map((item) => (
                  <Task
                    key={item.id}
                    taskText={item.taskText}
                    onClick={deleteTask(item.id)}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid h-screen place-items-center">
          <div className="alert alert-error shadow-l">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Please Connect to correct testnet.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
