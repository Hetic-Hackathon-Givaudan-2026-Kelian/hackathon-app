import Header from "../components/Header";
import { ChatIcon, ExploreIcon, SendIcon, UserIcon } from "../components/Icons";
import Visual from "../components/Visual";

type Props = {
  onStart: () => void;
};

const STEPS = [
  {
    icon: <ChatIcon />,
    title: "Parlez de votre idée librement",
    text: "Une envie, une inspiration… Dites-le avec vos mots.",
  },
  {
    icon: <ExploreIcon />,
    title: "Explorez les possibilités à votre rythme",
    text: "Échangez avec Umi, découvrez des pistes et précisez vos préférences.",
  },
  {
    icon: <SendIcon />,
    title: "Envoyez votre demande facilement",
    text: "Votre projet est prêt à être partagé avec nos experts.",
  },
];

/** Page d'accueil, d'après la maquette « Landing page ». */
export default function Landing({ onStart }: Props) {
  return (
    <div className="page landing">
      <Header>
        <button className="btn btn-outline btn-small" onClick={onStart}>
          <UserIcon />
          Espace client
        </button>
      </Header>

      <section className="hero">
        <Visual
          variant="peach"
          image="/images/hero.png"
          className="hero-visual"
        />
        <div className="hero-text">
          <h1>
            Une nouvelle façon
            <br />
            de parler saveurs
            <br />
            avec Umi
          </h1>
          <button className="btn btn-dark" onClick={onStart}>
            Accéder à mon espace client <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <section className="steps">
        {STEPS.map((step) => (
          <article key={step.title} className="step">
            <span className="step-icon">{step.icon}</span>
            <h2>{step.title}</h2>
            <p>{step.text}</p>
          </article>
        ))}
      </section>

      <section className="showcase">
        <p className="eyebrow">Avec Umi</p>
        <h2>
          Un échange naturel, comme avec
          <br />
          un interlocuteur dédié.
        </h2>
        <div className="sample-chat">
          <p className="sample-label sample-label-right">Vous</p>
          <p className="bubble-msg bubble-user">
            On voudrait un arôme fruité pour une boisson. Quelque chose de
            frais, qui rappelle un peu l'été. Pas forcément un fruit en
            particulier mais plutôt cette sensation quand il fait chaud et qu'on
            a envie de boire quelque chose de vraiment rafraîchissant.
          </p>
          <p className="sample-label">Umi</p>
          <p className="bubble-msg bubble-umi">
            Et cette sensation de fraîcheur, vous l'imaginez plutôt douce et
            légère ou plus vive, avec une petite touche acidulée ?
          </p>
        </div>
      </section>
    </div>
  );
}
