import React, {useState,useEffect,createContext} from 'react'
import {sun,moon, light,lightM, dark, darkM ,check} from './assets'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export const ThemeContext = createContext(null);

const App = () => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('Theme');
    return storedTheme ? JSON.parse(storedTheme) : 'dark'; // Set the default theme if not in local storage
  });
  
  const [todo, setTodo] = useState([])
  const [completed, setCompleted] = useState([])
  const [inputValue, setInputValue ] = useState("")
  const [count, setCount] = useState(0)
  const [filter, setFilter] = useState('all');


const showAll = () => setFilter('all');
const showActive = () => setFilter('active');
const showCompleted = () => setFilter('completed');
  
const clearArray = () => {
  setCompleted([]);
  localStorage.setItem('Completed', JSON.stringify([]));
};

const toggleTheme = () => {
  const newTheme = theme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  localStorage.setItem('Theme', JSON.stringify(newTheme));
};


useEffect(() => {
  const storedTheme = localStorage.getItem('Theme');
  console.log('Stored Theme:', storedTheme);
  if (storedTheme) {
    setTheme(JSON.parse(storedTheme));
  }
  else {
    setTheme('dark')
  }
},[]);

// Now, add an effect to save the theme to local storage whenever it changes
useEffect(() => {
  localStorage.setItem('Theme', JSON.stringify(theme));
  console.log('Current Theme:', theme);
}, [theme]);



const handleInputChange = (e) => {
  setInputValue(e.target.value);
};

const deleteTodo = (index) => {

  // Remove the item from the 'todo' array
  setTodo((prevTodo) => prevTodo.filter((_, i) => i !== index));
  setCount((prevCount) => prevCount - 1);
  localStorage.setItem('Count', JSON.stringify(count - 1));
  localStorage.setItem('Todos', JSON.stringify([...todo.filter((_, i) => i !== index)]));
}
const deleteCompleted = (index) => {

  // Remove the item from the 'completed' array
  setCompleted((prevCompleted) => prevCompleted.filter((_, i) => i !== index));
  localStorage.setItem('Completed', JSON.stringify([...completed.filter((_, i) => i !== index)]));
}

const markAsCompleted = (index) => {
  // Update the 'completed' property of the item
  const updatedTodo = [...todo];

  // Update the 'completed' array with the marked item
  setCompleted((prevCompleted) => [...prevCompleted, updatedTodo[index]]);

  // Remove the item from the 'todo' array
  setTodo((prevTodo) => prevTodo.filter((_, i) => i !== index));

  // Update the count
  setCount((prevCount) => prevCount - 1);


  // Update local storage for 'Count'
  localStorage.setItem('Count', JSON.stringify(count - 1));

  // Update local storage for 'Completed' and 'Todos'
  localStorage.setItem('Completed', JSON.stringify([...completed, updatedTodo[index]]));
  localStorage.setItem('Todos', JSON.stringify(todo.filter((_, i) => i !== index)));
};

const unmarkAsCompleted = (index) => {
  // Update the 'completed' property of the item
  const updatedCompleted = [...completed];

  // Update the 'todo' array with the unmarked item
  setTodo((prevTodo) => [...prevTodo, updatedCompleted[index]]);

  // Remove the item from the 'completed' array
  setCompleted((prevCompleted) => prevCompleted.filter((_, i) => i !== index));

  // Update the count
  setCount((prevCount) => prevCount + 1);

  // Update local storage for 'Count'
  localStorage.setItem('Count', JSON.stringify(count + 1));

  // Update local storage for 'Completed' and 'Todos'
  localStorage.setItem('Completed', JSON.stringify(completed.filter((_, i) => i !== index)));
  localStorage.setItem('Todos', JSON.stringify([...todo, updatedCompleted[index]]));
};





const handleSubmit = (e) => {
  e.preventDefault();
  if (inputValue.trim() !== '') {
    const todoObject = { text: inputValue, id: count };

    // Update the todo and completed arrays
    setTodo((prevTodo) => [...prevTodo, todoObject]);

    // Increment the count after updating the state
    setCount(todo.length + 1);

    // Update local storage
    localStorage.setItem('Todos', JSON.stringify([...todo, todoObject]));
    localStorage.setItem('Count', JSON.stringify(todo.length + 1));
  }
  setInputValue('');
};

