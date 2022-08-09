import { List, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/EditOutlined";
import "./Task.css";

const Task = ({ taskText, handleDelete, handleEdit }) => (
  <List className="todo__list">
    <ListItem style={{ padding: "0 16px" }}>
      <ListItemText style={{ color: "#222" }} primary={taskText} />
    </ListItem>
    {/* TODO: Update edit functionality */}
    {/* <EditIcon
      fontSize="medium"
      style={{ color: "#2a67c0", cursor: "pointer" }}
      onClick={handleEdit}
    /> */}
    <DeleteIcon
      fontSize="medium"
      style={{ color: "#2a67c0", cursor: "pointer", marginRight: "10px" }}
      onClick={handleDelete}
    />
  </List>
);
export default Task;
