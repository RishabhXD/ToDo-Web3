import React from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
const Task = ({ taskText, onClick }) => {
  return (
    <div className="alert alert-info shadow-lg my-3">
      <div>
        <span>{taskText}</span>
      </div>
      <div className="flex-none">
        <button className="btn btn-sm btn-ghost">
          <MdOutlineDeleteForever fontSize={25} onClick={onClick} />
        </button>
      </div>
    </div>
  );
};

export default Task;
