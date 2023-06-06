import React, { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";




const ExpenseForm = () => {




  const [expenses, setExpenses] = useState([]);
  const [enteredAmount, setEnteredAmount] = useState("");
  const [enteredDescription, setEnteredDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Category");

  const Useremail = localStorage.getItem("mail");
  const ChangesEMail = Useremail.replace("@", "").replace(".", "");

  const email = useRef();
  const des = useRef();
  const categories = useRef();


  useEffect(() => {
    axios
    .get(`https://expense-tracker-dacdc-default-rtdb.firebaseio.com/expenses/${ChangesEMail}.json`)
    .then((response) => {
      const fetchedExpenses = []
      for(let key in response.data){
        fetchedExpenses.push({
          id:key,
          ...response.data[key],
        })
      }
      setExpenses(fetchedExpenses)
    })
    .catch((error) => {
      console.log(error)
    })
  },[])



  const handleSubmit = (event) => {
    event.preventDefault();

    const enteredEmail = email.current.value;
    const enteredDes = des.current.value;
    const enteredCategory = categories.current.value;

    setEnteredAmount("");
    setEnteredDescription("");
    setSelectedCategory("Category");


    axios
    .post(`https://expense-tracker-dacdc-default-rtdb.firebaseio.com/expenses/${ChangesEMail}.json`,{
      amount:enteredEmail,
      description:enteredDes,
      category:enteredCategory
    })
    .then((response) => {
      setExpenses((prevExpenses) => [
        ...prevExpenses, {
          id:response.data.time,
          amount:enteredEmail,
          description:enteredDes,
          category:enteredCategory
        }
      ])
    })
    .catch((error) => {
      console.log(error)
    })

  };


  const handleEdit = (id) => {
    const expenseToUpdate = expenses.find((expense) => expense.id === id);
    setEnteredAmount(expenseToUpdate.amount);
    setEnteredDescription(expenseToUpdate.description);
    setSelectedCategory(expenseToUpdate.category);
  
    // remove the expense that is being edited from the list
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
  };
  




  const handleDelete = (id) => {
    axios
    .delete(`https://expense-tracker-dacdc-default-rtdb.firebaseio.com/expenses/${ChangesEMail}/${id}.json`)
    .then(() => {
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id))
    })
    .catch((error) => {
      console.log(error)
    })
  }


  const totalExpenses = expenses.reduce((total,expense) => total + parseInt(expense.amount),0)
  localStorage.setItem('exp',totalExpenses)
  


  return (
    <>
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          backgroundColor: "yellow",
          color: "blue",
        }}
      >
        <h1>Expense Form</h1>
        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
          <input
            ref={email}
            name="email"
            type="number"
            value={enteredAmount}
            onChange={(event) => setEnteredAmount(event.target.value)}
            placeholder="Enter Amount"
            style={{ padding: "10px", margin: "5px", borderRadius: "10px" }}
          />
          <input
            ref={des}
            name="description"
            type="text"
            value={enteredDescription}
            onChange={(event) => setEnteredDescription(event.target.value)}
            placeholder="Enter Description"
            style={{ padding: "10px", margin: "5px", borderRadius: "10px" }}
          />
          <select
            ref={categories}
            name="categories"
            id=""
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            style={{ padding: "10px", borderRadius: "10px", margin: "5px" }}
          >
            <option value="Category">Category</option>
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Travel">Travel</option>
            <option value="Rent">Rent</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="submit"
            value="Submit"
            style={{
              padding: "10px",
              margin: "5px",
              borderRadius: "10px",
              backgroundColor: "red",
              color: "yellow",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          />
        </form>

        <div style={{ display: "flex", justifyContent: "space-around" }}>

        <h2>Total expenses : {totalExpenses}</h2>

        {totalExpenses > 10000 && (
          <button style={{
            padding: "1px",
            borderRadius: "10px",
            margin: "1px",
            color: "blue",
            backgroundColor: "green",
            cursor: "pointer",
            height:"50px"
          }} onClick={() => alert('Pay 10000 to Activate Premium')}>Activate Premium</button>
        )}

        </div>

        {expenses.length > 0 && (
          <div>
            {expenses.map((expense, index) => (
              <div key={index}>
                <p>
                  Amount : {expense.amount} = Description :{" "}
                  {expense.description} = Category : {expense.category}
                  <button
                    onClick={() => handleEdit(expense.id)}
                    style={{
                      padding: "5px",
                      borderRadius: "10px",
                      margin: "5px",
                      backgroundColor: "red",
                      color: "yellow",
                      backgroundColor: "blue",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    style={{
                      padding: "5px",
                      borderRadius: "10px",
                      margin: "5px",
                      color: "yellow",
                      backgroundColor: "blue",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ExpenseForm;
