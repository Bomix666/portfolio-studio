import { CtaLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[100svh] flex-col items-start justify-center pt-24">
      <h1 className="font-serif text-display-xl text-fg">
        Потерялось <em>в тени.</em>
      </h1>
      <p className="mt-8 max-w-md text-body-l text-fg-muted">
        Ошибка 404: такой страницы нет — или она переехала. Давайте вернём вас к свету.
      </p>
      <div className="mt-10">
        <CtaLink href="/">На главную</CtaLink>
      </div>
    </div>
  );
}
