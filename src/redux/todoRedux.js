import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

let url = "http://localhost:8080"
// 가져오기.
export const getTodosAsync = createAsyncThunk(
    "todos/getTodosAsync",
    async ()=>{
        const response = await fetch(url+"/api/v1/todos")
        if(response.ok){
            const todos = await response.json();
            return {todos}
        }
})
// 보내기
export const addTodoAsync = createAsyncThunk("todos/addTodoAsync",
    async (payload) =>{
        const response = await fetch(url+"/api/v1/todos",{
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({content:payload.content})
        })
        if (response.ok){
            const todo = await response.json();
            return { todo }
        }
})
// 완료 표시
export const toggleCompleteAsync = createAsyncThunk("todos/toggleCompleteAsync",
    async(payload)=>{
        const response = await fetch(url+"/api/v1/todos/"+`${payload.id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            // body:JSON.stringify({isComepleted:payload.isComepleted})
            body:JSON.stringify({content:payload.content})
        })
        if (response.ok){
            const todo = await response.json();
            return { id:todo.id, iscompleted:todo.isCompleted }
        }
})
// 삭제
export const deleteTodoAsync = createAsyncThunk(
	'todos/deleteTodoAsync',
	async (payload) => {
		const response = await fetch(url+"/api/v1/todos/"+`${payload.id}`, {
			method: 'DELETE',
		});
		if (response.ok) {
			return { id: payload.id };
		}
	}
);
const todoSlice = createSlice({
    name:'todos',
    initialState:[],
    reducers:{
        addTodo:(state,action) =>{ // 추가 기능
            const newTodo = {
                id:Math.random()*1000,
                text:action.payload.text,
                subText:action.payload.subText,
                isCompleted:false,
            };
        state.push(newTodo)
        // return [...state,newTodo]
        },
        toggleComplete:(state,action) => { // 완료 기능
            const index = state.findIndex(
                (todo)=>todo.id === action.payload.id
            )
            state[index].isCompleted = action.payload.isCompleted;
        },
        deleteTodo: (state,action) => {
            return state.filter((states)=>states.id !== action.payload.id)
        }
    },
    extraReducers:{
        [getTodosAsync.fulfilled]:(state,action) => {
            console.log("fetching data successfully")
            return action.payload.todos
        },
        [addTodoAsync.fulfilled]:(state,action)=>{
            state.push(action.payload.todo);
        },
        [toggleCompleteAsync.fulfilled]:(state,action)=>{
            const index = state.findIndex(
                (todo)=>todo.id === action.payload.id
            )
            state[index].isCompleted = action.payload.isCompleted;
        },
        [deleteTodoAsync.fulfilled]: (state, action) => {
			return state.filter((todo) => todo.id !== action.payload.id);
		},
    }
})

export const { addTodo, toggleComplete, deleteTodo } = todoSlice.actions
export default todoSlice.reducer;