import { remultNextApp } from "remult/remult-next";
import { Task } from "@/models/task"

const api = remultNextApp({
    entities: [Task],

})

export const {GET, PUT, POST, DELETE} = api