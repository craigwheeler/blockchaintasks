import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import Task from "./Task";
import "./App.css";
import { TaskContractAddress } from "./config.js";
import { ethers } from "ethers";
import TaskAbi from "./utils/TaskContract.json";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import AddTask from "@mui/icons-material/AddTask";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);

      const goerliChainId = "0x5";

      if (chainId !== goerliChainId) {
        alert("You are not connected to the Goerli Testnet!");
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Found account: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error connecting to metamask: ", error);
    }
  };

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

        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log("error: ", error);
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
            console.log("Error occurred while adding a new task");
          });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error submitting new task", error);
    }

    setInput("");
  };

  const deleteTask = (key) => async () => {
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
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  return (
    <div>
      {currentAccount === "" ? (
        <button
          className="text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : correctNetwork ? (
        <div className="App">
          <div className="container">
            <h2>Blockchain Tasks</h2>
            <form>
              <TextField
                label="Add a Task"
                helperText="Please enter your next task"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ width: "100%" }}
                InputProps={{
                  style: { padding: "0 25px 0 0" },
                  endAdornment: (
                    <InputAdornment position="end" onClick={addTask}>
                      <IconButton edge="end" color="primary">
                        <AddTask />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
            <ul>
              {tasks.map((item) => (
                <Task
                  key={item.id}
                  taskText={item.taskText}
                  handleDelete={deleteTask(item.id)}
                />
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3">
          <div>-----------------------------------------------</div>
          <div>Please connect to the Goerli Testnet and reload</div>
          <div>-----------------------------------------------</div>
        </div>
      )}
    </div>
  );
}

export default App;
