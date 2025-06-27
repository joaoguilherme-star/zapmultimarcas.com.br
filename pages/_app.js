// pages/_app.js
import Head from 'next/head'; // Importa o componente Head do Next.js para gerir o <head>
import '../styles/style.css'; // Importa o seu ficheiro CSS global

// Este é o componente de aplicação customizado do Next.js.
// Ele envolve todos os outros componentes de página e é onde o CSS global deve ser importado.
function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* O componente Head gerencia os elementos na secção <head> do documento HTML. */}
      {/* Os links para Font Awesome e Poppins são importados aqui globalmente. */}
      <Head>
        <title>ZAP Multimarcas</title> {/* Título padrão para todas as páginas */}
        <link rel="icon" type="image/png" href="https://res.cloudinary.com/duk5infgc/image/upload/v1751050225/LOGO_ZAP_MULTIMARCAS_mep5ef.png" /> {/* Favicon */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /> {/* Adicionado crossOrigin */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* O script do Font Awesome kit deve ser carregado via next/script com estratégia 'afterInteractive' em um Next.js real,
            mas para compatibilidade com o ambiente e se for incluído como HTML puro, pode ficar assim. */}
        {/* <script src="https://kit.fontawesome.com/a076d05399.js" crossOrigin="anonymous"></script> */}
      </Head>
      {/* O Component representa o componente da página atual (ex: index.js, [id].js) */}
      {/* pageProps são as props passadas para o componente da página. */}
      <Component {...pageProps} />
    </>
  );
}

// Exporta o componente MyApp como exportação padrão.
// O Next.js requer que _app.js tenha uma exportação padrão que seja um componente React.
export default MyApp;
