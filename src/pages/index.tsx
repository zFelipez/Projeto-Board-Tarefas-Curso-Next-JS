import { GetStaticProps } from "next";
import Head from "next/head";
import styles from "../../styles/home.module.css";
import Image from 'next/image';
import { db } from "../services/firebaseConnection";
import heroImg from '../../public/assets/hero.png'
import {getDocs,collection}  from 'firebase/firestore'; 


type HomeProps= {
   posts: number ; 
   comments:  number ; 

}



export default function Home({posts, comments}: HomeProps ) {
  return (
    <>
      <Head>
        <title>Organize suas Tarefas </title>

      </Head>
      <div
        className={styles.container} >




        <main className={styles.main}>

          <div className={styles.logoContent}></div>
          <Image className={styles.hero}
            alt="imagem hero"
            src={heroImg}
            priority //prioriza o carregamento da imagem


          >
          </Image>
        </main>




        <h1 className={styles.h1}>Sistema feito para voce organizar <br />
          seus estudos.
        </h1>

       <div className={styles.infoContent}>


           <section className={styles.box}>   

            <span> +{posts} posts </span>


            </section>

             <section className={styles.box}>   

            <span> +{comments} comentarios </span>


            </section>


       </div>
   
          
      </div>
    </>
  );
}


export const getStaticProps : GetStaticProps = async ()=>{


  const  commentRef =  collection(db,'comments');
  const commentSnapshot=  await getDocs(commentRef);
  
  const postRef=  collection (db,' tarefas');
  const postSnapshot=  await getDocs(postRef ); 

   




  return {

   props : {

      posts: postSnapshot.size || 0 ,
      comments: commentSnapshot.size || 0 

   },
   revalidate: 60 // passa o segundos para que meio que atualize de novo a pagina se não fica estatica para sempre 
}
}