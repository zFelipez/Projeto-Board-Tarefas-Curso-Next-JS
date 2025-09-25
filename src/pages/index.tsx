import Head from "next/head";
import styles from "../../styles/home.module.css";
import Image from 'next/image';

import heroImg from '../../public/assets/hero.png'


export default function Home() {
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

            <span> +12 posts </span>


            </section>

             <section className={styles.box}>   

            <span> +90 comentarios </span>


            </section>


       </div>
   
          
      </div>
    </>
  );
}
