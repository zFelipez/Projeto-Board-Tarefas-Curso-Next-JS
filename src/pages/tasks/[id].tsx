import Head from  'next/head';
import styles from  './styles.module.css' ; 
import { GetServerSideProps } from 'next';
import{ useSession} from  'next-auth/react'; 
import {db} from '../../services/firebaseConnection'; 
import {FaTrash} from 'react-icons/fa'
import { doc, where, query, collection, getDoc, addDoc, getDocs, deleteDoc}  from  'firebase/firestore';
import { redirect } from 'next/dist/server/api-utils';
import TextArea from '@/src/components/textarea';
import { ChangeEvent, FormEvent, useState } from 'react';
 







type TaskProps = {
     
     item: {

        tarefa: string ,
        created: string ,
        public:boolean ,  
        user: string,
        taskId: string 

     }
    allComments :CommentProps[] 
    }
 
type CommentProps = {

    id: string,
    comment: string,
    taskId: string, 
    user: string,
    name: string 

}
      

export default function Task({item, allComments} : TaskProps, ){  // ele recebe as props do getServerSideProps  
     


    const [input,setInput] = useState('');
    const {data:session} = useSession();
    const [comments, setComments] = useState<CommentProps[]>(allComments || []);

 

    function handleInput(e:ChangeEvent<HTMLTextAreaElement>) {

        setInput(e.target?.value); 

        
    }


    async function handleComment( e: FormEvent){


         e.preventDefault();

        if(input === '') return ;

        if(!session?.user?.email || !session?.user?.name)return ;

        try{

        const docRef = await addDoc(collection(db, 'comments'), {
            comment: input,
            created: new Date(),
            user : session?.user?.email,
            name: session?.user?.name, 
            taskId: item?.taskId, 

        }); 
         
        const  data = {
            id: docRef.id , 
            comment: input , 
            user: session?.user?.email,
            name: session?.user?.name,
            taskId: item.taskId
        }

        setComments((oldItems)=> [...oldItems,data])

        setInput(''); 

        }catch(e){

            console.log(e)
        }
        
    }

    async function handleDeleteComment(id:string ){

       try{
      
       const docRef= doc(db, 'comments', id ); 

       await deleteDoc(docRef); 
 
       const deleteComment =  comments.filter((item)=> item.id !== id );


       setComments(deleteComment); 



       }catch(e){
        console.log(e)
       }

    }



    return (


        <div  className={styles.container}>


       <Head> 

          <title> Detaçhes da tarefa </title>
       </Head>



       <main className={styles.main}>

        <h1> Tarefa </h1>

       <article className ={styles.task}>

          <p>

            {item.tarefa}

          </p>

       </article>

       </main>


       <section className= {styles.commentsContainer}>
        <h2> Deixar comentario</h2>


        <form onSubmit= {handleComment} >

          <TextArea placeholder=' Digite seu comentario' value={input} onChange={ (e:ChangeEvent<HTMLTextAreaElement>)=> handleInput(e)}/>


          <button className={styles.button  } disabled ={ !session?.user  }> Comentar </button>


           


        </form>



       </section>

       <section className={styles.commentsContainer}>



        <h2>  Todos comentarios </h2>


        {comments.length === 0 && (

            <span> Nenhum comentario ainda </span>
        )}

        {comments.map((item)=> (
              

              <article className={styles.comment} key={item.id}>

               <div className= { styles.headComment}>

                <label className= {  styles.commentsLabel}> {item.name}</label>
               
                  
               { 

               item.user === session?.user?.email && 
               (<button onClick= {()=> handleDeleteComment(item.id)} className= { styles.buttonTrash}> <FaTrash size={18 } color = '#EA3140'> </FaTrash></button>)
                                  
            }
               </div>
               <p> {item.comment} 
                
                  </p>
              </article>
        ))}
       </section>



        </div>
    )
}






export const getServerSideProps : GetServerSideProps = async ({params}) =>{

    const id =  params?.id as string; //parametros da url 
     

    const docRef = doc(db,'tarefas',id); 

    const q = query(collection(db, 'comments'), where('taskId','==',id));
    const snapshotComments=  await getDocs(q)// getDocs e nao getDoc , pois quero pegar todos os comentarios

    let allComments:CommentProps[]= [];

    const snapshot=  await getDoc(docRef); 
    snapshotComments.forEach((doc)=>{
        allComments.push({ 

    id:  doc.id,
    comment: doc.data().comment,
    taskId: doc.data().taskId,
    user: doc.data().user,
    name: doc.data().name, 


        })


    console.log(allComments);
    })

    if ( snapshot.data() === undefined  ||  !snapshot.data()?.public ) {

        return { 
            redirect:{
                destination:'/',
                permanent: false
            }
        }
    }

    
    const milliseconds=  snapshot.data()?.created?.seconds * 1000;


    const task= {
      
        tarefa: snapshot.data()?.tarefa, 
        public: snapshot.data()?.public, 
        created: new Date(milliseconds).toLocaleDateString(),
        user: snapshot.data()?.user,
        taskId: id, 
    }

     
      


   return {   
   
    props: {

        item: task ,
        allComments: allComments
     
    }
   }


}