import { GetServerSideProps } from 'next';
import styles from './styles.module.css';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import TextArea from '@/src/components/textarea';

import { FiShare2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';


export default function Dashboard(){

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

              <form action=" ">

                <TextArea
                
                placeholder='Digite qual a sua tarefa '
                
                ></TextArea>

               <div className={styles.checkboxArea}>

                <input type="checkbox" className={styles.checkbox} />
       
                <label > Deixar tarefa publica? </label>

               </div>

               <button className={styles.button} type='submit'> Registrar </button>
              </form>
            </div>
          </section>
          

          <section className={styles.taskContainer}>

          <h1> Minhas Tarefas </h1>


          <article className={styles.task}>

            <div className={styles.tagContainer}>

              <label  className={styles.tag}> PUBLICO </label>
              <button className={styles.shareButton}>

              <FiShare2 size={22} color='#3183ff' /> 

              </button>
            </div>

            <div className= {styles.taskContent}>

             <p> Minha primeria tarefa de exemplo </p>

             <button className={styles.trashButton}>

               <FaTrash  size={24}  color='#ea3140'/> 

             </button>



            </div>


          </article>

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

   return {

    props: {}
   }


}