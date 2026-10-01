import { CtaLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[100svh] flex-col items-start justify-center pt-24">
      <p className="label text-accent">Ошибка 404</p>
      <h1 className="mt-6 font-serif text-display-xl text-fg">
        Потерялось <em>в тени.</em>
      </h1>
      <p className="mt-6 max-w-md text-body-l text-fg-muted">
        Такой страницы нет — или она переехала. Давайте вернём вас к свету.
      </p>
      <div className="mt-10">
        <CtaLink href="/">На главную</CtaLink>
      </div>
    </div>
  );
}