const onDragEnd = (result) => {
  if (!result.destination) return; // The item was dropped outside the list

  const updatedTodos = [...todo];
  const [reorderedTodo] = updatedTodos.splice(result.source.index, 1);
  updatedTodos.splice(result.destination.index, 0, reorderedTodo);

  setTodo(updatedTodos);
  localStorage.setItem('Todos', JSON.stringify(updatedTodos))
};



useEffect(() => {
  const storedCount = localStorage.getItem('Count');
  if (storedCount) {
    setCount(parseInt(storedCount, 10)); // Parse the storedCount as an integer
  } else {
    setCount(0);
  }
}, []);

  useEffect(() => {
    const storedTodo = localStorage.getItem('Todos');
    if (storedTodo) {
      setTodo(JSON.parse(storedTodo));
    } else {
      setTodo([]);
    }
  }, []);
  
  useEffect(() => {
    const storedCompleted = localStorage.getItem('Completed');
    if (storedCompleted) {
      setCompleted(JSON.parse(storedCompleted));
    } else {
      setCompleted([]);
    }
  }, []);
  




  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <div id={theme} className='flex flex-col items-center w-full h-full body sm:mt-[78px] mt-[52px]'>
          <img src={theme === 'dark' ? dark : light} className='sm:flex hidden absolute top-0 left-0 z-[0] w-full'/>
          <img src={theme === 'dark' ? darkM : lightM} className='flex sm:hidden absolute top-0 left-0 z-[0] w-full'/>
          
        <main className='relative flex flex-col items-center justify-center sm:w-[600px] w-full z-10 px-6'>
          {/* To do + Sun/Moon state */}
          <div className='sm:w-[600px] w-full z-[12]'>
            <div className='flex justify-between items-center sm:w-[600px] w-full'>
              <h1 className={`uppercase sm:text-[44px] text-[28px] text-white font-[700] sm:tracking-[0.3em] tracking-[0.45em] leading-[0px]`}>Todo</h1>
              <img onClick={toggleTheme} src={theme === "dark" ? sun : moon} className='sm:w-[30px] w-[20px] cursor-pointer' />
            </div>
            {/* Input */}
            <div className={`${theme === 'dark' ? 'bg-veryDarkDesaturatedBlue' : 'bg-veryLightGray'} rounded-sm flex items-center sm:gap-8 gap-3 w-full sm:py-3 py-2 sm:px-6 px-4 sm:mt-12 mt-10`}>
              <div className='w-[25px] h-[25px] mark-svg rounded-full border-[1px] border-veryDarkGrayishBlue1 border-solid'></div>
              <form onSubmit={handleSubmit} className='sm:w-[450px] w-[85%]'>
                <input
                  type='text'
                  id='text'
                  value={inputValue}
                  onChange={handleInputChange}
                  autoComplete='off'
                  placeholder='Create a new todo...'
                  className={`${theme === 'dark' ? 'text-veryLightGrayishBlue' : 'text-veryDarkBlue'} sm:text-[14px] text-[12px] bg-transparent border-none outline-none font-[400] sm:w-[450px] w-full placeholder:text-darkGrayishBlue py-2`} />
              </form>
            </div>
          </div>

          <div className='absolute sm:top-[170px] top-[130px] flex flex-col items-center w-full px-6'>
            <div className={`${theme === 'light' ? 'shadow' : ''} flex flex-col items-center justify-center sm:w-[600px] w-full z-10`}>
            
            {filter === 'all' && (
              <div className='w-full'>
              {completed.length > 0 && 
              
                (completed.map((value, index) => (
                  <div id={value.id} className={`${theme === 'dark' ? 'bg-veryDarkDesaturatedBlue border-dark-mode' : 'bg-veryLightGray border-light-mode'} rounded-sm flex items-center justify-between w-full sm:py-3 py-2 sm:px-6 px-4 todo-list`} key={index}>
                    <div className='flex items-center sm:gap-8 gap-3'>
                      <div onClick={() => unmarkAsCompleted(index)} className={`bg-gradient flex items-center justify-center cursor-pointer rounded-full mark-svg outer-circle relative`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>
                      </div>
                      <p className={`text-darkGrayishBlue sm:text-[14px] text-[12px] line-through bg-transparent border-none outline-none font-[400] placeholder:text-darkGrayishBlue active-todo`}>{value.text}</p>
                    </div>
                    {/* Delete todo */}
                    <div onClick={() => deleteCompleted(index)} className='sm:p-3 sm:py-[inherit] py-3 cursor-pointer close-icon'>
                      <svg className='cursor-pointer close-svg' xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path className={theme === 'dark' ? 'fill-veryDarkGrayishBlue1' : 'fill-black'} fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z" /></svg>
                    </div>
                  </div>
                )))
                }
                
              {/* Active Todos */}
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId='todo-list'>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {todo.map(({id, text}, index) => (
                          <Draggable key={id} draggableId={id.toString()} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                 <div id={id} className={`${theme === 'dark' ? 'bg-veryDarkDesaturatedBlue border-dark-mode' : 'bg-veryLightGray border-light-mode'} select-none rounded-sm flex items-center justify-between w-full sm:py-3 py-2 sm:px-6 px-4 todo-list`} key={index}>
                                  <div className='flex items-center sm:gap-8 gap-3'>
                                    <div onClick={() => markAsCompleted(index)} className={`bg-veryDarkGrayishBlue1 cursor-pointer mark-svg rounded-full outer-circle relative`}>
                                      <div className={`${theme === 'dark' ? 'bg-veryDarkDesaturatedBlue border-dark-mode' : 'bg-veryLightGray border-light-mode'} rounded-full inner-circle `}></div>
                                    </div>
                                    <p className={`${theme === 'dark' ? 'text-lightGrayishBlue' : 'text-veryDarkBlue'} sm:text-[14px] text-[12px] bg-transparent border-none outline-none font-[400] placeholder:text-darkGrayishBlue active-todo`}>{text}</p>
                                  </div>
                                  {/* Delete Todo */}
                                  <div onClick={() => deleteTodo(index)} className='sm:p-3 sm:py-[inherit] py-3 cursor-pointer close-icon'>
                                    <svg className='cursor-pointer close-svg' xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path className={theme === 'dark' ? 'fill-veryDarkGrayishBlue1' : 'fill-black'} fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z" /></svg>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )
            }


            {/* Completed Todos */}
            
            {filter === 'completed' &&
                completed
                .filter((value) => !value.completed)
                .map((value, index) => (
                <div id={value.id} className={`${theme === 'dark' ? 'bg-veryDarkDesaturatedBlue border-dark-mode' : 'bg-veryLightGray border-light-mode'} rounded-sm flex items-center justify-between w-full sm:py-3 py-2 sm:px-6 px-4 todo-list`} key={index}>
                    <div className='flex items-center sm:gap-8 gap-3'>
                      <div onClick={() => unmarkAsCompleted(index)} className={`bg-gradient flex items-center justify-center cursor-pointer rounded-full mark-svg outer-circle relative`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>
                      </div>
                      <p className={`text-darkGrayishBlue sm:text-[14px] text-[12px] line-through bg-transparent border-none outline-none font-[400] placeholder:text-darkGrayishBlue active-todo`}>{value.text}</p>
                    </div>
                    {/* Delete todo */}
                    <div onClick={() => deleteCompleted(index)} className='sm:p-3 sm:py-[inherit] py-3 cursor-pointer close-icon'>
                      <svg className='cursor-pointer close-svg' xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path className={theme === 'dark' ? 'fill-veryDarkGrayishBlue1' : 'fill-black'} fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z" /></svg>
                    </div>
                  </div>
              ))
              }
              
            {/* Active Todos */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="active">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="sm:w-[600px] w-full"
                  >
                    {filter === 'active' &&
                      todo
                        .filter((value) => !value.completed)
                        .map((value, index) => (
                          <Draggable
                            key={value.id}
                            draggableId={value.id.toString()} // Provide a unique ID for each item
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div  id={value.id}  className={`${theme === 'dark' ? 'bg-veryDarkDesaturatedBlue border-dark-mode' : 'bg-veryLightGray border-light-mode'} rounded-sm flex items-center justify-between w-full sm:py-3 py-2 sm:px-6 px-4 todo-list`}   key={index}>
                                  <div className="flex items-center sm:gap-8 gap-3">
                                    <div onClick={() => markAsCompleted(index)} className={`bg-veryDarkGrayishBlue1 cursor-pointer mark-svg rounded-full outer-circle relative`}>
                                      <div
                                        className={`${theme === 'dark' ? 'bg-veryDarkDesaturatedBlue border-dark-mode' : 'bg-veryLightGray border-light-mode'} rounded-full inner-circle `}
                                      ></div>
                                    </div>
                                    <p
                                      className={`${theme === 'dark' ? 'text-lightGrayishBlue' : 'text-veryDarkBlue'} sm:text-[14px] text-[12px] bg-transparent border-none outline-none font-[400] placeholder:text-darkGrayishBlue active-todo`}>
                                      {value.text}
                                    </p>
                                  </div>
                                  <div onClick={() => deleteTodo(index)} className='sm:p-3 sm:py-[inherit] py-3 cursor-pointer close-icon'>
                                    <svg className='cursor-pointer close-svg' xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path className={theme === 'dark' ? 'fill-veryDarkGrayishBlue1' : 'fill-black'} fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z" /></svg>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

                

            
          
            
            {/* Bottom of the list */}
            {todo  &&
              <div className={`${theme === 'dark' ? 'bg-veryDarkDesaturatedBlue' : 'bg-veryLightGray'} select-none rounded-sm flex items-center justify-between w-full py-5 px-6`}>              
                <p className={`${filter !== 'completed' ? 'opacity-100' : 'opacity-0'} sm:text-[14px] text-[12px] text-darkGrayishBlue font-[400]`}>{count} item(s) left</p>
                <div className='sm:flex hidden items-center gap-4'>
                  <p onClick={showAll} className={`${theme === 'dark' ? 'hover:text-veryLightGray' : 'hover:text-veryDarkBlue'} ${filter === 'all' ? 'text-brightBlue' : 'text-darkGrayishBlue'} text-[14px]  font-[400] cursor-pointer`}>All</p>
                  <p onClick={showActive} className={`${theme === 'dark' ? 'hover:text-veryLightGray' : 'hover:text-veryDarkBlue'} ${filter === 'active' ? 'text-brightBlue' : 'text-darkGrayishBlue'} text-[14px] font-[400] cursor-pointer`}>Active</p>
                  <p onClick={showCompleted} className={`${theme === 'dark' ? 'hover:text-veryLightGray' : 'hover:text-veryDarkBlue'} ${filter === 'completed' ? 'text-brightBlue' : 'text-darkGrayishBlue'} text-[14px] font-[400] cursor-pointer`}>Completed</p>
                </div>
                <p onClick={clearArray} className={`${theme === 'dark' ? 'hover:text-veryLightGray' : 'hover:text-veryDarkBlue'} sm:text-[14px] text-[12px] text-darkGrayishBlue font-[400] cursor-pointer`}>Clear Completed</p>
              </div>
            }

            </div>
            {todo && 
              <div className={`${theme === 'dark' ? 'bg-veryDarkDesaturatedBlue' : 'bg-veryLightGray shadow'} sm:hidden flex select-none rounded-md flex items-center justify-center gap-4 w-full py-4 px-6 mt-4`}>
                <p onClick={showAll} className={`${theme === 'dark' ? 'hover:text-veryLightGray' : 'hover:text-veryDarkBlue'} ${filter === 'all' ? 'text-brightBlue' : 'text-darkGrayishBlue'} text-[14px]  font-[400] cursor-pointer`}>All</p>
                  <p onClick={showActive} className={`${theme === 'dark' ? 'hover:text-veryLightGray' : 'hover:text-veryDarkBlue'} ${filter === 'active' ? 'text-brightBlue' : 'text-darkGrayishBlue'} text-[14px] font-[400] cursor-pointer`}>Active</p>
                  <p onClick={showCompleted} className={`${theme === 'dark' ? 'hover:text-veryLightGray' : 'hover:text-veryDarkBlue'} ${filter === 'completed' ? 'text-brightBlue' : 'text-darkGrayishBlue'} text-[14px] font-[400] cursor-pointer`}>Completed</p>
              </div>
            }
            <p className='text-[14px] text-darkGrayishBlue font-[400] mt-12'>Drag and drop to reorder list</p>
          </div>

        </main>
      </div>
    </ThemeContext.Provider>
  )
}

export default App;