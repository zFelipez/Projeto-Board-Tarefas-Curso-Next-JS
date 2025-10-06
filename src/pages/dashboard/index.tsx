import { GetServerSideProps } from 'next';
import styles from './styles.module.css';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import TextArea from '@/src/components/textarea';
import {ChangeEvent, FormEvent, HTMLInputTypeAttribute, useEffect, useState} from 'react' ; 
import { FiShare2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';

import {db} from  '../../services/firebaseConnection' // importa o banco de dados 
import {addDoc, collection,orderBy, query ,where ,onSnapshot, doc, deleteDoc} from 'firebase/firestore' ; // importa os metodos do bcno de dados 

import Link from "next/link" ; 


type HomeProps ={

    user:{
      email:string 
    }
}

type TaskProps= {

   id:string ,
   created:Date, 
   public: boolean,
   tarefa :string  , 
   user: string
}



export default function Dashboard( {user}:HomeProps){ //aqui o Dashboard vai receber os props do nextauth 

  const [input, setInput] = useState("") ; 
  const [publicTask, setPublicTask ] = useState(false);
  const [tasks, setTasks] =useState<TaskProps[]>( []) //é um array que tenha essses elemeentos do taskProp  


  useEffect(()=>{





   async function loadingTarefas(){

    const tarefasRef=  collection(db, 'tarefas');

    const q = query( tarefasRef , orderBy('created', 'desc'), where('user','==', user?.email))
     

    onSnapshot(q,(snapshot)=>{
       let lista = [] as TaskProps[];

       snapshot.forEach((doc)=>{
       

        lista.push({
             id: doc.id,
             tarefa: doc.data().tarefa,
             created: doc.data().created,
             user: doc.data().user ,
             public: doc.data().public,

            
        });
       });


       setTasks(lista )

    })


   }
   loadingTarefas()  
  },[user?.email]) // e bom passar como valor de depencia ja que é algo externo ao useEffect
  

   function handleChangePublic(e: ChangeEvent<HTMLInputElement>) {

        
        setPublicTask(e.target.checked);
   }







   async function handlRegisterTask( e: FormEvent){
    
    e.preventDefault()

    if (input === '') return;
    
     try{
 
      console.log(user?.email )
     await addDoc(collection(db,'tarefas'), { //cria uma documento ou id aelatorio 

      tarefa : input, 
      created : new Date(),
      user: user?.email,
      public: publicTask
     })


     setInput('')
     setPublicTask(false);

     }catch(e){
      console.log(e)
     }
     
   }


   async function handleShare(id:string ){
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_URL}/task/${id}`  // copia a url 
      )

      alert('url copiada com sucesso')
  } 


  async function handleDeleteTask(id:string){
      const docRef=  doc(db,'tarefas', id);
      await deleteDoc(docRef);



  }

  return (
 
    

    <div  className={styles.container}>
      
      <Head>
        <title>Organize suas Tarefas </title>

      </Head>


         <main className={styles.main }> 
          
          
          <section className={styles.content}>


            <div className={styles.contentForm}>


              <h1 className={styles.title}>

               Qual a sua tarefa ?
              </h1>

              <form action=" " onSubmit={handlRegisterTask}>

                <TextArea
                value={ input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>)=> setInput(e.target.value)}
                placeholder='Digite qual a sua tarefa '
                
                ></TextArea>

               <div className={styles.checkboxArea}>

                <input      
                
                checked={publicTask}
                onChange={handleChangePublic}
                type="checkbox" className={styles.checkbox} />
       
                <label > Deixar tarefa publica? </label>

               </div>

               <button className={styles.button} type='submit'> Registrar </button>
              </form>
            </div>
          </section>
          

          <section className={styles.taskContainer}>

          <h1> Minhas Tarefas </h1>


         { tasks.map((item )=>(

             <article key= {item.id } className={styles.task}>

           { item.public && (<div className={styles.tagContainer}>

              <label  className={styles.tag}> PUBLICO </label>
              
              <button className={styles.shareButton} onClick={ ()=> handleShare(item.id)

              }>

              <FiShare2 size={22} color='#3183ff' /> 

              
              
              </button>
            
            </div>)}



            <div className= {styles.taskContent}>

             {item.public ? (

              <Link href= {`/tasks/${item.id}`} 
              ><p> { item.tarefa } </p>
               </Link>  
             ) :  (<p> { item.tarefa } </p>)}

             <button className  ={styles.trashButton} onClick= {()=> handleDeleteTask(item.id)}>

               <FaTrash  size={24}  color='#ea3140' /> 

             </button>



            </div>


          </article>


          ))

         }
          </section>
          
            </main>

    </div>

    
  )

}
 
export const getServerSideProps : GetServerSideProps = async ({req}) =>{

   const session= await getSession({req});


  if(!session?.user){
    return {
       redirect:{
        destination: '/',
        permanent:false 
       }
    }
  }

   return {   // se tem usuario logado por exemplo pode ser retornado para o componente 
   
    props: {
      user:{
        email:session?.user?.email,

      }
    }
   }


}