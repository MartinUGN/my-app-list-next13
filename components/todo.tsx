'use client'

import { Task } from "@/models/task"
import { remult } from "remult"
import { FormEvent, useEffect, useState } from "react"

const taskRepo = remult.repo(Task)

export default function Todo(){
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTaskTitle, setNewTaskTitle]= useState("")

    useEffect(() => {
        taskRepo.find({
            orderBy: {
                createdAt : "asc",
            },
            where:{
                completed: undefined,
            }
        }).then(setTasks)
    },[])

    async function addTask(event:FormEvent<HTMLFormElement>){
        event.preventDefault()
        try{
            const newTask = await taskRepo.insert ({title: newTaskTitle})
            setTasks([...tasks,newTask])
            setNewTaskTitle("")
        }catch (err:any){
            alert (err.message)
        }
    }

    async function setCompleted(task: Task, completed: boolean){
        const updateTask = await taskRepo.save ({...task, completed})
        setTasks(tasks.map((t)=> (t== task ? updateTask : t)))
    }

    async function deleteTask(task: Task) {
        try {
          await taskRepo.delete(task)
          setTasks(tasks.filter((t) => t !== task))
        } catch (err: any) {
          alert(err.message)
        }
      }

    return(
        <div>
            <h1>Todos {tasks.length}</h1>
            <main>
                <form onSubmit={addTask}>
                    <input value={newTaskTitle} placeholder="Que necesitas hacer?" 
                    onChange={(e)=> setNewTaskTitle (e.target.value)}/>
                    <button>Agregar</button>
                </form>
                {tasks.map((task) =>{
                    return(<div key={task.id}> 
                    <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={(e)=> setCompleted(task, e.target.checked)}/>
                        
                    <span>{task.title}</span>
                    <button onClick={() => deleteTask(task)}>Delete</button>
                    </div>
                    )
                })}
            </main>
        </div>
    )
}