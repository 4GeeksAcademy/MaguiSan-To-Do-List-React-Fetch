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
			// alert("Tarea creada con exito")
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
	
	const deleteTask = (id) => {
		fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: "DELETE",
		})
		.then((response) => {
			console.log(response);
			let newList = task.filter((item) => item.id !==id)
			setTask(newList);
		})
		.catch((error) => console.log(error))
	};

	useEffect(() => {
		getUsersList()
	}, [userDeleted]);

	return (
		<div className="container-fluid p-4 m-0">
			<h2 className={`text-center display-1 my-5 fw-bold text-info ${style.titleToDo}`}>To Do List</h2>
			<div className="container p-1 w-75 mx-auto">
				<div className="row">
					<div className="col">
						<input className="form-control" id="addUser" type="text" placeholder="Add user" onChange={(e) => setName(e.target.value)} />
					</div>
					<div className="col">
						<button className="border-1 rounded p-1 m-1 shadow-sm" onClick={createUser}>Create User</button>
					</div>
				</div>
				<div className="row">
					<div className="col">
						<select className="form-select mb-3" id="user-select" value={name} onChange={(e) => setName(e.target.value)}>
							<option className="text-center">-----select user-----</option>
							{
								usersList.map((item, index) => (
									<option key={index}>{item.name}</option>
								))
							}
						</select>
					</div>
					<div className="col">
						<button className="border-1 rounded p-1 m-1 shadow-sm" onClick={deleteUser}>Delete User</button>
						<button className="border-1 rounded p-1 m-1 shadow-sm" onClick={getTasksList}>Get Task</button>
					</div>
				</div>

			</div>
			<form className="p-1 w-75 mx-auto rounded bg-secondary-subtle shadow" onSubmit={createTask}>
				<ul className="list-group">
					<li className="list-group-item">
						<input type="text" className={`form-control w-100 ${style.inputTask}`} id="addTask" placeholder="What needs to be done?"/>
					</li>
					{
						task.map((item, index) => (
							<li key={index} className={`list-group-item d-flex justify-content-between ${style.listTask}`}> {item.label} <i className={`fa-solid fa-xmark bg-danger-subtle p-1 ${style.iconTask}`} onClick={()=>deleteTask(item.id)}></i></li>
						))
					}
					<li className="list-group-item text-secondary">{(task.length===0)? "No tasks, add a task" : "Finish your tasks!"}</li>
					<li className="list-group-item fw-light fst-italic text-secondary">{task.length} item left</li>
				</ul>
			</form>
		</div>
	);
};
export default Home;
