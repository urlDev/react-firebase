import React from 'react';
import firebase from './firebase';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [schools, setSchools] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const ref = firebase.firestore().collection('schools');

  const getSchools = () => {
    setLoading(true);
    // snapshot makes the request instantly when something changes in firestore
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setSchools(items);
      setLoading(false);
    });
  };

  React.useEffect(() => {
    getSchools();
  }, []);

  const addSchool = (newSchool) => {
    ref
      // we create it with id instead of id given by firestore
      .doc(newSchool.id)
      .set(newSchool)
      .catch((err) => {
        console.log(err);
      });
    setTitle('');
    setDescription('');
  };

  const deleteSchool = (school) => {
    ref
      .doc(school.id)
      .delete()
      .catch((err) => console.log(err));
  };

  const editSchool = (updateSchool) => {
    ref
      .doc(updateSchool.id)
      .update(updateSchool)
      .catch((err) => console.log(err));
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>Schools</h1>

      <h3>Add new</h3>
      <div className="inputBox">
        <input
          type="text"
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <textarea
          placeholder="description"
          cols="30"
          rows="10"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button onClick={() => addSchool({ title, description, id: uuidv4() })}>
          Submit
        </button>
      </div>
      {schools.map((school) => (
        <div key={school.id}>
          <h2>{school.title}</h2>
          <p>{school.description}</p>
          <button onClick={() => deleteSchool(school)}>Delete</button>
          <button
            onClick={() =>
              editSchool({ title: school.title, description, id: school.id })
            }
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
