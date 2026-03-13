import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LanguageContext = createContext(null)

const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      dashboard: 'Dashboard',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      signedInAs: 'Signed in as',
      language: 'Language',
      role: {
        ngo: 'NGO',
        industry: 'Industry',
        admin: 'Admin',
        user: 'User'
      }
    },
    home: {
      subtitle: 'Protecting Our Oceans, One Credit at a Time',
      systemTo: 'A transparent digital system to:',
      register: 'REGISTER',
      monitor: 'MONITOR',
      verify: 'VERIFY',
      registerSub1: 'Blue Carbon Projects',
      registerSub2: 'Tokenize and Track',
      monitorSub1: 'Real-Time Data',
      monitorSub2: 'Live Analytics',
      verifySub1: 'Certified Credits',
      verifySub2: 'Blockchain Secured',
      explore: 'EXPLORE REGISTRY',
      learnMore: 'LEARN MORE'
    },
    about: {
      ctaTitle: 'Join Us in Protecting Our Oceans',
      ctaDesc: 'Together, we can create a sustainable future by preserving and restoring critical blue carbon ecosystems while supporting climate action.',
      getStarted: 'Get Started'
    },
    login: {
      badge: 'Water Secure Access',
      title: 'BLUE CARBON REGISTRY LOGIN',
      signIn: 'Sign In',
      createAccount: 'Create Account',
      accessSecure: 'Access your portal securely',
      joinRole: 'Join the ecosystem with your role',
      chooseRole: 'Choose Role',
      fullName: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      enterName: 'Enter your full name',
      enterPassword: 'Enter password',
      loading: 'Please wait...',
      noAccount: "Don't have an account? Sign up",
      haveAccount: 'Already have an account? Sign in'
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      about: 'Acerca',
      projects: 'Proyectos',
      dashboard: 'Panel',
      signIn: 'Entrar',
      signOut: 'Salir',
      signedInAs: 'Conectado como',
      language: 'Idioma',
      role: {
        ngo: 'ONG',
        industry: 'Industria',
        admin: 'Admin',
        user: 'Usuario'
      }
    },
    home: {
      subtitle: 'Protegiendo nuestros oceanos, un credito a la vez',
      systemTo: 'Un sistema digital transparente para:',
      register: 'REGISTRAR',
      monitor: 'MONITOREAR',
      verify: 'VERIFICAR',
      registerSub1: 'Proyectos de Carbono Azul',
      registerSub2: 'Tokenizar y Rastrear',
      monitorSub1: 'Datos en Tiempo Real',
      monitorSub2: 'Analitica en Vivo',
      verifySub1: 'Creditos Certificados',
      verifySub2: 'Seguro en Blockchain',
      explore: 'EXPLORAR REGISTRO',
      learnMore: 'SABER MAS'
    },
    about: {
      ctaTitle: 'Unete a Proteger Nuestros Oceanos',
      ctaDesc: 'Juntos podemos crear un futuro sostenible preservando y restaurando ecosistemas criticos de carbono azul mientras apoyamos la accion climatica.',
      getStarted: 'Comenzar'
    },
    login: {
      badge: 'Acceso Seguro Acuatico',
      title: 'INICIO DE SESION REGISTRO CARBONO AZUL',
      signIn: 'Entrar',
      createAccount: 'Crear Cuenta',
      accessSecure: 'Accede a tu portal de forma segura',
      joinRole: 'Unete al ecosistema con tu rol',
      chooseRole: 'Elige Rol',
      fullName: 'Nombre Completo',
      email: 'Correo Electronico',
      password: 'Contrasena',
      enterName: 'Ingresa tu nombre completo',
      enterPassword: 'Ingresa contrasena',
      loading: 'Espera por favor...',
      noAccount: 'No tienes cuenta? Registrate',
      haveAccount: 'Ya tienes cuenta? Inicia sesion'
    }
  },
  fr: {
    nav: {
      home: 'Accueil',
      about: 'A propos',
      projects: 'Projets',
      dashboard: 'Tableau',
      signIn: 'Connexion',
      signOut: 'Deconnexion',
      signedInAs: 'Connecte en tant que',
      language: 'Langue',
      role: {
        ngo: 'ONG',
        industry: 'Industrie',
        admin: 'Admin',
        user: 'Utilisateur'
      }
    },
    home: {
      subtitle: 'Proteger nos oceans, un credit a la fois',
      systemTo: 'Un systeme numerique transparent pour :',
      register: 'ENREGISTRER',
      monitor: 'SURVEILLER',
      verify: 'VERIFIER',
      registerSub1: 'Projets de Carbone Bleu',
      registerSub2: 'Tokeniser et Suivre',
      monitorSub1: 'Donnees en Temps Reel',
      monitorSub2: 'Analytique en Direct',
      verifySub1: 'Credits Certifies',
      verifySub2: 'Securise par Blockchain',
      explore: 'EXPLORER LE REGISTRE',
      learnMore: 'EN SAVOIR PLUS'
    },
    about: {
      ctaTitle: 'Rejoignez-nous pour Proteger Nos Oceans',
      ctaDesc: 'Ensemble, nous pouvons creer un avenir durable en preservant et restaurant les ecosystemes critiques de carbone bleu tout en soutenant l action climatique.',
      getStarted: 'Commencer'
    },
    login: {
      badge: 'Acces Securise Eau',
      title: 'CONNEXION REGISTRE CARBONE BLEU',
      signIn: 'Connexion',
      createAccount: 'Creer un Compte',
      accessSecure: 'Accedez a votre portail en securite',
      joinRole: 'Rejoignez l ecosysteme avec votre role',
      chooseRole: 'Choisir le Role',
      fullName: 'Nom Complet',
      email: 'Adresse Email',
      password: 'Mot de passe',
      enterName: 'Entrez votre nom complet',
      enterPassword: 'Entrez le mot de passe',
      loading: 'Veuillez patienter...',
      noAccount: 'Pas de compte ? Inscrivez-vous',
      haveAccount: 'Deja un compte ? Connectez-vous'
    }
  }
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('lang') || 'en')

  useEffect(() => {
    localStorage.setItem('lang', language)
  }, [language])

  const t = (key) => {
    const value = getNestedValue(translations[language], key)
    if (value !== undefined) return value
    const fallback = getNestedValue(translations.en, key)
    return fallback !== undefined ? fallback : key
  }

  const value = useMemo(() => ({ language, setLanguage, t }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
