import React, { useState, useEffect } from "react";
import style from "./styles/Home.module.css";

const Home = () => {
	const [task, setTask] = useState([]);
	const [name, setName] = useState("");
	const [usersList, setUsersList] = useState([]);
	const [userDeleted, setUserDeleted] = useState(false);

	const createUser = () => {
		fetch(`https://playground.4geeks.com/todo/users/${name}`, {
			method: "POST"
		})
		.then((response) => response.json())
		.then((data) => {if (data.id) {
			alert("Usuario creado con exito");
			setUserDeleted(prev => !prev);
		} else {
			alert("Algo salió mal");
		}})
		.catch((error) => console.log(error))
	};
	const getUsersList = () => {
		fetch("https://playground.4geeks.com/todo/users")
		.then((response) => response.json())
		.then((data) => setUsersList(data.users))
	};

	const deleteUser = () => {
		fetch(`https://playground.4geeks.com/todo/users/${name}`, {
			method: "DELETE"
		})
		.then((data) => {
			if (data.ok) {
				alert("Usuario eliminado con exito");
				setUserDeleted(prev => !prev);
			} else {
				alert("Algo salió mal");
			}
		})
	};
	const getTasksList = () => {
		fetch(`https://playground.4geeks.com/todo/users/${name}`)
		.then((response) => response.json())
		.then((data) => {
			if (data.todos) {
				setTask(data.todos);
			}
		})
	}
	const createTask = (e) => {
		e.preventDefault();
		const valueInput = e.target.addTask.value
		const newTask = {
			label: valueInput,
			is_done: false
		}
		if (valueInput !== "") {
			e.target.addTask.value = "";
			alert("Tarea creada con exito")
		}
		fetch(`https://playground.4geeks.com/todo/todos/${name}`, {
			method: "POST",
			headers: {
				"Content-Type": "Application/json"
			},
			body: JSON.stringify(newTask)
		})
		.then((response) => response.json())
		.then((data) => setTask(prevTask => [...prevTask, data]))
		.catch((error) => console.log(error))
	}

	const deleteTask = (index) => {
		let newArr = task.filter((_,i) => i !== index)
		setTask(newArr);
	};
	
	// const deleteTask = () => {
	// 	fetch(`https://playground.4geeks.com/todo/todos/${}`, {
	// 		method: "DELETE",
	// 	})
	// 	.then((data) => {
	// 		if (data.ok) {
	// 			setTask();
	// 		} else {
	// 			console.log("Algo salio mal");
	// 		}
	// 	})
	// 	.catch((error) => console.log(error))
	// };

	useEffect(() => {
		getUsersList()
	}, [userDeleted]);

	return (
		<div className="container-fluid p-5 m-0">
			{/* input para introducir usuarios y boton que ejecute crear usuario*/}
			<input type="text" onChange={(e)=>setName(e.target.value)}/>
			<button onClick={createUser}>Create User</button>
			<button onClick={deleteUser}>Delete User</button>
			<button onClick={getTasksList}>Get Task</button>

			<label>Lista de Usuarios</label>
			{
				usersList.map((item,index)=>(
					<h5 key={index}>{item.name}</h5>
				))
			}
			<h1 className="text-center fst-italic fw-bold display-1 mt-4 text-success">To Do List</h1>
			<form className="p-1 w-75 mx-auto bg-danger-subtle rounded shadow" onSubmit={createTask}>
				<ul className="list-group">
					<li className="list-group-item">
						<input type="text" className={`form-control ${style.inputTask}`} id="addTask" placeholder="What needs to be done?"/>
					</li>
					{
						task.map((item, index) => (
							<li key={index} className={`list-group-item d-flex justify-content-between ${style.listTask}`}> {item.label} <i className={`fa-solid fa-xmark bg-danger-subtle p-1 ${style.iconTask}`} onClick={()=>deleteTask(index)}></i></li>
						))
					}
					<li className="list-group-item text-secondary">{(task.length===0)? "No tasks, add a task" : "Finish your tasks! You won’t be sleeping tonight!"}</li>
					<li className="list-group-item fw-light fst-italic text-secondary">{task.length} item left</li>
				</ul>
			</form>
		</div>
	);
};
export default Home;
