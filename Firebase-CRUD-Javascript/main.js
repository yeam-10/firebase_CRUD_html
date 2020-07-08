/* Import Firebase*/

const db = firebase.firestore();


const taskform = document.getElementById('task-form');
const taskContainer = document.getElementById('task-container');

let editStatus = false;
let id = '';

/* Save in database*/

const saveTask = (title, description) =>

    db.collection('tasks').doc().set({
        title,
        description

    })

/* method Get Delete Edit task*/

const getTask = () => db.collection('tasks').get();

const getTaksE = id => db.collection('tasks').doc(id).get();

const ongetTasks = (callback) => db.collection('tasks').onSnapshot(callback);

const deleteTask = id => db.collection('tasks').doc(id).delete();

const updateTask = (id, updateTask1) => db.collection('tasks').doc(id).update(id, updateTask1);

window.addEventListener('DOMContentLoaded', async(e) => {


    ongetTasks((querySnapshot) => {
        taskContainer.innerHTML = '';

        querySnapshot.forEach(doc => {


            const taskget = doc.data();
            taskget.id = doc.id;



            taskContainer.innerHTML += ` <div class= " card card-body mt-2 border-primary">
              <h3 class= "h5"> ${taskget.title} </h3>
              <p>  ${taskget.description}</p>
    
              <div> <button class="btn btn-primary btn-delete" data-id="${taskget.id}" >Delete</button>
              <button class="btn btn-warning btn-edit" data-id="${taskget.id}" >Edit</button>
              </div>
             
            </div>`;

            /*Delete */
            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async(e) => {


                    await deleteTask(e.target.dataset.id)
                })
            });

            /* Edit  */

            const btnEdit = document.querySelectorAll('.btn-edit');
            btnEdit.forEach(btn => {
                btn.addEventListener('click', async(e) => {

                    const doc = await getTaksE(e.target.dataset.id);


                    const taskget = doc.data();

                    editStatus = true;
                    id = doc.id;

                    taskform['task-title'].value = taskget.title;
                    taskform['task-description'].value = taskget.description;
                    taskform['btn-task-form'].innerText = 'Update';
                })

            });


        });


    });


});

/*Call event*/

taskform.addEventListener('submit', async(e) => {
    e.preventDefault();

    const title = taskform['task-title'];
    const description = taskform['task-description'];

    if (!editStatus) {
        await saveTask(title.value, description.value);

    } else {
        await updateTask(id, {

            title: title.value,
            description: description.value
        });

        editStatus = false;
        id = '';
        taskform['btn-task-form'].innerText = 'Save';

    }

    await getTask();
    taskform.reset();
    title.focus();

    console.log(title, description);
})