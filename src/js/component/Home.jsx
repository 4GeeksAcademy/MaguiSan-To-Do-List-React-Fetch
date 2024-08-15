import React, { useState, useEffect } from "react";
import style from "./styles/Home.module.css";
const Home = () => {
    //declarando estados
	const [task, setTask] = useState([]);
    //declarando la funcion del evento submit para que agregue tareas
	const sendData = (event) => {
		event.preventDefault();
		let valueInput = event.target.addTask.value
		if (valueInput !== "") {
			const newTask = task.concat(valueInput);
			setTask(newTask);
			event.target.addTask.value = "";
		}
	};
	console.log(task);
	//Declarando la funcion para que el icono 'x' pueda eliminar tareas de la lista
	const deleteTask = (index) => {
		let newArr = task.filter((_,i) => i !== index)
		setTask(newArr);
	};
	//FETCH
	//variable donde se guardara todos los usuarios
	const [name,setName] = useState("");
	const [usersList, setUsersList] =useState([])

	//Creando usuario con Fetch - no lo recibe por body si no por params(enviar informacion por parametros)
	function createUser() {
		fetch(`https://playground.4geeks.com/todo/users/${name}`, {
			method: "POST"
		})
		// considerando el id mayor que cero
		.then((response)=>response.json())
		.then((data) => {if (data.id) {
			alert("Usuario creado con exito")			
		} else {
			alert("Upps...Exploto todo! Algo salio mal!")
		}})
		.catch((error)=>console.log(error))
	};
	//Obteniendo usuarios de la data
	//de forma nativa se manda con un GET, no es necesario colocarlo
	const getUsers = () => {
		fetch("https://playground.4geeks.com/todo/users")
		//1era,puede estar pendiente de resolverse. resuelta y esta todo bien o puede haber salido un error, estos son los tres estados de la promesa
		//error o resuelto, resuelto lo va a tratar el si no lo manda al catch
		//response.json traduce de json a formato legible de javaescript (ya es la data js)
		.then((response) => response.json())
		//trata la data, lo resultante del cuerpo de codigo del then anterior es lo q recibe del then sgte (este espera al then anterior)
		//data (objeto mayor) la informacion q esta en users es un array data.user (array de objetos), users es la propiedad
		//la info lo vamos a guardar en un local
		.then((data) =>{
			setUsersList(data.users)
		})
	};
	//tenemos dos argumentos, una funcion y un array-->apenas se recargue la pagina, veremos la lista de usuarios
	useEffect(()=>{
		getUsers()
	},[]);
	return (
		<div className="container-fluid p-5 m-0">
			{/* input para introducir usuarios y boton que ejecute crear usuario*/}
			<input type="text" onChange={(e)=>setName(e.target.value)}/>
			<button onClick={createUser}>Create User</button>
			<label>Lista de Usuarios</label>
			{
				usersList.map((item,index)=>(
					<h5 key={index}>{item.name}</h5>
				))
			}
			<h1 className="text-center fst-italic fw-bold display-1 mt-4 text-success">To Do List</h1>
			<form className="p-1 w-75 mx-auto bg-danger-subtle rounded shadow" onSubmit={sendData}>
				<ul className="list-group">
					<li className="list-group-item">
						<input type="text" className={`form-control ${style.inputTask}`} id="addTask" placeholder="What needs to be done?"/>
					</li>
					{
						task.map((item, index) => (
							<li id={index} key={index} className={`list-group-item d-flex justify-content-between ${style.listTask}`}> {item} <i className={`fa-solid fa-xmark bg-danger-subtle p-1 ${style.iconTask}`} onClick={() => deleteTask(index)}></i></li>
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
